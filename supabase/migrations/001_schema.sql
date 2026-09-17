-- ============================================================
-- Lotosphere Database Schema
-- Migration 001: Core Tables
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extended user profile (linked to auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  address     TEXT,
  city        TEXT,
  state       TEXT,
  pincode     TEXT,
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES
-- Product categories (e.g. Indoor, Outdoor, Succulents)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- The core plant product catalogue
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT,
  price             NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  sale_price        NUMERIC(10, 2) CHECK (sale_price >= 0),
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url         TEXT,
  additional_images TEXT[] DEFAULT '{}',
  stock             INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured          BOOLEAN NOT NULL DEFAULT FALSE,
  care_level        TEXT CHECK (care_level IN ('Easy', 'Moderate', 'Expert')),
  light_requirement TEXT CHECK (light_requirement IN ('Low', 'Medium', 'Bright Indirect', 'Full Sun')),
  water_requirement TEXT CHECK (water_requirement IN ('Low', 'Moderate', 'High')),
  pet_friendly      BOOLEAN NOT NULL DEFAULT FALSE,
  air_purifying     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for full-text search on name
CREATE INDEX IF NOT EXISTS products_name_idx ON public.products USING GIN (to_tsvector('english', name));
-- Index for category filter
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category_id);
-- Index for featured products
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products(featured) WHERE featured = TRUE;

-- ============================================================
-- CART ITEMS
-- Persisted cart for logged-in users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS cart_items_user_idx ON public.cart_items(user_id);

-- ============================================================
-- ORDERS
-- Customer orders
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name   TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  pincode         TEXT NOT NULL,
  total_amount    NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (
                    status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
                  ),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_user_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_created_idx ON public.orders(created_at DESC);

-- ============================================================
-- ORDER ITEMS
-- Line items for each order (prices locked at purchase time)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items(order_id);

-- ============================================================
-- NOTIFICATIONS LOG
-- Server-side log of notification events (admin-visible)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notification_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        TEXT NOT NULL, -- 'order_confirmed', 'new_order_admin', etc.
  recipient   TEXT NOT NULL, -- email address
  order_id    UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notification_log_order_idx ON public.notification_log(order_id);

-- ============================================================
-- TRIGGERS
-- Auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- PLANT REVIEWS
-- Customer reviews for individual products
-- ============================================================
CREATE TABLE IF NOT EXISTS public.plant_reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  product_id    UUID REFERENCES public.products(id) ON DELETE SET NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review        TEXT,
  photo_url     TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (
                  status IN ('pending', 'approved', 'featured', 'rejected', 'hidden')
                ),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER plant_reviews_updated_at
  BEFORE UPDATE ON public.plant_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- COMPANY FEEDBACK
-- General company / service feedback
-- ============================================================
CREATE TABLE IF NOT EXISTS public.company_feedback (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback      TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (
                  status IN ('pending', 'approved', 'featured', 'rejected', 'hidden')
                ),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER company_feedback_updated_at
  BEFORE UPDATE ON public.company_feedback
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- FUNCTION: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: Place order (atomic - verifies stock, creates order,
-- reduces stock, clears cart) - called via RPC
-- ============================================================
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
  IF jsonb_array_length(p_items) = 0 THEN
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
      RAISE EXCEPTION 'Product % not found', v_item->>'product_id';
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

  -- Log notification events (to be picked up by edge function or webhook)
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

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

