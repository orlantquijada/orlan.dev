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
        </StyledA>
      </Link>
    </StyledLi>
  )
}

const StyledDate = styled('span', {
  color: '$olive10',

  '@tab': {
    width: '5rem',
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
  display: 'flex',
  flexDirection: 'column',
  py: '1rem',
  px: '0.5rem',
  transition: 'all 150ms ease',

  '@tab': {
    flexDirection: 'row',
    alignItems: 'center',
  },

  '&:hover': {
    backgroundColor: '$olive2',
  },
})
const StyledTitle = styled('p', textStyles, {
  color: '$olive11',
  fontWeight: '$bold',

  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  marginTop: '0.5rem',

  '@tab': {
    marginTop: 0,
  },
})

const likedTitleComponents = {
  p: (props: ComponentProps<typeof StyledTitle>) => (
    <StyledTitle {...props} size={{ '@initial': 'base', '@tab': 'lg' }} />
  ),
}
