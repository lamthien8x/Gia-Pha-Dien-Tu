-- ============================================================
-- 🌳 Gia Phả Điện Tử — Storage Setup
-- ============================================================
-- Chạy file này trong: Supabase Dashboard → SQL Editor
-- File này tạo storage bucket cho media files
-- ============================================================

-- ╔══════════════════════════════════════════════════════════╗
-- ║  1. STORAGE BUCKET                                      ║
-- ╚══════════════════════════════════════════════════════════╝

-- Tạo bucket cho media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,  -- public = true để có thể truy cập file trực tiếp qua URL
    10485760,  -- 10MB limit per file
    '{image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/mpeg,video/quicktime,application/pdf}'::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  2. STORAGE POLICIES (RLS cho Storage)                   ║
-- ╚══════════════════════════════════════════════════════════╝

-- Public có thể đọc file đã published (qua media table state)
CREATE POLICY "public can view published media"
ON storage.objects FOR SELECT
TO public
USING (
    bucket_id = 'media' AND
    EXISTS (
        SELECT 1 FROM media
        WHERE media.file_name = (storage.foldername(name) || '/' || storage.filename(name))
        AND media.state = 'PUBLISHED'
    )
);

-- Authenticated user có thể upload
CREATE POLICY "authenticated can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'media' AND
    auth.uid()::text = (storage.foldername(name))
);

-- User có thể xem file của mình
CREATE POLICY "users can view own media"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'media' AND
    auth.uid()::text = (storage.foldername(name))
);

-- Admin có thể xem tất cả
CREATE POLICY "admin can view all media"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User có thể xóa file của mình
CREATE POLICY "users can delete own media"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'media' AND
    auth.uid()::text = (storage.foldername(name))
);

-- Admin có thể xóa tất cả
CREATE POLICY "admin can delete all media"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);


-- ============================================================
SELECT '✅ Storage setup complete! Bucket "media" created with RLS policies.' AS status;
-- ============================================================
