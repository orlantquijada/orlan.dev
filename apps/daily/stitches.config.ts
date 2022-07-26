import * as Stitches from '@stitches/react'
import { createStitches } from '@stitches/react'

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
  prefix: 'daily',
  theme: {
    colors: {
      bg: '#fcfdfc',
      textColor: '#141e12',
      selection: '#e6e9e6',
    },
    fonts: {
      serif: '"EB Garamond", Georgia, "Times New Roman", Times, serif',
    },
  },
})

export type CSS = Stitches.CSS<typeof config>
