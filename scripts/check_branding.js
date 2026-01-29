const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://naiuhnzdampxdewizhin.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkBranding() {
    const { data, error } = await supabase.from('projects').select('id, name, theme_settings');
    if (error) {
        console.error('Error:', error);
        return;
    }
    data.forEach(p => {
        console.log(`\n[${p.id}] ${p.name}`);
        console.log('  theme_settings:', JSON.stringify(p.theme_settings, null, 2));
    });
}

checkBranding();
