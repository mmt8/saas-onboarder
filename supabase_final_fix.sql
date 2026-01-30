-- =====================================================
-- FINAL FIX: RPC functions for project operations
-- These validate ownership inside the function
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. RPC to delete project (validates ownership)
CREATE OR REPLACE FUNCTION delete_project_safe(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    project_owner UUID;
BEGIN
    -- Get the owner of the project
    SELECT user_id INTO project_owner FROM projects WHERE id = p_project_id;
    
    -- Check if the caller owns this project
    IF project_owner IS NULL THEN
        RAISE EXCEPTION 'Project not found';
    END IF;
    
    IF project_owner != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: You do not own this project';
    END IF;
    
    -- Delete steps first (foreign key constraint)
    DELETE FROM steps WHERE tour_id IN (SELECT id FROM tours WHERE project_id = p_project_id);
    
    -- Delete tours
    DELETE FROM tours WHERE project_id = p_project_id;
    
    -- Delete the project
    DELETE FROM projects WHERE id = p_project_id;
    
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION delete_project_safe(UUID) TO authenticated;

-- 2. RPC to fetch only the current user's projects
CREATE OR REPLACE FUNCTION get_my_projects()
RETURNS TABLE (
    id UUID,
    name TEXT,
    domain TEXT,
    user_id UUID,
    show_launcher BOOLEAN,
    launcher_text TEXT,
    theme_settings JSONB,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
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
        projects.user_id,
        projects.show_launcher,
        projects.launcher_text,
        projects.theme_settings,
        projects.last_seen_at,
        projects.created_at,
        projects.updated_at
    FROM projects
    WHERE projects.user_id = auth.uid()
    ORDER BY projects.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_my_projects() TO authenticated;
