-- ============================================================
-- Phase 3: Comments table
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_email TEXT,
    author_name TEXT,
    person_handle TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "anyone_read_comments" ON comments FOR SELECT USING (true);

-- Logged in users can insert their own comments
CREATE POLICY "users_insert_comments" ON comments FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own comments
CREATE POLICY "users_delete_own_comments" ON comments FOR DELETE
    USING (auth.uid() = author_id);

-- Admin can delete any comment
CREATE POLICY "admin_delete_comments" ON comments FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE INDEX IF NOT EXISTS idx_comments_person ON comments(person_handle);

SELECT 'Phase 3 SQL complete!' AS status;
