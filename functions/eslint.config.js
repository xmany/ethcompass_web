// Flat ESLint config for functions to work with ESLint v9+
// This file is only used when ESLint detects flat config mode.
// ESLint v8 will ignore this and use .eslintrc.js instead.

import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.{ts,js}'],
    ignores: ['lib/**', 'generated/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.dev.json'],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      quotes: ['error', 'double'],
      indent: ['error', 2],
    },
  },
];

