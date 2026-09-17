-- ============================================================
-- Lotosphere RLS Policies
-- Migration 002: Row Level Security
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: is_admin
-- SECURITY DEFINER bypasses RLS on public.profiles, preventing
-- infinite recursion when checking admin status in RLS policies.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = TRUE
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ============================================================
-- PROFILES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Users can insert their own profile (needed for upsert in authService.js)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile (prevent granting self admin)
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (is_admin = FALSE OR public.is_admin())
  );

-- ============================================================
-- CATEGORIES
-- Public read, admin write
-- ============================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
CREATE POLICY "categories_insert_admin"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
CREATE POLICY "categories_update_admin"
  ON public.categories FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;
CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- PRODUCTS
-- Public read, admin write
-- ============================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "products_update_admin" ON public.products;
CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- CART ITEMS
-- Users can only manage their own cart
-- ============================================================
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cart_select_own" ON public.cart_items;
CREATE POLICY "cart_select_own"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_insert_own" ON public.cart_items;
CREATE POLICY "cart_insert_own"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_update_own" ON public.cart_items;
CREATE POLICY "cart_update_own"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_delete_own" ON public.cart_items;
CREATE POLICY "cart_delete_own"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- ORDERS
-- Users see their own orders; admins see all
-- Orders are created exclusively via the place_order RPC (SECURITY DEFINER)
-- ============================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Own orders (by user_id or authenticated email)
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR
    (auth.jwt() ->> 'email' IS NOT NULL AND email = (auth.jwt() ->> 'email'))
  );

-- Admin can see all orders
DROP POLICY IF EXISTS "orders_select_admin" ON public.orders;
CREATE POLICY "orders_select_admin"
  ON public.orders FOR SELECT
  USING (public.is_admin());

-- Only admin can update order status
DROP POLICY IF EXISTS "orders_update_admin" ON public.orders;
CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- ORDER ITEMS
-- Readable by order owner and admins
-- Inserted exclusively via place_order RPC (SECURITY DEFINER)
-- ============================================================
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND (
        (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR
        (auth.jwt() ->> 'email' IS NOT NULL AND email = (auth.jwt() ->> 'email'))
      )
    )
  );

DROP POLICY IF EXISTS "order_items_select_admin" ON public.order_items;
CREATE POLICY "order_items_select_admin"
  ON public.order_items FOR SELECT
  USING (public.is_admin());

-- ============================================================
-- NOTIFICATION LOG
-- Only admins can read and update; inserted exclusively via place_order RPC (SECURITY DEFINER)
-- ============================================================
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notification_log_select_admin" ON public.notification_log;
CREATE POLICY "notification_log_select_admin"
  ON public.notification_log FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "notification_log_update_admin" ON public.notification_log;
CREATE POLICY "notification_log_update_admin"
  ON public.notification_log FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- PLANT REVIEWS
-- Public can read approved/featured; anyone can submit; admin manages
-- ============================================================
ALTER TABLE public.plant_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plant_reviews_select_public" ON public.plant_reviews;
CREATE POLICY "plant_reviews_select_public"
  ON public.plant_reviews FOR SELECT
  USING (status IN ('approved', 'featured'));

DROP POLICY IF EXISTS "plant_reviews_select_admin" ON public.plant_reviews;
CREATE POLICY "plant_reviews_select_admin"
  ON public.plant_reviews FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "plant_reviews_insert_public" ON public.plant_reviews;
CREATE POLICY "plant_reviews_insert_public"
  ON public.plant_reviews FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "plant_reviews_update_admin" ON public.plant_reviews;
CREATE POLICY "plant_reviews_update_admin"
  ON public.plant_reviews FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "plant_reviews_delete_admin" ON public.plant_reviews;
CREATE POLICY "plant_reviews_delete_admin"
  ON public.plant_reviews FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- COMPANY FEEDBACK
-- Public can read approved/featured; anyone can submit; admin manages
-- ============================================================
ALTER TABLE public.company_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "company_feedback_select_public" ON public.company_feedback;
CREATE POLICY "company_feedback_select_public"
  ON public.company_feedback FOR SELECT
  USING (status IN ('approved', 'featured'));

DROP POLICY IF EXISTS "company_feedback_select_admin" ON public.company_feedback;
CREATE POLICY "company_feedback_select_admin"
  ON public.company_feedback FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "company_feedback_insert_public" ON public.company_feedback;
CREATE POLICY "company_feedback_insert_public"
  ON public.company_feedback FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "company_feedback_update_admin" ON public.company_feedback;
CREATE POLICY "company_feedback_update_admin"
  ON public.company_feedback FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "company_feedback_delete_admin" ON public.company_feedback;
CREATE POLICY "company_feedback_delete_admin"
  ON public.company_feedback FOR DELETE
  USING (public.is_admin());

NOTIFY pgrst, 'reload schema';
