import { type ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { css } from 'styled-system/css'
import { text } from 'styled-system/recipes'

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

export const bodyComponents = {
  p: (props: ComponentProps<typeof P>) => (
    <P {...props} className={text({ size: 'xl' })} />
  ),
  blockquote: (props: ComponentProps<typeof BlockQuote>) => (
    <BlockQuote {...props} />
  ),
  span: (props: ComponentProps<'span'>) => (
    <span className={text({ size: 'xl' })} {...props} />
  ),
  em: (props: ComponentProps<'span'>) => (
    <em className={css({ fontStyle: 'italic' })} {...props} />
  ),
  Text: (props: ComponentProps<'span'>) => (
    <span {...props} className={text({ size: 'xl' })} />
  ),
  ul: (props: ComponentProps<typeof Ul>) => <Ul {...props} />,
  ol: (props: ComponentProps<typeof Ol>) => <Ol {...props} />,
  li: (props: ComponentProps<'li'>) => (
    <li {...props} className={text({ size: 'xl' })} />
  ),
}
