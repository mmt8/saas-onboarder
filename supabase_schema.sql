-- 1. Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  user_id UUID DEFAULT auth.uid(), -- Link to auth.users
  show_launcher BOOLEAN DEFAULT true,
  launcher_text TEXT DEFAULT 'Product Tours',
  theme_settings JSONB,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create tours table if it doesn't exist
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  page_url TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Add project_id to tours if it doesn't exist (Migration)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='project_id') THEN
    ALTER TABLE tours ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Create steps table if it doesn't exist
CREATE TABLE IF NOT EXISTS steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  target TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  action TEXT,
  action_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

-- 6. Setup Policies
-- Projects: Only view/update your own projects
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Everyone can update projects" ON projects;

CREATE POLICY "Users can only view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Tours: Viewable by anyone (for the widget), but only editable by the project owner
DROP POLICY IF EXISTS "Allow anonymous read" ON tours;
DROP POLICY IF EXISTS "Allow anonymous insert" ON tours;
DROP POLICY IF EXISTS "Allow anonymous update" ON tours;
DROP POLICY IF EXISTS "Allow anonymous delete" ON tours;

CREATE POLICY "Tours are viewable by everyone" ON tours
    FOR SELECT USING (true);

CREATE POLICY "Only project owners can manage tours" ON tours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = tours.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Steps: Viewable by anyone, but only editable by the project owner
DROP POLICY IF EXISTS "Allow anonymous read" ON steps;
DROP POLICY IF EXISTS "Allow anonymous insert" ON steps;
DROP POLICY IF EXISTS "Allow anonymous update" ON steps;
DROP POLICY IF EXISTS "Allow anonymous delete" ON steps;

CREATE POLICY "Steps are viewable by everyone" ON steps
    FOR SELECT USING (true);

CREATE POLICY "Only project owners can manage steps" ON steps
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tours
            JOIN projects ON projects.id = tours.project_id
            WHERE tours.id = steps.tour_id
            AND projects.user_id = auth.uid()
        )
    );
