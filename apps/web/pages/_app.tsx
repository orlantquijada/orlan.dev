import { AppProps } from 'next/app'
import { globalCss } from 'ui'

export const globalStyles = globalCss({
  ':root': { fontSize: '16px' },
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  '*': {
    margin: 0,
  },

  'html, body': {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },

  body: {
    lineHeight: 1.5,
    '-webkit-font-smoothing': 'antialiased',
  },

  'img, picture, video, canvas, svg': {
    display: 'block',
    maxWidth: '100%',
  },

  'input, button, textarea, select': {
    font: 'inherit',
  },

  'p, h1, h2, h3, h4, h5, h6': {
    overflowWrap: 'break-word',
  },

  a: {
    textDecoration: 'none',
  },
})

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  globalStyles()

  return <Component {...pageProps} />
}
