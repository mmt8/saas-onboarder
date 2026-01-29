-- RPC Function to allow the widget to save detected branding
-- This must be SECURITY DEFINER to allow anonymous updates from the widget to work
CREATE OR REPLACE FUNCTION save_detected_branding(
    project_id UUID,
    primary_color TEXT,
    font_family TEXT,
    border_radius TEXT,
    text_color TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_settings JSONB;
BEGIN
    -- Get current theme_settings
    SELECT theme_settings INTO current_settings FROM projects WHERE id = project_id;
    
    -- If null, start with empty object
    IF current_settings IS NULL THEN
        current_settings := '{}'::jsonb;
    END IF;
    
    -- Merge new detectedBranding into current settings
    UPDATE projects
    SET theme_settings = current_settings || jsonb_build_object(
        'detectedBranding', jsonb_build_object(
            'primaryColor', primary_color,
            'fontFamily', font_family,
            'borderRadius', border_radius,
            'textColor', text_color
        )
    )
    WHERE id = project_id;
END;
$$;

-- Grant access to the anon role so the widget can call it
GRANT EXECUTE ON FUNCTION save_detected_branding(UUID, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION save_detected_branding(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
