import { styled } from './stitches.config'

export const Text = styled('span', {
  variants: {
    size: {
      xs: {
        fontSize: '$xs',
        lineHeight: '1rem',
      },
      sm: {
        fontSize: '$sm',
        lineHeight: '1.25rem',
      },
      base: {
        fontSize: '$base',
        lineHeight: '1.5rem',
      },
      lg: {
        fontSize: '$lg',
        lineHeight: '1.75rem',
      },
      xl: {
        fontSize: '$xl',
        lineHeight: '1.75rem',
      },
      '2xl': {
        fontSize: '$2xl',
        lineHeight: '2rem',
      },
      '3xl': {
        fontSize: '$3xl',
        lineHeight: '2.25rem',
      },
      '4xl': {
        fontSize: '$4xl',
        lineHeight: '2.5rem',
        letterSpacing: '-0.02em',
      },
      '5xl': {
        fontSize: '$5xl',
        lineHeight: '3.75rem',
        letterSpacing: '-0.02em',
      },
      '6xl': {
        fontSize: '$6xl',
        lineHeight: '4.5rem',
        letterSpacing: '-0.02em',
      },
      '7xl': {
        fontSize: '$7xl',
        lineHeight: '5.625rem',
        letterSpacing: '-0.02em',
      },
    },
  },
  defaultVariants: {
    size: 'base',
  },
})
