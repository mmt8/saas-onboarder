import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

console.log('Vite Build: Loading .env.local from', path.resolve('.env.local'));
console.log('Vite Build: NEXT_PUBLIC_SUPABASE_URL =', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'FOUND' : 'MISSING');

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || ''),
        'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'public',
        emptyOutDir: false,
        lib: {
            entry: 'src/widget/index.tsx',
            name: 'GuideMark',
            fileName: () => 'embed.js',
            formats: ['iife'], // Standalone script
        },
        rollupOptions: {
            external: [], // Bundle everything
        },
        minify: false, // For debugging initially
    },
});
