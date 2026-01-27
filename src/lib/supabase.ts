import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
        console.warn('Supabase env variables are missing in production. Build will continue but features will be disabled.');
    } else {
        console.error('Missing Supabase environment variables. Please check your .env.local file.');
    }
}

const isConfigured = supabaseUrl && supabaseAnonKey &&
    supabaseUrl !== 'undefined' &&
    supabaseAnonKey !== 'undefined';

if (!isConfigured) {
    console.warn('Guidemark: Supabase is NOT configured. Check environment variables.');
}

export const supabase = isConfigured
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null as any;
