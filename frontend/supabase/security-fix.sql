-- ============================================================
-- SECURITY FIX: RLS Policies & DB Constraints
-- Applied: 2026-02-22
-- ============================================================

-- PEOPLE table
DROP POLICY IF EXISTS "service can manage people" ON people;
CREATE POLICY "authenticated can update people" ON people
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can insert people" ON people
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin can delete people" ON people
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- FAMILIES table
DROP POLICY IF EXISTS "service can manage families" ON families;
CREATE POLICY "authenticated can update families" ON families
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can insert families" ON families
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin can delete families" ON families
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PROFILES — self or admin update
CREATE POLICY "admin can update any profile" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- COMMENTS — owner or admin delete
CREATE POLICY "owner or admin can delete comments" ON comments
  FOR DELETE USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- POSTS — owner or admin manage
CREATE POLICY "owner or admin can delete posts" ON posts
  FOR DELETE USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "owner or admin can update posts" ON posts
  FOR UPDATE USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- NOTIFICATIONS — self only
CREATE POLICY "users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- INVITE_LINKS — admin only
CREATE POLICY "admin can manage invite_links" ON invite_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- DB CONSTRAINTS
ALTER TABLE comments ADD CONSTRAINT comments_content_length CHECK (char_length(content) BETWEEN 1 AND 2000);
ALTER TABLE contributions ADD CONSTRAINT contributions_value_length CHECK (char_length(new_value) <= 5000);
ALTER TABLE posts ADD CONSTRAINT posts_content_length CHECK (char_length(body) BETWEEN 1 AND 10000);

SELECT 'Security policies and constraints applied successfully!' AS status;
