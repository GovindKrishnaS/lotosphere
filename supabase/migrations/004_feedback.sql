-- ============================================================
-- Migration 004: Feedback & Reviews Tables
-- ============================================================

-- Plant Reviews table
CREATE TABLE IF NOT EXISTS public.plant_reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id    UUID REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review        TEXT NOT NULL,
  photo_url     TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS plant_reviews_product_idx ON public.plant_reviews(product_id);
CREATE INDEX IF NOT EXISTS plant_reviews_status_idx ON public.plant_reviews(status);

-- Company Feedback table
CREATE TABLE IF NOT EXISTS public.company_feedback (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS company_feedback_status_idx ON public.company_feedback(status);

-- Enable RLS
ALTER TABLE public.plant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_feedback ENABLE ROW LEVEL SECURITY;

-- Public can view approved or featured reviews
CREATE POLICY "Public can view approved/featured plant reviews"
  ON public.plant_reviews FOR SELECT
  USING (status IN ('approved', 'featured'));

CREATE POLICY "Public can view approved/featured company feedback"
  ON public.company_feedback FOR SELECT
  USING (status IN ('approved', 'featured'));

-- Users can insert their own feedback
CREATE POLICY "Anyone can submit plant reviews"
  ON public.plant_reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit company feedback"
  ON public.company_feedback FOR INSERT
  WITH CHECK (true);

-- Admins full access
CREATE POLICY "Admins full access to plant_reviews"
  ON public.plant_reviews FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admins full access to company_feedback"
  ON public.company_feedback FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
