import { type ComponentProps } from 'react'
import { styled } from '@stitches.config'
import { textStyles } from './Text'

const QuoteParagraph = styled('q', textStyles, {
  '&::before': {
    content: 'open-quote',
  },
  '&::after': {
    content: 'close-quote',
  },
})

export const quoteComponents = {
  p: (props: ComponentProps<typeof QuoteParagraph>) => (
    <QuoteParagraph {...props} size="xl" />
  ),
}
