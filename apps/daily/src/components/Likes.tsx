import { type ComponentProps } from 'react'
import Link from 'next/link'
import { useMDXComponent } from 'next-contentlayer/hooks'

import { Daily } from 'contentlayer/generated'
import { styled } from '@stitches.config'

import { textStyles } from './Text'

export function LikesList({ likes }: { likes: Daily[] }) {
  return (
    <StyledLikesList>
      {likes.map((like) => (
        <LikedCard daily={like} key={`${like.month}-${like.day}`} />
      ))}
    </StyledLikesList>
  )
}

function LikedCard({ daily }: { daily: Daily }) {
  const Title = useMDXComponent(daily.title.code)

  return (
    <StyledLi>
      <Link
        href={{
          pathname: '/[month]/[day]',
          query: {
            month: daily.month,
            day: daily.day,
          },
        }}
        passHref
      >
        <StyledA>
          <StyledDate>
            {daily.month.slice(0, 3)} {daily.day}
          </StyledDate>
          <Title components={likedTitleComponents} />
          <StyledAuthor>{daily.author}</StyledAuthor>
        </StyledA>
      </Link>
    </StyledLi>
  )
}

const StyledDate = styled('span', {
  gridArea: 'date',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',

  color: '$olive9',

  '@tab': {
    justifyContent: 'flex-start',
  },
})
const StyledAuthor = styled('span', {
  gridArea: 'author',

  color: '$olive11',
  flexShrink: 0,

  '@tab': {
    ml: 'auto',
  },
})
const StyledLikesList = styled('ol', {
  listStyle: 'none',
  padding: 0,
})
const StyledLi = styled('li', {
  '&:not(:first-of-type)': {
    borderTop: '1px solid $olive3',
  },
})
const StyledA = styled('a', {
  display: 'grid',
  gridTemplateAreas: `
    "title title"
    "author date"
  `,

  py: '1rem',
  px: '0.5rem',
  mx: '-0.5rem',
  transition: 'all 150ms ease',

  '@tab': {
    gridTemplateAreas: `
      "date title author"
    `,
    gridTemplateColumns: '5rem auto auto',
  },

  '&:hover': {
    backgroundColor: '$olive2',
  },
})
const StyledTitle = styled('p', textStyles, {
  gridArea: 'title',

  color: '$olive11',
  fontWeight: '$bold',

  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  '@tab': {
    marginTop: 0,
  },
})

const likedTitleComponents = {
  p: (props: ComponentProps<typeof StyledTitle>) => (
    <StyledTitle {...props} size={{ '@initial': 'base', '@tab': 'lg' }} />
  ),
}
