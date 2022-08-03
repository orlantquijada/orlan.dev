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
  m: '1.5rem',
  mr: '1rem',
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

const Ul = styled('ul', {
  my: '1.5rem',
  pr: '40px',
})

const Li = styled('li', textStyles)

export const bodyComponents = {
  p: (props: ComponentProps<typeof P>) => <P {...props} size="xl" />,
  blockquote: (props: ComponentProps<typeof BlockQuote>) => (
    <BlockQuote {...props} />
  ),
  ul: (props: ComponentProps<typeof Ul>) => <Ul {...props} />,
  li: (props: ComponentProps<typeof Li>) => <Li {...props} size="xl" />,
}
