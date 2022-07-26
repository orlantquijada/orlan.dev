import { css, styled } from '@stitches.config'

export const textStyles = css({
  variants: {
    size: {
      base: {
        fontSize: '$base',
        lineHeight: '1.5rem',
      },
      xl: {
        fontSize: '$xl',
        lineHeight: '1.75rem',
      },
      '2xl': {
        fontSize: '$2xl',
        lineHeight: '2rem',
      },
    },
  },
})
export const Text = styled('span', textStyles)
