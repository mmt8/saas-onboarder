
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://naiuhnzdampxdewizhin.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateRadiusStandard() {
    const { data: projects, error: fetchError } = await supabase.from('projects').select('id, theme_settings');
    if (fetchError) {
        console.error('Fetch Error:', fetchError);
        return;
    }

    for (const project of projects) {
        const updatedSettings = {
            ...project.theme_settings,
            borderRadius: '20'
        };

        const { error: updateError } = await supabase
            .from('projects')
            .update({ theme_settings: updatedSettings })
            .eq('id', project.id);

        if (updateError) {
            console.error(`Update Error for ${project.id}:`, updateError);
        } else {
            console.log(`Updated project ${project.id} to 20px radius.`);
        }
    }
}

updateRadiusStandard();
