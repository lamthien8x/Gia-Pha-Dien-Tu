-- ============================================================
-- Phase 2: Contributions table
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

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

-- RLS
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Anyone can read contributions
CREATE POLICY "anyone_read_contributions" ON contributions FOR SELECT USING (true);

-- Logged in users can insert their own contributions
CREATE POLICY "users_insert_contributions" ON contributions FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Admin can update contributions (approve/reject)
CREATE POLICY "admin_update_contributions" ON contributions FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_person ON contributions(person_handle);

SELECT 'Phase 2 SQL complete!' AS status;
