-- =====================================================
-- Fix: Remove anon SELECT policy and use RPC for widget
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Drop the anon policy that allows everyone to see all projects
DROP POLICY IF EXISTS "Anonymous can read projects" ON projects;

-- 2. Create RPC function for widget to fetch project settings
-- This bypasses RLS and only returns the specific project requested
CREATE OR REPLACE FUNCTION get_project_settings(p_project_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    domain TEXT,
    show_launcher BOOLEAN,
    launcher_text TEXT,
    theme_settings JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        projects.id,
        projects.name,
        projects.domain,
        projects.show_launcher,
        projects.launcher_text,
        projects.theme_settings
    FROM projects
    WHERE projects.id = p_project_id;
END;
$$;

-- Grant access to anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_project_settings(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_project_settings(UUID) TO authenticated;

-- 3. Create RPC function for widget to fetch tours by project ID
CREATE OR REPLACE FUNCTION get_tours_for_project(p_project_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    page_url TEXT,
    is_active BOOLEAN,
    play_behavior TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tours.id,
        tours.title,
        tours.description,
        tours.page_url,
        tours.is_active,
        tours.play_behavior
    FROM tours
    WHERE tours.project_id = p_project_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_tours_for_project(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_tours_for_project(UUID) TO authenticated;

-- 4. Create RPC function for widget to fetch steps by tour ID
CREATE OR REPLACE FUNCTION get_steps_for_tour(p_tour_id UUID)
RETURNS TABLE (
    id UUID,
    target TEXT,
    content TEXT,
    "order" INTEGER,
    action TEXT,
    action_value TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        steps.id,
        steps.target,
        steps.content,
        steps.order,
        steps.action,
        steps.action_value
    FROM steps
    WHERE steps.tour_id = p_tour_id
    ORDER BY steps.order;
END;
$$;

GRANT EXECUTE ON FUNCTION get_steps_for_tour(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_steps_for_tour(UUID) TO authenticated;
