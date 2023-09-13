import { createContext, useContext, FC, PropsWithChildren } from 'react'

import { CSSProperties } from 'react'

export interface Theme {
  name: 'data-center' | 'cloud'
  config: ThemeConfig<ComponentKey>
}

export type ComponentKey = 'button' | 'select'
export type PseudoClass = 'focus' | 'hover' | 'active'

type ComponentThemes<K extends ComponentKey> = Partial<
  Record<`${K}-${string}`, CSSProperties>
>

type ThemeConfig<K extends ComponentKey> = Partial<{
  [U in K]: ComponentThemes<U>
}>
const ThemeContext = createContext<Theme>({
  name: 'data-center',
  config: { button: { 'button-link': {}, 'button-primary': {} } },
})

export const useTheme = (key: ComponentKey) => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('Component must be used within a ThemeProvider.')
  }

  const componentThemes = context.config[key] as Record<
    keyof ComponentThemes<typeof key>,
    CSSProperties
  >

  if (!componentThemes) {
    throw new Error('No theme for this component has been set.')
  }

  // const link = componentThemes['button-link']
  return { platform: context.name, theme: componentThemes }
}

interface ThemeProviderProps {
  theme: Theme
}

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  theme,
}) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
