
const { createClient } = require('@supabase/supabase-js');

// Hardcoded keys since .env.local is gitignored and inaccessible to agent write
const SUPABASE_URL = 'https://naiuhnzdampxdewizhin.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getMainProject() {
    const { data, error } = await supabase.from('projects').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
        return;
    }
    if (data && data.length > 0) {
        console.log('Project ID:', data[0].id);
    } else {
        console.log('No projects found. Creating one...');
        const { data: newProject, error: createError } = await supabase
            .from('projects')
            .insert({ name: 'Test Project', created_at: new Date() })
            .select()
            .single();

        if (createError) console.error('Create Error:', createError);
        else console.log('Created Project ID:', newProject.id);
    }
}

getMainProject();
