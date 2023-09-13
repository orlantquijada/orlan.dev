module.exports = {
  root: true,
  // ...
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    // ...
    'eslint:recommended',
    'plugin:astro/jsx-a11y-recommended',
    'plugin:astro/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  // ...
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"

        '@typescript-eslint/triple-slash-reference': 0,
      },
    },
    // ...
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-alert': 2,
    'no-console': [2, { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_' }],
  },
}
