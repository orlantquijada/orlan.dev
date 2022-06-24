import { styled } from '../stitches.config'
import { Badge } from './Badge'

export const Container = styled('div', {
  border: '3px $olive6',
  borderWidth: '3px',
  borderStyle: 'dashed',
  borderColor: '$olive6',
  borderRadius: '$md',

  p: '$3 $5',
  display: 'flex',
  justifyContent: 'space-between',
})

export const Close = styled('button', Badge, {
  color: '$olive12',
  textTransform: 'uppercase',
  p: '$2 $3',
  borderRadius: '$full',
  border: 'none',
  fontSize: '$2xs',
  fontWeight: '$bold',
})
