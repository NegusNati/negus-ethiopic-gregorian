import js from '@eslint/js';

export default [
  // Base JS config but we will ignore config/build files explicitly below
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser').then(m => m.default),
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin').then(m => m.default),
    },
    rules: {
      ...await import('@typescript-eslint/eslint-plugin').then(m => m.configs?.recommendedTypeChecked?.[0]?.rules || {}),
      ...await import('@typescript-eslint/eslint-plugin').then(m => m.configs?.strictTypeChecked?.[0]?.rules || {}),
      'no-console': 'warn',
      // Disable core no-unused-vars for TS files in favor of the TS-aware rule
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-confusing-void-expression': 'error',
    },
  },
  {
    // Ignore folders and config/build files not in tsconfig.json
    ignores: ['dist', '.github', 'node_modules', '.eslintrc.cjs', 'tsup.config.ts'],
  },
];
