import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const src = (p) => fileURLToPath(new URL(`./src/${p}`, import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@monorepo/shared/utils': src('utils/index.js'),
            '@monorepo/shared/components': src('components/index.js'),
            '@monorepo/shared/pages': src('pages/index.js'),
        },
    },
    // Same automatic JSX runtime as @vitejs/plugin-react in the apps.
    esbuild: { jsx: 'automatic' },
    test: {
        environment: 'jsdom',
        include: ['test/**/*.test.{js,jsx}'],
        // Placeholders only; the Supabase client is mocked in every test.
        env: {
            VITE_SUPABASE_URL: 'https://placeholder.supabase.co',
            VITE_SUPABASE_ANON_KEY: 'placeholder-anon-key',
            VITE_SUPABASE_USER_ID: 'site-ines',
        },
    },
});
