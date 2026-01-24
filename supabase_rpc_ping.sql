-- RPC Function to allow the widget to "ping" and update the last_seen_at timestamp
-- This must be SECURITY DEFINER to allow anonymous pings from the widget to work
CREATE OR REPLACE FUNCTION ping_project(project_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE projects
  SET last_seen_at = timezone('utc'::text, now())
  WHERE id = project_id;
END;
$$;

-- Grant access to the anon role so the widget can call it
GRANT EXECUTE ON FUNCTION ping_project(UUID) TO anon;
GRANT EXECUTE ON FUNCTION ping_project(UUID) TO authenticated;
