import { styled } from '../stitches.config'

export const Badge = styled('span', {
  variants: {
    variant: {
      muted: {
        backgroundColor: '$olive3',
        color: '$olive11',

        '&:hover': { backgroundColor: '$olive4' },
        '&:active': { backgroundColor: '$olive5' },
        '&:focus': {
          '$$ring-offset': '2px',
          transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          outline: 'none',
          boxShadow:
            '0 0 0 $$ring-offset $colors$bg, 0 0 0 calc($$ring-offset + 2px) $colors$olive7',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'muted',
  },
})
