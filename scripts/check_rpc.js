
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://naiuhnzdampxdewizhin.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkFunction() {
    const { data, error } = await supabase.rpc('ping_project', { project_id: '88ce9f20-d287-40c6-b73d-4d1c2472eb25' });
    // This doesn't show the source code.
    // I will try to fetch it from pg_proc if I have permissions (unlikely via RPC).
}

async function getFunctionSource() {
    const { data, error } = await supabase.from('projects').select('id').limit(1); // just to test connection

    // Attempting to read function definition via SQL if possible
    const { data: funcData, error: funcError } = await supabase.rpc('ping_project', { project_id: '88ce9f20-d287-40c6-b73d-4d1c2472eb25' });
    console.log('Ping result:', { data: funcData, error: funcError });
}

getFunctionSource();
