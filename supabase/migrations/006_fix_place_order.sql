-- ============================================================
-- Lotosphere Migration 006: Ensure place_order RPC Function
-- Fixes RPC schema cache lookup error in Supabase PostgREST
-- ============================================================

-- Safely drop any existing typed function signature for place_order to avoid overload ambiguity
DROP FUNCTION IF EXISTS public.place_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB);

-- Create the authoritative place_order function
CREATE OR REPLACE FUNCTION public.place_order(
  p_customer_name TEXT,
  p_email         TEXT,
  p_phone         TEXT,
  p_address       TEXT,
  p_city          TEXT,
  p_state         TEXT,
  p_pincode       TEXT,
  p_notes         TEXT,
  p_items         JSONB  -- [{product_id, quantity}]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id    UUID;
  v_total       NUMERIC(10,2) := 0;
  v_item        JSONB;
  v_product     RECORD;
  v_user_id     UUID;
  v_unit_price  NUMERIC(10,2);
BEGIN
  -- Get current user (NULL if guest checkout)
  v_user_id := auth.uid();

  -- Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Verify stock and calculate total from DB prices (never trust client prices)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, name, price, sale_price, stock
    INTO v_product
    FROM public.products
    WHERE id = (v_item->>'product_id')::UUID;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % not found', (v_item->>'product_id');
    END IF;

    IF v_product.stock < (v_item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Insufficient stock for product: %', v_product.name;
    END IF;

    -- Use sale price if available, otherwise regular price
    v_unit_price := COALESCE(v_product.sale_price, v_product.price);
    v_total := v_total + (v_unit_price * (v_item->>'quantity')::INTEGER);
  END LOOP;

  -- Create the order
  INSERT INTO public.orders (
    user_id, customer_name, email, phone,
    address, city, state, pincode, total_amount, notes
  )
  VALUES (
    v_user_id, p_customer_name, p_email, p_phone,
    p_address, p_city, p_state, p_pincode, v_total, p_notes
  )
  RETURNING id INTO v_order_id;

  -- Create order items & reduce stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, name, price, sale_price
    INTO v_product
    FROM public.products
    WHERE id = (v_item->>'product_id')::UUID;

    v_unit_price := COALESCE(v_product.sale_price, v_product.price);

    INSERT INTO public.order_items (
      order_id, product_id, product_name, quantity, unit_price
    )
    VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      v_product.name,
      (v_item->>'quantity')::INTEGER,
      v_unit_price
    );

    -- Atomically reduce stock
    UPDATE public.products
    SET stock = stock - (v_item->>'quantity')::INTEGER
    WHERE id = (v_item->>'product_id')::UUID;
  END LOOP;

  -- Clear cart for logged-in users
  IF v_user_id IS NOT NULL THEN
    DELETE FROM public.cart_items WHERE user_id = v_user_id;
  END IF;

  -- Log notification events
  INSERT INTO public.notification_log (type, recipient, order_id, status)
  VALUES
    ('order_confirmed', p_email, v_order_id, 'pending'),
    ('new_order_admin', 'admin@lotosphere.com', v_order_id, 'pending');

  RETURN jsonb_build_object(
    'success', TRUE,
    'order_id', v_order_id,
    'total', v_total
  );
END;
$$;

-- Grant execution privileges to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.place_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;

-- Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
