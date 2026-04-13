import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './'),
      'next/navigation': path.resolve(dirname, './test/mocks/next-navigation.ts'),
    },
  },
  test: {
    environment: 'jsdom',

    setupFiles: ['./vitest.setup.ts'],

    include: [
      'components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],

    globals: true,
    deps: {
      inline: ['next-intl'],
    },

    coverage: {
      enabled: true,
      include: ['components/**/*.{ts,tsx}'],
      exclude: [
        '**/*.{test,spec,styles,types,data,stories}.*',
        '**/index.ts',
        'vitest.setup.ts',
        'components/icons/**',
      ],
      reportOnFailure: true,
    },
  },
});
