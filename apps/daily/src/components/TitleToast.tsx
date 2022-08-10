import { styled } from '@stitches.config'
import { Text } from './Text'

const Container = styled('div', {
  borderRadius: '0.5rem',
  border: '1px solid $olive6',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  px: '0.75rem',
  py: '0.5rem',

  '@tab': {
    px: '1rem',
    py: '0.75rem',
  },
})

const Title = styled(Text, {
  color: '$olive11',
  fontWeight: '$bold',

  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const Action = styled('a', {
  backgroundColor: '$olive3',
  color: '$olive11',
  borderRadius: '5px',
  px: '0.5rem',
  py: '0.25rem',
  display: 'grid',
  placeItems: 'center',
  transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '$base',

  '&:focus': {
    '$$ring-offset': '2px',
    outline: 'none',
    boxShadow:
      '0 0 0 $$ring-offset $colors$bg, 0 0 0 calc($$ring-offset + 2px) $colors$olive7',
  },

  '@tab': {
    fontSize: '$lg',
    px: '0.75rem',
    py: '0.25rem',
  },
})

const Toast = {
  Container,
  Title,
  Action,
}

export default Toast
