import { type ReactNode, type ComponentProps } from 'react'
import { styled } from '@stitches.config'
import { textStyles } from './Text'

const Q = styled('q', {
  alignSelf: 'stretch',

  '& > :first-child::before': {
    content: 'open-quote',
  },
  '& > :last-child:not(ol)::after': {
    content: 'close-quote',
  },
  '& > :last-child:where(ol)': {
    '& li:last-of-type::after': {
      content: 'close-quote',
    },
  },
  '&::before, &::after': { content: '' },
})

const P = styled('p', textStyles)

const COUNTER_NAME = 'asd'
const Ol = styled('ol', {
  pl: '1.5rem',
  counterReset: COUNTER_NAME,
})
const Li = styled('li', textStyles, {
  pl: '0.5rem',
  counterIncrement: COUNTER_NAME,

  '&::marker': {
    content: `counter(${COUNTER_NAME}) ")"`,
  },
})

export const quoteComponents = {
  p: (props: ComponentProps<typeof P>) => <P {...props} size="xl" />,
  ol: (props: ComponentProps<typeof Ol>) => <Ol {...props} />,
  li: (props: ComponentProps<typeof Li>) => <Li {...props} size="xl" />,
}

export function Quote({ children }: { children: ReactNode }) {
  return <Q>{children}</Q>
}
