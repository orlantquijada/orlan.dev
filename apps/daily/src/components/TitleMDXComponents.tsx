import { type ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { text } from 'styled-system/recipes'
import { type MDXComponents } from 'mdx/types'

const TitleHeading = styled('h1', {
  base: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})

export const titleComponents: MDXComponents = {
  // override <p> tags to render as <h1> to avoid adding a necessary <h1> tag in the
  // content files `title` frontmatter since `title`'s type is markdown to enable italics
  p: (props) => (
    <TitleHeading
      {...(props as ComponentProps<typeof TitleHeading>)}
      className={text({ size: '2xl' })}
    />
  ),
}
