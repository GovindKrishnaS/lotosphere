-- ============================================================
-- Lotosphere Migration 007: Review & Feedback System Upgrade
-- Adds company_reviews table, is_demo flags, and seeds demo reviews
-- ============================================================

-- 1. Ensure plant_reviews has is_demo column
ALTER TABLE public.plant_reviews ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Create company_reviews table (Homepage Testimonials / Company Rating Reviews)
CREATE TABLE IF NOT EXISTS public.company_reviews (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name  TEXT NOT NULL,
  customer_title TEXT,
  rating         INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review         TEXT NOT NULL,
  photo_url      TEXT,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
  is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS company_reviews_status_idx ON public.company_reviews(status);
CREATE INDEX IF NOT EXISTS company_reviews_featured_idx ON public.company_reviews(is_featured);

-- 3. Ensure company_feedback has is_demo column & email column if missing
ALTER TABLE public.company_feedback ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.company_feedback ADD COLUMN IF NOT EXISTS email TEXT;

-- 4. Enable RLS on company_reviews
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for company_reviews
DROP POLICY IF EXISTS "company_reviews_select_public" ON public.company_reviews;
CREATE POLICY "company_reviews_select_public"
  ON public.company_reviews FOR SELECT
  USING (status IN ('approved', 'featured'));

DROP POLICY IF EXISTS "company_reviews_insert_public" ON public.company_reviews;
CREATE POLICY "company_reviews_insert_public"
  ON public.company_reviews FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "company_reviews_admin_all" ON public.company_reviews;
CREATE POLICY "company_reviews_admin_all"
  ON public.company_reviews FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. Ensure RLS on plant_reviews & company_feedback use public.is_admin()
DROP POLICY IF EXISTS "plant_reviews_admin_all" ON public.plant_reviews;
CREATE POLICY "plant_reviews_admin_all"
  ON public.plant_reviews FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "company_feedback_admin_all" ON public.company_feedback;
CREATE POLICY "company_feedback_admin_all"
  ON public.company_feedback FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. Seed Demo Company Reviews (Homepage Testimonials)
INSERT INTO public.company_reviews (id, customer_name, customer_title, rating, review, photo_url, status, is_featured, is_demo)
VALUES
(
  'e1000000-0000-0000-0000-000000000001',
  'Julian Sterling',
  'Landscape Architect, Kochi',
  5,
  'Lotosphere has redefined how I interact with living spaces. Packaging was eco-friendly and 100% plastic-free with pristine healthy specimens.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'featured',
  TRUE,
  TRUE
),
(
  'e1000000-0000-0000-0000-000000000002',
  'Amara Okafor',
  'Interior Designer, Mumbai',
  5,
  'The plant soulmate quiz matched me with a Calathea that thrives in my low-light apartment. Phenomenal customer support and botanical quality!',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  'featured',
  TRUE,
  TRUE
),
(
  'e1000000-0000-0000-0000-000000000003',
  'David Vance',
  'Botanical Enthusiast, Bengaluru',
  5,
  'Exceptional specimens delivered straight from solar nurseries. Each plant comes in mineral pots with tailored care guides.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
  'featured',
  TRUE,
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Demo Plant Reviews
INSERT INTO public.plant_reviews (id, product_id, customer_name, rating, review, photo_url, status, is_demo)
VALUES
(
  'f1000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000001',
  'Elena Vance',
  5,
  'The split leaves on this Monstera are breathtaking. Arrived in pristine condition with lush aerial roots!',
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
  'featured',
  TRUE
),
(
  'f1000000-0000-0000-0000-000000000002',
  'd1000000-0000-0000-0000-000000000001',
  'Marcus Thorne',
  5,
  'Thriving impeccably in my living room corner! New fenestrated leaves unfurled within two weeks.',
  'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=600&q=80',
  'approved',
  TRUE
),
(
  'f1000000-0000-0000-0000-000000000003',
  'd1000000-0000-0000-0000-000000000001',
  'Sophia Chen',
  5,
  'Pure botanical elegance. The stark dark green foliage brings calm tranquility to my home studio.',
  'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=600&q=80',
  'featured',
  TRUE
)
ON CONFLICT (id) DO NOTHING;

NOTIFY pgrst, 'reload schema';
