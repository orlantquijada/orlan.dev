import * as Stitches from '@stitches/react'
import { createStitches } from '@stitches/react'

const olive = {
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

const oliveDark = {
  olive1: '#151715',
  olive2: '#1a1d19',
  olive3: '#20241f',
  olive4: '#262925',
  olive5: '#2b2f2a',
  olive6: '#313530',
  olive7: '#3b3f3a',
  olive8: '#4c514b',
  olive9: '#687366',
  olive10: '#778175',
  olive11: '#9aa299',
  olive12: '#eceeec',
} as const

const spaceAndSizesCommon = {
  0: '0px',
  px: '1px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  // 44: '11rem',
  // 48: '12rem',
  // 52: '13rem',
  // 56: '14rem',
  // 60: '15rem',
  // 64: '16rem',
}

export const defaultTheme = {
  colors: {
    ...olive,
  },
  space: spaceAndSizesCommon,
  sizes: {
    ...spaceAndSizesCommon,
    full: '100%',
    fit: 'fit-content',
  },

  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },

  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
}

const defaultCreateStitchesConfig = {
  theme: defaultTheme,

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
}

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
} = createStitches(defaultCreateStitchesConfig)

export const darkTheme = createTheme({ colors: oliveDark })
