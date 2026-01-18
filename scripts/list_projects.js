
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://naiuhnzdampxdewizhin.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function listProjects() {
    const { data, error } = await supabase.from('projects').select('id, name');
    if (error) {
        console.error('Error:', error);
        return;
    }
    data.forEach(p => {
        console.log(`[${p.id}] ${p.name}`);
    });
}

listProjects();
