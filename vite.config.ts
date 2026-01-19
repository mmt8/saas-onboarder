
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env
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
