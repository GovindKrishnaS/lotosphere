-- ============================================================
-- Lotosphere Migration 008: Supabase Storage Bucket for Feedback Photos
-- Creates feedback-photos bucket and sets RLS policies
-- ============================================================

-- 1. Create storage bucket 'feedback-photos' if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'feedback-photos',
  'feedback-photos',
  TRUE,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = TRUE,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Public Select Policy (Allows anyone to read uploaded feedback photos)
DROP POLICY IF EXISTS "feedback_photos_public_select" ON storage.objects;
CREATE POLICY "feedback_photos_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'feedback-photos');

-- 4. Anyone Insert Policy (Allows customers/guests to upload feedback photos)
DROP POLICY IF EXISTS "feedback_photos_public_insert" ON storage.objects;
CREATE POLICY "feedback_photos_public_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'feedback-photos');

-- 5. Admin Full Management Policy (Allows administrators to delete/update files)
DROP POLICY IF EXISTS "feedback_photos_admin_all" ON storage.objects;
CREATE POLICY "feedback_photos_admin_all"
  ON storage.objects FOR ALL
  USING (bucket_id = 'feedback-photos' AND public.is_admin())
  WITH CHECK (bucket_id = 'feedback-photos' AND public.is_admin());

NOTIFY pgrst, 'reload schema';
