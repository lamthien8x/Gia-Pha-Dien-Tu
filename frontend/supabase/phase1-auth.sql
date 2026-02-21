-- ============================================================
-- Phase 1: Clean Auth Setup (no trigger)
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1) Drop old broken trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2) Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    person_handle TEXT,  -- link to people table
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_all" ON profiles;
DROP POLICY IF EXISTS "update_own" ON profiles;
DROP POLICY IF EXISTS "insert_own" ON profiles;

CREATE POLICY "anyone_read_profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "users_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4) Set admin role
UPDATE profiles SET role = 'admin' WHERE email = 'lhda.eth@gmail.com';

-- If admin doesn't exist yet, that's fine — they'll be set after signup

SELECT 'Phase 1 SQL complete!' AS status;
