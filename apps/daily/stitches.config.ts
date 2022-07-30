import * as Stitches from '@stitches/react'
import { createStitches } from '@stitches/react'

export const olive = {
  olive1: '#fcfdfc',
  olive2: '#f8faf8',
  olive3: '#f2f4f2',
  olive4: '#ecefec',
  olive5: '#e6e9e6',
  olive6: '#e0e4e0',
  olive7: '#d8dcd8',
  olive8: '#c3c8c2',
  olive9: '#8b918a',
  olive10: '#818780',
  olive11: '#6b716a',
  olive12: '#141e12',
} as const

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
  prefix: 'daily',
  media: {
    mobile: '(min-width: 375px)',
    tab: '(min-width: 768px)',
    desktop: '(min-width: 1024px)',
    dark: '(prefers-color-scheme: dark)',
    light: '(prefers-color-scheme: light)',
  },
  utils: {
    w: (v: Stitches.PropertyValue<'width'>) => ({ width: v }),
    h: (v: Stitches.PropertyValue<'height'>) => ({ height: v }),
    size: (v: Stitches.PropertyValue<'width'>) => ({ height: v, width: v }),

    m: (v: Stitches.PropertyValue<'margin'>) => ({ margin: v }),
    mt: (v: Stitches.PropertyValue<'margin'>) => ({ marginBlockStart: v }),
    mr: (v: Stitches.PropertyValue<'margin'>) => ({ marginInlineEnd: v }),
    mb: (v: Stitches.PropertyValue<'margin'>) => ({ marginBlockEnd: v }),
    ml: (v: Stitches.PropertyValue<'margin'>) => ({ marginInlineStart: v }),
    mx: (v: Stitches.PropertyValue<'marginInline'>) => ({ marginInline: v }),
    my: (v: Stitches.PropertyValue<'marginBlock'>) => ({ marginBlock: v }),

    p: (v: Stitches.PropertyValue<'padding'>) => ({ padding: v }),
    pt: (v: Stitches.PropertyValue<'padding'>) => ({ paddingBlockStart: v }),
    pr: (v: Stitches.PropertyValue<'padding'>) => ({ paddingInlineEnd: v }),
    pb: (v: Stitches.PropertyValue<'padding'>) => ({ paddingBlockEnd: v }),
    pl: (v: Stitches.PropertyValue<'padding'>) => ({ paddingInlineStart: v }),
    px: (v: Stitches.PropertyValue<'paddingInline'>) => ({ paddingInline: v }),
    py: (v: Stitches.PropertyValue<'paddingBlock'>) => ({ paddingBlock: v }),

    gapy: (v: Stitches.PropertyValue<'rowGap'>) => ({ rowGap: v }),
    gapx: (v: Stitches.PropertyValue<'columnGap'>) => ({ columnGap: v }),

    rt: (v: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopLeftRadius: v,
      borderTopRightRadius: v,
    }),
    rb: (v: Stitches.PropertyValue<'borderRadius'>) => ({
      borderBottomLeftRadius: v,
      borderBottomRightRadius: v,
    }),
    rl: (v: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopLeftRadius: v,
      borderBottomLeftRadius: v,
    }),
    rr: (v: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopRightRadius: v,
      borderBottomRightRadius: v,
    }),
  },
  theme: {
    colors: {
      ...olive,
      bg: '$olive1',
      textColor: '$olive12',
      selection: '$olive5',
    },
    fonts: {
      serif: '"EB Garamond", Georgia, "Times New Roman", Times, serif',
    },
    fontSizes: {
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
    fontWeights: {
      regular: 400,
      bold: 700,
    },
  },
})

export type CSS = Stitches.CSS<typeof config>
