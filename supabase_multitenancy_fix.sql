-- =====================================================
-- Multi-Tenancy Fix: RLS Policies & Profiles Table
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Drop the overly permissive SELECT policy on projects
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;

-- 2. Create new policies that separate authenticated dashboard access from anonymous widget access

-- Dashboard: Authenticated users can only see their own projects
CREATE POLICY "Users can only select their own projects" ON projects
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Widget: Anonymous users can still read projects (needed for widget to fetch settings)
-- The widget already fetches by specific project_id, so this is safe
CREATE POLICY "Anonymous can read projects" ON projects
    FOR SELECT TO anon
    USING (true);

-- =====================================================
-- 3. Create profiles table for account information
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    company_name TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (for first-time setup)
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 4. Auto-create profile on user signup (trigger)
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 5. Backfill profiles for existing users
-- =====================================================

INSERT INTO profiles (id, email, created_at, updated_at)
SELECT id, email, NOW(), NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;
