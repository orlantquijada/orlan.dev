import '../globals.css'
import { type NextPage } from 'next'
import { type AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { darkTheme, globalCss, theme } from 'ui'

export const globalStyles = globalCss({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  '*': {
    margin: 0,
  },

  'html, body': {
    fontFamily: '$sans-serif',
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
    backgroundColor: '$olive5',
  },

  'img, picture, video, canvas, svg': {
    display: 'block',
    maxWidth: '100%',
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

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & { theme?: 'dark' | 'light' }
}) {
  globalStyles()

  return (
    <ThemeProvider
      defaultTheme="system"
      forcedTheme={Component.theme}
      attribute="class"
      value={{ dark: darkTheme, light: theme }}
      themes={[theme, darkTheme]}
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
