import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import solid from 'eslint-plugin-solid/configs/typescript.js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'], ...solid },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: 'tsconfig.json' },
      globals: globals.browser,
    },
  },
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
];
