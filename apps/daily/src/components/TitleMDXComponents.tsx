import { type ComponentProps } from 'react'
import { styled } from '@stitches.config'
import { textStyles } from './Text'

const TitleHeading = styled('h1', textStyles, {
  textAlign: 'center',
})

export const titleComponents = {
  // override <p> tags to render as <h1> to avoid adding a necessary <h1> tag in the
  // content files `title` frontmatter since `title`'s type is markdown to enable italics
  p: (props: ComponentProps<typeof TitleHeading>) => (
    <TitleHeading {...props} size="2xl" />
  ),
}
