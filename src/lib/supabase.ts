import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://naiuhnzdampxdewizhin.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
