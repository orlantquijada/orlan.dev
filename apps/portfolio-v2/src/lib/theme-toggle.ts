export type ThemeKeys = 'dark' | 'light'

export const storageKey = 'theme-preference'
export const query = '.theme-toggle'

export const disableTransitionOnThemeChange = (callback: () => void) => {
  const css = document.createElement('style')
  css.type = 'text/css'
  css.appendChild(
    document.createTextNode(
      `* {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -ms-transition: none !important;
            transition: none !important;
          }`,
    ),
  )
  document.head.appendChild(css)

  callback()

  setTimeout(() => {
    window.getComputedStyle(css).opacity
    document.head.removeChild(css)
  }, 1)
}

export const getDefaultTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const getTheme = () => {
  const theme = localStorage.getItem(storageKey)
  if (theme) return theme as ThemeKeys
  return getDefaultTheme()
}

export const setTheme = (theme: ThemeKeys) => {
  disableTransitionOnThemeChange(() => {
    localStorage.setItem(storageKey, theme)
    document.documentElement.className = theme
    document.querySelector(query)?.setAttribute('aria-label', theme)
  })
}

export const toggleTheme = () => {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}
