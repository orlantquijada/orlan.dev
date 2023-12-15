import '../globals.css'
import type { AppProps } from 'next/app'
import { globalCss } from '@stitches.config'

export const globalStyles = globalCss({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  '*': {
    margin: 0,
  },

  'html, body': {
    fontFamily: '$serif',
    color: '$textColor',
  },

  'html, body, #__next': {
    height: '100%',
  },

  body: {
    backgroundColor: '$bg',
    lineHeight: 1.5,
    '-webkit-font-smoothing': 'antialiased',
  },

  '::selection': {
    backgroundColor: '$selection',
  },

  'input, button, textarea, select': {
    font: 'inherit',
  },

  button: {
    userSelect: 'none',
  },

  'p, h1, h2, h3, h4, h5, h6': {
    overflowWrap: 'break-word',
  },

  a: {
    textDecoration: 'none',
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles()

  return <Component {...pageProps} />
}

export default MyApp
