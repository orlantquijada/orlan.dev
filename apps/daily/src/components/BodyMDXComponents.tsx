import { type ComponentProps } from 'react'
import { styled } from '@stitches.config'
import { Text, textStyles } from './Text'

const P = styled('p', textStyles, {
  '&:not(:first-child)': {
    textIndent: '2em',
  },

  'article > &:first-child::first-letter': {
    float: 'left',
    lineHeight: '85%',
    width: '.7em',
    fontSize: '325%',
    fontStyle: 'initial',
  },
})

const BlockQuote = styled('blockquote', {
  ml: '1.5rem',
  my: '2rem',
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
  Text: (props: ComponentProps<typeof Text>) => <Text size="xl" {...props} />,
  blockquote: (props: ComponentProps<typeof BlockQuote>) => (
    <BlockQuote {...props} />
  ),
  ul: (props: ComponentProps<typeof Ul>) => <Ul {...props} />,
  li: (props: ComponentProps<typeof Li>) => <Li {...props} size="xl" />,
}
