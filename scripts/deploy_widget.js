
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Keys (Hardcoded for script reliability)
const SUPABASE_URL = 'https://naiuhnzdampxdewizhin.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function deployWidget() {
    const filePath = path.join(__dirname, '../public/embed.js');

    if (!fs.existsSync(filePath)) {
        console.error('Error: public/embed.js not found. Run build first.');
        process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath);
    const fileName = 'embed.js';
    const bucketName = 'widgets';

    console.log(`Deploying ${fileName} (${(fileContent.length / 1024).toFixed(2)} KB) to bucket '${bucketName}'...`);

    // Upload (Upsert)
    const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(fileName, fileContent, {
            contentType: 'application/javascript',
            upsert: true
        });

    if (error) {
        console.error('Upload Error:', error);
        if (error.message.includes('Bucket not found') || error.message.includes('row-level security')) {
            console.log('\nTIP: Ensure you ran the SQL to create the "widgets" bucket and set policies!');
        }
        process.exit(1);
    }

    console.log('Upload Successful!');

    // Construct Public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(fileName);

    console.log('\n----------------------------------------');
    console.log('Widget Deployed at:');
    console.log(publicUrl);
    console.log('----------------------------------------\n');
}

deployWidget();
