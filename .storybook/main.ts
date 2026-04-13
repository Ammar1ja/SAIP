import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';
import postcssConfig from './postcss.config.cjs';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx|js|jsx|mjs)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    './addons/version-switcher.js',
  ],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  staticDirs: ['../public'],

  viteFinal: async (config) => {
    config.resolve = {
      ...(config.resolve ?? {}),
      alias: {
        ...(config.resolve?.alias ?? {}),
        '@': path.resolve(process.cwd(), '.'),
      },
    };

    config.css = {
      ...config.css,
      postcss: postcssConfig,
    };

    return config;
  },
};

export default config;
