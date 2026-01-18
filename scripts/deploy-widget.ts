
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local if present, or just use hardcoded for this script if needed
// Assuming we can read from .env or we know the keys.
// Previous tools showed vite.config.ts has keys:
// NEXT_PUBLIC_SUPABASE_URL: 'https://naiuhnzdampxdewizhin.supabase.co'
// NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce'

// Ideally we need a SERVICE_ROLE key to bypass RLS for storage uploads if they are restricted,
// OR if the bucket is public and allows upsert by anon (unlikely for good security).
// Let's check environment vars.

const SUPABASE_URL = 'https://naiuhnzdampxdewizhin.supabase.co';
// NOTE: We usually need a service role key for admin tasks like deployment to override RLS.
// Use process.env if available.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in environment.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function deploy() {
    const filePath = path.resolve(__dirname, '../public/embed.js');

    if (!fs.existsSync(filePath)) {
        console.error('Error: public/embed.js not found. Run build first.');
        process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath);

    console.log('Deploying embed.js to Supabase Storage (bucket: widgets)...');

    const { data, error } = await supabase
        .storage
        .from('widgets')
        .upload('embed.js', fileContent, {
            upsert: true,
            contentType: 'application/javascript',
            cacheControl: '3600'
        });

    if (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }

    console.log('Deployment successful!');
    console.log('Path:', data.path);
    console.log('URL:', `${SUPABASE_URL}/storage/v1/object/public/widgets/embed.js`);
}

deploy();
