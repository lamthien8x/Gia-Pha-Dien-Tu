-- ============================================================
-- 🌳 Gia Phả Điện Tử — Database Setup
-- ============================================================
-- Chạy file này trong: Supabase Dashboard → SQL Editor
-- File này tạo toàn bộ cấu trúc database + dữ liệu mẫu demo
-- ============================================================


-- ╔══════════════════════════════════════════════════════════╗
-- ║  1. CORE TABLES: people + families                      ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS people (
    handle TEXT PRIMARY KEY,
    gramps_id TEXT,
    gender INT NOT NULL DEFAULT 1,           -- 1=Nam, 2=Nữ
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    surname TEXT,
    first_name TEXT,
    generation INT DEFAULT 1,
    chi INT,
    birth_year INT,
    birth_date TEXT,
    birth_place TEXT,
    death_year INT,
    death_date TEXT,
    death_place TEXT,
    is_living BOOLEAN DEFAULT true,
    is_privacy_filtered BOOLEAN DEFAULT false,
    is_patrilineal BOOLEAN DEFAULT true,     -- true=chính tộc, false=ngoại tộc
    families TEXT[] DEFAULT '{}',            -- family handles where this person is parent
    parent_families TEXT[] DEFAULT '{}',     -- family handles where this person is child
    phone TEXT,
    email TEXT,
    zalo TEXT,
    facebook TEXT,
    current_address TEXT,
    hometown TEXT,
    occupation TEXT,
    company TEXT,
    education TEXT,
    nick_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS families (
    handle TEXT PRIMARY KEY,
    father_handle TEXT,
    mother_handle TEXT,
    children TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_people_generation ON people (generation);
CREATE INDEX IF NOT EXISTS idx_people_surname ON people (surname);
CREATE INDEX IF NOT EXISTS idx_families_father ON families (father_handle);
CREATE INDEX IF NOT EXISTS idx_families_mother ON families (mother_handle);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ╔══════════════════════════════════════════════════════════╗
-- ║  2. AUTH: profiles + auto-create trigger                ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'archivist', 'member', 'guest')),
    person_handle TEXT,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
-- ⚠️ ĐỔI EMAIL ADMIN: thay 'your-admin@example.com' bằng email admin thật
-- Hoặc dùng câu SQL bên dưới sau khi đăng ký:
--   UPDATE profiles SET role = 'admin' WHERE email = 'your-real-email@example.com';
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ╔══════════════════════════════════════════════════════════╗
-- ║  3. CONTRIBUTIONS (đề xuất chỉnh sửa)                  ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_email TEXT,
    person_handle TEXT NOT NULL,
    person_name TEXT,
    field_name TEXT NOT NULL,
    field_label TEXT,
    old_value TEXT,
    new_value TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_note TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_person ON contributions(person_handle);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  4. COMMENTS (bình luận)                                ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_email TEXT,
    author_name TEXT,
    person_handle TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_person ON comments(person_handle);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  4b. POSTS (bài viết bảng tin)                         ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'announcement', 'news')),
    title TEXT,
    body TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

-- Post comments (khác với comments trên person)
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created ON post_comments(created_at);

-- Updated_at trigger for posts
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ╔══════════════════════════════════════════════════════════╗
-- ║  4c. MEDIA (thư viện)                                   ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    mime_type TEXT,
    file_size BIGINT,
    title TEXT,
    description TEXT,
    state TEXT NOT NULL DEFAULT 'PENDING' CHECK (state IN ('PENDING', 'PUBLISHED', 'REJECTED')),
    uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tagged_people TEXT[] DEFAULT '{}',
    tagged_events UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_uploader ON media(uploader_id);
CREATE INDEX IF NOT EXISTS idx_media_state ON media(state);
CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  4d. EVENTS (sự kiện)                                    ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    location TEXT,
    type TEXT NOT NULL DEFAULT 'OTHER' CHECK (type IN ('MEMORIAL', 'MEETING', 'FESTIVAL', 'OTHER')),
    is_recurring BOOLEAN DEFAULT false,
    creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);

-- ╔══════════════════════════════════════════════════════════╗
-- ║  4e. NOTIFICATIONS (thông báo)                           ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user ON event_rsvps(user_id);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  5. INVITE LINKS (mã mời đăng ký)                     ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS invite_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'archivist', 'member', 'guest')),
    max_uses INT,
    used_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invite_links_code ON invite_links(code);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  6. ROW LEVEL SECURITY (RLS)                            ║
-- ╚══════════════════════════════════════════════════════════╝

-- People & Families: public read, authenticated write, admin delete
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read people" ON people FOR SELECT USING (true);
CREATE POLICY "anyone can read families" ON families FOR SELECT USING (true);
CREATE POLICY "authenticated can update people" ON people
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can insert people" ON people
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin can delete people" ON people
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "authenticated can update families" ON families
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can insert families" ON families
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin can delete families" ON families
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Profiles: public read, update own or admin
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read profiles" ON profiles FOR SELECT USING (true);
-- Cho phép trigger (SECURITY DEFINER) và service_role insert profile
CREATE POLICY "service can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "users or admin can update profile" ON profiles
    FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Contributions: public read, user insert own, admin update
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read contributions" ON contributions FOR SELECT USING (true);
CREATE POLICY "users can insert contributions" ON contributions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "admin can update contributions" ON contributions
    FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Comments: public read, user insert own, owner/admin delete
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "owner or admin can delete comments" ON comments
    FOR DELETE USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Constraints
ALTER TABLE comments ADD CONSTRAINT comments_content_length CHECK (char_length(content) BETWEEN 1 AND 2000);
ALTER TABLE contributions ADD CONSTRAINT contributions_value_length CHECK (char_length(new_value) <= 5000);

-- Posts: public read published, authenticated insert own, owner/admin update/delete
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read published posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "authenticated can insert posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "owner or admin can update posts" ON posts
    FOR UPDATE USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
CREATE POLICY "owner or admin can delete posts" ON posts
    FOR DELETE USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Post Comments: public read, authenticated insert own, owner/admin delete
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read post comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "authenticated can insert post comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "owner or admin can delete post comments" ON post_comments
    FOR DELETE USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Media: public read published, authenticated insert, admin approve/reject
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read published media" ON media FOR SELECT USING (state = 'PUBLISHED');
CREATE POLICY "authenticated can insert media" ON media FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "uploader can view own media" ON media FOR SELECT USING (auth.uid() = uploader_id);
CREATE POLICY "admin can update media" ON media
    FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "uploader or admin can delete media" ON media
    FOR DELETE USING (
        uploader_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Events: public read, authenticated insert, owner/admin update/delete
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read events" ON events FOR SELECT USING (true);
CREATE POLICY "authenticated can insert events" ON events FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "owner or admin can update events" ON events
    FOR UPDATE USING (
        creator_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
CREATE POLICY "owner or admin can delete events" ON events
    FOR DELETE USING (
        creator_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Event RSVPs: authenticated users, manage own RSVPs
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated can read rsvps" ON event_rsvps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "authenticated can insert rsvp" ON event_rsvps FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update own rsvp" ON event_rsvps
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users can delete own rsvp" ON event_rsvps
    FOR DELETE USING (auth.uid() = user_id);

-- Invite Links: admin only
ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin can read invite_links" ON invite_links FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin can insert invite_links" ON invite_links FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin can update invite_links" ON invite_links FOR UPDATE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin can delete invite_links" ON invite_links FOR DELETE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Notifications: authenticated users can read and update own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own notifications" ON notifications FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "users can update own notifications" ON notifications FOR UPDATE
    USING (auth.uid() = user_id);
CREATE POLICY "admin or trigger can insert notifications" ON notifications FOR INSERT
    WITH CHECK (true); -- In practice, triggers or backend inserts bypass RLS if using service role. If client inserts, allow.





-- Invite links (mã mời đăng ký mẫu)
INSERT INTO invite_links (code, role, max_uses, used_count) VALUES
('FAMILY2026', 'member', 100, 0),
('ADMIN2026', 'admin', 1, 0)
ON CONFLICT (code) DO NOTHING;

-- Posts mẫu (bài viết bảng tin)
-- Note: Cần user_id thực tế, đây chỉ là mẫu structure
-- INSERT INTO posts (author_id, type, title, body, is_pinned, status) VALUES
-- ('[user-uuid]', 'announcement', 'Chào mừng gia phả họ Hồ', 'Chào mừng tất cả thành viên đến với nền tảng gia phả điện tử!', true, 'published'),
-- ('[user-uuid]', 'general', 'Giỗ tổ Nguyễn Văn An', 'Ngày 15/11 này là ngày giỗ của tổ tiên Nguyễn Văn An. Mời mọi người về dự.', false, 'published');

-- Events mẫu (sự kiện)
-- Note: Cần user_id thực tế
-- INSERT INTO events (title, description, start_at, location, type, creator_id) VALUES
-- ('Giỗ tổ Nguyễn Văn An', 'Kính tiễn tổ tiên Nguyễn Văn An, người có công xây dựng dòng họ.', '2026-11-15T08:00:00+07:00', 'Nhà thờ họ Hồ, Hà Nam', 'MEMORIAL', '[user-uuid]'),
-- ('Họp họ định kỳ', 'Họp họ định kỳ cuối năm để thảo luận các công việc dòng họ.', '2026-12-28T14:00:00+07:00', 'Nhà văn hóa xã, Hà Nam', 'MEETING', '[user-uuid]');

-- Media mẫu (thư viện - placeholder, cần storage bucket cho file thật)
-- INSERT INTO media (file_name, mime_type, file_size, title, description, state, uploader_id) VALUES
-- ('anh-tap-the.jpg', 'image/jpeg', 524288, 'Ảnh tập thể', 'Ảnh tập thể họ Hồ năm 2025', 'PUBLISHED', '[user-uuid]');

-- ╔══════════════════════════════════════════════════════════╗
-- ║  8. HELPER — Nâng quyền Admin                           ║
-- ╚══════════════════════════════════════════════════════════╝
-- Chạy câu lệnh này trong SQL Editor để promote user thành admin:
-- (thay 'your-real-email@example.com' bằng email thật)
--
--   UPDATE profiles
--   SET role = 'admin'
--   WHERE email = 'your-real-email@example.com';
--
-- Hoặc dùng script bên dưới để xem danh sách users hiện tại:
--   SELECT id, email, role, status FROM profiles ORDER BY created_at;
--
-- Nếu bảng profiles chưa có role mới (editor/archivist), chạy:
--   ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
--   ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
--       CHECK (role IN ('admin','editor','archivist','member','guest'));
--   ALTER TABLE invite_links DROP CONSTRAINT IF EXISTS invite_links_role_check;
--   ALTER TABLE invite_links ADD CONSTRAINT invite_links_role_check
--       CHECK (role IN ('admin','editor','archivist','member','guest'));


-- ============================================================
SELECT '✅ Database setup complete! Demo data loaded.' AS status;
-- ============================================================
