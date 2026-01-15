import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Create a Supabase client specifically for the middleware
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if we have a session
    // Note: This is a basic check. For more robust cookie handling in App Router, 
    // @supabase/ssr is recommended, but this works for basic route protection.
    const { data: { session } } = await supabase.auth.getSession();

    // If trying to access dashboard and no session exists, redirect to login
    if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/login';
        return NextResponse.redirect(redirectUrl);
    }

    // If already logged in and trying to access login/register, redirect to dashboard
    if ((req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) && session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
