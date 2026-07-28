import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/coverage/**',
      '**/dist/**',
      '**/doc_build/**',
      '**/node_modules/**',
      '**/.rspress/**',
      './.agents/**',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
