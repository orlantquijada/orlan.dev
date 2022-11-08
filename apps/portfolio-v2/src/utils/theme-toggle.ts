type ThemeKeys = 'dark' | 'light'
const storageKey = 'theme-preference'

const getTheme = () => {
  const theme = localStorage.getItem(storageKey)
  if (theme) return theme as ThemeKeys
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const setTheme = (theme: ThemeKeys) => {
  localStorage.setItem(storageKey, theme)
  document.documentElement.className = theme
  document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme)
}

const onClick = () => {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

window.addEventListener('load', () => {
  const theme = getTheme()
  setTheme(theme)

  // now this script can find and listen for clicks on the control
  document.querySelector('#theme-toggle')?.addEventListener('click', onClick)
})

// sync with system changes
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({ matches: isDark }) => {
    const theme = isDark ? 'dark' : 'light'
    setTheme(theme)
  })

export {}
