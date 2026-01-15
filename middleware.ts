import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use same defaults as src/lib/supabase.ts to avoid crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://naiuhnzdampxdewizhin.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';

export async function middleware(req: NextRequest) {
    try {
        const res = NextResponse.next();

        // Create a Supabase client specifically for the middleware
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Check for the Supabase session cookie manually if geSession doesn't work well 
        // in this specific Next.js version's edge runtime
        const { data: { session } } = await supabase.auth.getSession();

        const { pathname } = req.nextUrl;

        // Only protect the dashboard. Use client-side for redirecting away from login/signup.
        if (pathname.startsWith('/dashboard') && !session) {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/login';
            return NextResponse.redirect(redirectUrl);
        }

        return res;
    } catch (error) {
        console.error('Middleware Error:', error);
        // On error, let the request proceed to avoid 500ing the whole site.
        // The client-side protection in the pages can handle the fallback.
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup'],
};
