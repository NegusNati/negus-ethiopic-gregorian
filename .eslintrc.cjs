module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/recommended-type-checked'
  ],
  env: { node: true, es2021: true },
  parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
  ignorePatterns: ['dist', '.github', 'tsup.config.ts'],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
  }
};
