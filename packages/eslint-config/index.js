module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-alert': 2,
    'no-console': [2, { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_' }],
  },
}
