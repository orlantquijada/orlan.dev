import { styled, css } from '../stitches.config'

export const pillStyles = css({
  appearance: 'none',
  borderRadius: '$full',

  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  fontWeight: '$medium',

  variants: {
    size: {
      '1': {
        fontSize: '$xs',
        p: '$1 $2',
      },
      '2': {
        fontSize: '$xs',
        p: '$2 $3',
      },
    },
    variant: {
      muted: {
        backgroundColor: '$olive3',
        border: '1px solid $colors$olive5',
        color: '$olive11',
        transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',

        '&:hover': { backgroundColor: '$olive4' },
        '&:active': { backgroundColor: '$olive5' },
        '&:focus': {
          '$$ring-offset': '2px',
          outline: 'none',
          boxShadow:
            '0 0 0 $$ring-offset $colors$bg, 0 0 0 calc($$ring-offset + 2px) $colors$olive7',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'muted',
    size: '1',
  },
})

export const Pill = styled('span', pillStyles)
