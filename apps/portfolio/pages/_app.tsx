import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { darkTheme, globalCss, theme } from 'ui'

export const globalStyles = globalCss({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  ':root': {
    '$font-serif':
      "'Playfair Display', Georgia, 'Times New Roman', Times, serif",
  },

  '*': {
    margin: 0,
  },

  'html, body': {
    fontFamily:
      '"Inter",-apple-system,ui-sans-serif,system-ui,"Helvetica Neue","Helvetica", BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell, "Open Sans",sans-serif',
  },

  'html, body, #__next': {
    height: '100%',
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

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles()

  return (
    <ThemeProvider
      defaultTheme="system"
      attribute="class"
      value={{ dark: darkTheme, light: theme }}
      themes={[theme, darkTheme]}
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
