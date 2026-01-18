
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://naiuhnzdampxdewizhin.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testPing() {
    const projectId = '88ce9f20-d287-40c6-b73d-4d1c2472eb25'; // Betago
    console.log(`Pinging project ${projectId}...`);

    const { error } = await supabase.rpc('ping_project', {
        project_id: projectId
    });

    if (error) {
        console.error('Ping RPC Error:', error);
    } else {
        console.log('Ping RPC successful. Fetching project to verify last_seen_at...');
        const { data, fetchError } = await supabase.from('projects').select('id, name, last_seen_at').eq('id', projectId).single();
        if (fetchError) console.error('Fetch Error:', fetchError);
        else console.log('Project data:', data);
    }
}

testPing();
