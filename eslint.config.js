import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import vitest from '@vitest/eslint-plugin';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-useless-escape': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        alert: 'readonly',
        // React
        React: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-undef': 'off', // TypeScript handles undefined variables
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    ...vitest.configs.recommended,
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  {
    files: ['**/*.stories.ts', '**/*.stories.tsx'],
    languageOptions: {
      globals: {
        alert: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      'no-undef': 'warn',
    },
  },
  {
    files: ['hooks/**/*.ts', 'hooks/**/*.tsx'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
      },
    },
  },
  {
    files: ['next.config.ts', 'vitest.config.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
  {
    files: ['.storybook/**/*.ts', '.storybook/**/*.tsx', '.storybook/**/*.js'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-case-declarations': 'off',
    },
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'public',
      'public/sitemap.xml',
      'next-sitemap.config.js',
      'drupal-backend/**/*',
      '.storybook/manager-head.html',
      'storybook-static/**/*',
      '.next/**/*',
    ],
  },
];
