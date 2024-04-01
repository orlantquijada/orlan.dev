import { type ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { css } from 'styled-system/css'
import { text } from 'styled-system/recipes'
import { type MDXComponents } from 'mdx/types'

const P = styled('p', {
  base: {
    '&:not(:first-child)': {
      textIndent: '2em',
    },
  },
})

const BlockQuote = styled('blockquote', {
  base: {
    ml: '1.5rem',
    my: '2rem',
    mr: '1rem',
    position: 'relative',

    _before: {
      content: 'open-quote',
      position: 'absolute',
      left: '-0.9ch',
      top: '0.1ch',
    },

    [`& > p:last-child::after`]: {
      content: 'close-quote',
    },
  },
})

const Ul = styled('ul', {
  base: {
    my: '1.5rem',
    px: '40px',

    listStyleType: 'revert',
  },
})

const Ol = styled('ol', {
  base: { all: 'revert', my: 0 },
})

export const bodyComponents: MDXComponents = {
  p: (props) => (
    <P
      {...(props as ComponentProps<typeof P>)}
      className={text({ size: 'xl' })}
    />
  ),
  blockquote: (props) => (
    <BlockQuote {...(props as ComponentProps<typeof BlockQuote>)} />
  ),
  span: (props: ComponentProps<'span'>) => (
    <span className={text({ size: 'xl' })} {...props} />
  ),
  em: (props: ComponentProps<'span'>) => (
    <em className={css({ fontStyle: 'italic' })} {...props} />
  ),
  Text: (props) => <span {...props} className={text({ size: 'xl' })} />,
  ul: (props) => <Ul {...(props as ComponentProps<typeof Ul>)} />,
  ol: (props) => <Ol {...(props as ComponentProps<typeof Ol>)} />,
  li: (props) => <li {...props} className={text({ size: 'xl' })} />,
}
