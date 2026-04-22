module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    es2022: true,
    node: true,
    browser: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always'],
    'prefer-const': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
  },
  overrides: [
    {
      files: ['*.cjs', '*.js'],
      parser: 'espree',
      extends: ['eslint:recommended', 'prettier'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    '.turbo',
    '.data',
    'coverage',
    'packages/client/library',
    'packages/client/local',
    'packages/client/temp',
    'packages/client/profiles',
    'packages/client/build',
    'packages/client/settings',
  ],
};
