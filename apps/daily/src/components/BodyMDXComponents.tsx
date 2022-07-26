import { type ComponentProps } from 'react'
import { styled } from '@stitches.config'
import { textStyles } from './Text'

const BodyParagraph = styled('p', textStyles, {
  '&:not(:first-of-type)': {
    textIndent: '2em',
  },

  '&:first-of-type::first-letter': {
    float: 'left',
    lineHeight: '85%',
    width: '.7em',
    fontSize: '325%',
  },
})

export const bodyComponents = {
  p: (props: ComponentProps<typeof BodyParagraph>) => (
    <BodyParagraph {...props} size="xl" />
  ),
}
