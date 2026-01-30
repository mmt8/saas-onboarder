-- Superadmin Panel: Database Migration
-- Run this in Supabase SQL Editor

-- 1. Add impressions column to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS impressions INTEGER DEFAULT 0;

-- 2. Add last_login column to profiles table  
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- 3. Create function to get all customer data (superadmin only)
CREATE OR REPLACE FUNCTION admin_get_all_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    caller_email TEXT;
BEGIN
    -- Get caller's email
    SELECT email INTO caller_email
    FROM auth.users
    WHERE id = auth.uid();
    
    -- Check if superadmin (hardcoded email)
    IF caller_email != 'mehmet@producttour.app' THEN
        RAISE EXCEPTION 'Unauthorized: Superadmin access only';
    END IF;
    
    -- Return all profiles with their projects and tours
    SELECT json_agg(customer_data) INTO result
    FROM (
        SELECT 
            p.id,
            p.email,
            p.full_name,
            p.company_name,
            p.country,
            p.last_login,
            p.created_at,
            (
                SELECT json_agg(project_data)
                FROM (
                    SELECT 
                        proj.id,
                        proj.name,
                        proj.domain,
                        proj.created_at,
                        (
                            SELECT json_agg(tour_data)
                            FROM (
                                SELECT 
                                    t.id,
                                    t.title,
                                    t.is_active,
                                    t.page_url,
                                    t.impressions,
                                    t.created_at
                                FROM tours t
                                WHERE t.project_id = proj.id
                                ORDER BY t.created_at DESC
                            ) tour_data
                        ) as tours
                    FROM projects proj
                    WHERE proj.user_id = p.id
                    ORDER BY proj.created_at DESC
                ) project_data
            ) as projects
        FROM profiles p
        ORDER BY p.created_at DESC
    ) customer_data;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$;

-- 4. Create function to toggle tour active status (superadmin only)
CREATE OR REPLACE FUNCTION admin_toggle_tour(tour_id UUID, new_status BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    caller_email TEXT;
BEGIN
    -- Get caller's email
    SELECT email INTO caller_email
    FROM auth.users
    WHERE id = auth.uid();
    
    -- Check if superadmin
    IF caller_email != 'mehmet@producttour.app' THEN
        RAISE EXCEPTION 'Unauthorized: Superadmin access only';
    END IF;
    
    -- Update the tour
    UPDATE tours SET is_active = new_status WHERE id = tour_id;
    
    RETURN TRUE;
END;
$$;

-- 5. Create function to increment tour impressions (public, called by widget)
CREATE OR REPLACE FUNCTION increment_tour_impressions(tour_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE tours 
    SET impressions = COALESCE(impressions, 0) + 1
    WHERE id = tour_id;
END;
$$;

-- 6. Create function to update last_login (called on login)
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE profiles 
    SET last_login = NOW()
    WHERE id = auth.uid();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION admin_get_all_data() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_toggle_tour(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_tour_impressions(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_last_login() TO authenticated;
