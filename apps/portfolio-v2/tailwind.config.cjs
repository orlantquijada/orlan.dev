// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        redaction: ['Redaction', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray1: 'var(--gray1)',
        gray2: 'var(--gray2)',
        gray3: 'var(--gray3)',
        gray4: 'var(--gray4)',
        gray5: 'var(--gray5)',
        gray6: 'var(--gray6)',
        gray7: 'var(--gray7)',
        gray8: 'var(--gray8)',
        gray9: 'var(--gray9)',
        gray10: 'var(--gray10)',
        gray11: 'var(--gray11)',
        gray12: 'var(--gray12)',

        grayA1: 'var(--grayA1)',
        grayA2: 'var(--grayA2)',
        grayA3: 'var(--grayA3)',
        grayA4: 'var(--grayA4)',
        grayA5: 'var(--grayA5)',
        grayA6: 'var(--grayA6)',
        grayA7: 'var(--grayA7)',
        grayA8: 'var(--grayA8)',
        grayA9: 'var(--grayA9)',
        grayA10: 'var(--grayA10)',
        grayA11: 'var(--grayA11)',
        grayA12: 'var(--grayA12)',

        // Misc
        overlay: 'var(--overlay)',
        accent: 'var(--accent)',
        'accent-blue': 'var(--accent-blue)',
        'accent-pink': 'var(--accent-pink)',
        'accent-violet': 'var(--accent-violet)',
        selectionColor: 'var(--selection-color)',
      },
      keyframes: {
        show: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        showContent: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        hideContent: {
          from: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          to: { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
        },
      },
      animation: {
        show: 'show 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        hide: 'hide 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        showContent: 'showContent 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        hideContent: 'hideContent 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
