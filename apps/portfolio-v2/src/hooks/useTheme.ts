import { useState } from 'react'

import { useIsomorphicLayoutEffect } from '@/lib/general'
import {
  getTheme,
  toggleTheme as _toggleTheme,
  setTheme as _setTheme,
  type ThemeKeys,
} from '@/lib/theme-toggle'

export function useTheme() {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<ThemeKeys>()

  useIsomorphicLayoutEffect(() => {
    setTheme(getTheme())

    setLoading(false)
  }, [])

  function handletoggleTheme() {
    _toggleTheme()
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  function handleSetTheme(theme: ThemeKeys) {
    _setTheme(theme)
    setTheme(theme)
  }

  const fns = {
    setTheme: handleSetTheme,
    toggleTheme: handletoggleTheme,
  }

  if (loading) return { loading: true, theme: undefined, ...fns } as const
  return { loading: false, theme: theme as ThemeKeys, ...fns } as const
}
