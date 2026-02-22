-- ============================================================
-- 🔧 MIGRATE ROLES — Chạy file này trong Supabase SQL Editor
--    nếu database đã được setup trước đó với phiên bản cũ.
-- ============================================================


-- ╔══════════════════════════════════════════════════════════╗
-- ║  BƯỚC 1 — Mở rộng danh sách role cho bảng profiles      ║
-- ╚══════════════════════════════════════════════════════════╝

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('admin', 'editor', 'archivist', 'member', 'guest'));


-- ╔══════════════════════════════════════════════════════════╗
-- ║  BƯỚC 2 — Mở rộng danh sách role cho bảng invite_links  ║
-- ╚══════════════════════════════════════════════════════════╝

ALTER TABLE invite_links DROP CONSTRAINT IF EXISTS invite_links_role_check;
ALTER TABLE invite_links ADD CONSTRAINT invite_links_role_check
    CHECK (role IN ('admin', 'editor', 'archivist', 'member', 'guest'));


-- ╔══════════════════════════════════════════════════════════╗
-- ║  BƯỚC 3 — Sửa status constraint (inactive → suspended)  ║
-- ╚══════════════════════════════════════════════════════════╝

-- Cập nhật các row đang dùng 'inactive' sang 'suspended'
UPDATE profiles SET status = 'suspended' WHERE status = 'inactive';

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_status_check
    CHECK (status IN ('active', 'suspended', 'pending'));


-- ╔══════════════════════════════════════════════════════════╗
-- ║  BƯỚC 4 — Cập nhật trigger handle_new_user              ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_display_name TEXT;
BEGIN
    user_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', '');
    user_display_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        split_part(user_email, '@', 1),
        ''
    );
    IF user_email != '' THEN
        INSERT INTO profiles (id, email, display_name, role, status)
        VALUES (
            NEW.id,
            user_email,
            user_display_name,
            -- ⚠️ THAY 'your-admin@example.com' BẰNG EMAIL THẬT CỦA BẠN:
            CASE WHEN user_email = 'your-admin@example.com' THEN 'admin' ELSE 'member' END,
            'active'
        )
        ON CONFLICT (email) DO UPDATE
            SET id = NEW.id,
                display_name = EXCLUDED.display_name;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  BƯỚC 5 — Tạo Admin đầu tiên (QUAN TRỌNG)              ║
-- ╚══════════════════════════════════════════════════════════╝
-- Sau khi đã đăng ký tài khoản, chạy lệnh này để nâng quyền:
-- ⚠️ THAY 'your-real-email@example.com' bằng email đã đăng ký:

-- UPDATE profiles
-- SET role = 'admin'
-- WHERE email = 'your-real-email@example.com';


-- ╔══════════════════════════════════════════════════════════╗
-- ║  Kiểm tra kết quả                                       ║
-- ╚══════════════════════════════════════════════════════════╝

SELECT
    email,
    display_name,
    role,
    status,
    created_at
FROM profiles
ORDER BY created_at;

SELECT '✅ Migration hoàn tất! Nhớ chạy UPDATE profiles SET role = ''admin'' WHERE email = ''...'';' AS status;
