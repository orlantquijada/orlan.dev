import { type ComponentProps } from 'react'
import { styled } from '@stitches.config'
import { textStyles } from './Text'

const P = styled('p', textStyles, {
  '&:not(:first-of-type)': {
    textIndent: '2em',
  },

  'article > &:first-of-type::first-letter': {
    float: 'left',
    lineHeight: '85%',
    width: '.7em',
    fontSize: '325%',
  },
})

const BlockQuote = styled('blockquote', {
  mx: '1.5rem 1rem',
  my: '1.5rem',
  position: 'relative',

  '&::before': {
    content: 'open-quote',
    position: 'absolute',
    left: '-0.9ch',
    top: '0.1ch',
  },

  [`& > ${P}:last-child::after`]: {
    content: 'close-quote',
  },
})

export const bodyComponents = {
  p: (props: ComponentProps<typeof P>) => <P {...props} size="xl" />,
  blockquote: (props: ComponentProps<typeof BlockQuote>) => (
    <BlockQuote {...props} />
  ),
}
