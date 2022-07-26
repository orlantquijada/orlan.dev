import * as Stitches from '@stitches/react'
import { createStitches } from '@stitches/react'
import { defaultCreateStitchesConfig } from 'ui'

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
  prefix,
  reset,
} = createStitches({
  media: defaultCreateStitchesConfig.media,
  utils: defaultCreateStitchesConfig.utils,
  prefix: 'daily',
  theme: {
    colors: {
      bg: defaultCreateStitchesConfig.theme.colors.olive1,
      textColor: defaultCreateStitchesConfig.theme.colors.olive12,
      selection: defaultCreateStitchesConfig.theme.colors.olive5,
    },
    fonts: {
      serif: '"EB Garamond", Georgia, "Times New Roman", Times, serif',
    },
  },
})

export type CSS = Stitches.CSS<typeof config>
