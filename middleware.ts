import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Fallback values for resilience
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://naiuhnzdampxdewizhin.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_I7TFMHsf_lNAQzm4JNdpLA_JZpCQ5ce';

export async function middleware(request: NextRequest) {
    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                    },
                },
            }
        );

        // Refresh session if expired - required for Server Components
        const { data: { user } } = await supabase.auth.getUser();

        const { pathname } = request.nextUrl;

        // 1. Dashboard Protection
        if (pathname.startsWith('/dashboard') && !user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        // 2. Redirect away from Login/Signup if already authenticated
        if ((pathname === '/login' || pathname === '/signup') && user) {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }

        return response;
    } catch (error) {
        console.error('Middleware Error:', error);
        // On error, let the request proceed to avoid 500ing the whole site.
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup'],
};
