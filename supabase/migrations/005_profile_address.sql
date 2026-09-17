-- ============================================================
-- Lotosphere Database Migration 005
-- Profile Address Fields and Complete RLS Policies
-- ============================================================

-- 1. Add customer address columns to profiles table if they don't already exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS pincode TEXT;

-- 2. Ensure Row Level Security is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing INSERT policy if any to avoid duplication
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- 4. Create INSERT policy allowing authenticated users to create/upsert their own profile
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id
  );

-- 5. Ensure UPDATE policy is robust and prevents privilege escalation
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from escalating their own admin status
    is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- 6. Ensure SELECT policy allows users to view their own profile
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 7. Ensure Admin SELECT policy exists
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
