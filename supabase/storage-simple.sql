-- ============================================================
-- 🌳 Gia Phả Điện Tử — Storage Setup (Simplified)
-- ============================================================

-- ╔══════════════════════════════════════════════════════════╗
-- ║  1. STORAGE BUCKET                                      ║
-- ╚══════════════════════════════════════════════════════════╝

-- Xóa bucket cũ nếu có (tùy chọn)
-- DELETE FROM storage.buckets WHERE id = 'media';

-- Tạo bucket cho media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    10485760,
    ARRAY[
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/mpeg', 'video/quicktime',
        'application/pdf'
    ]::text[]
)
ON CONFLICT (id) DO NOTHING;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  2. STORAGE POLICIES (Simplified)                       ║
-- ╚══════════════════════════════════════════════════════════╝

-- DROP old policies if exist
DROP POLICY IF EXISTS "public can view published media" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can upload media" ON storage.objects;
DROP POLICY IF EXISTS "users can view own media" ON storage.objects;
DROP POLICY IF EXISTS "admin can view all media" ON storage.objects;
DROP POLICY IF EXISTS "users can delete own media" ON storage.objects;
DROP POLICY IF EXISTS "admin can delete all media" ON storage.objects;

-- Public có thể đọc file đã published
CREATE POLICY "public can view published media"
ON storage.objects FOR SELECT
TO public
USING (
    bucket_id = 'media'
);

-- Authenticated user có thể upload
CREATE POLICY "authenticated can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Authenticated user có thể xem
CREATE POLICY "authenticated can view media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media');

-- Admin có thể xóa
CREATE POLICY "admin can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);


-- ============================================================
SELECT '✅ Storage setup complete!' AS status;
-- ============================================================
