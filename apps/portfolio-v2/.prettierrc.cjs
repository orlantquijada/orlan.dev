module.exports = {
  semi: false,
  singleQuote: true,

  plugins: [
    require.resolve('prettier-plugin-astro'),

    // required to be last
    'prettier-plugin-tailwindcss',
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
