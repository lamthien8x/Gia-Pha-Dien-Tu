-- ============================================================
-- 🔧 FIX: Signup trigger & profiles policies
-- Chạy file này trong: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Xóa trigger cũ
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Tạo lại function với SECURITY DEFINER + SET search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_email TEXT;
    user_display_name TEXT;
    existing_profile_id UUID;
BEGIN
    user_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', '');
    user_display_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        split_part(user_email, '@', 1),
        ''
    );

    IF user_email != '' THEN
        -- Xóa profile mồ côi nếu email đã tồn tại với user ID khác
        SELECT id INTO existing_profile_id FROM profiles WHERE email = user_email;
        IF existing_profile_id IS NOT NULL AND existing_profile_id != NEW.id THEN
            DELETE FROM profiles WHERE id = existing_profile_id;
        END IF;

        INSERT INTO profiles (id, email, display_name, role, status)
        VALUES (
            NEW.id,
            user_email,
            user_display_name,
            CASE WHEN user_email = 'lamthien8x@gmail.com' THEN 'admin' ELSE 'member' END,
            'active'
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

-- 3. Tạo lại trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Fix RLS policies trên profiles
--    Xóa policy INSERT cũ (chặn trigger vì auth.uid() = NULL trong trigger)
DROP POLICY IF EXISTS "users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "service can insert profiles" ON profiles;
DROP POLICY IF EXISTS "service role can insert profiles" ON profiles;

-- Cho phép insert (trigger SECURITY DEFINER cần policy permissive)
CREATE POLICY "service can insert profiles" ON profiles
    FOR INSERT WITH CHECK (true);

-- 5. Xóa profiles mồ côi (không có user tương ứng)
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

SELECT '✅ Fix complete! Thử đăng ký lại.' AS status;
