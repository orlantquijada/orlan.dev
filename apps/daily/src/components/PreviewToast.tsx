import {
  type Dispatch,
  type SetStateAction,
  type ComponentProps,
  useEffect,
} from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Daily } from 'contentlayer/generated'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useMDXComponent } from 'next-contentlayer/hooks'

import { shimmer, styled } from '@stitches.config'
import { Months } from '@/lib/contentlayer'
import { Text } from './Text'

const variants: Variants = {
  hide: { y: 'calc(100% + var(--contentPaddingY))', x: '50%' },
  show: { y: 0, x: '50%' },
}

export default function PreviewToast({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date | undefined
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>
}) {
  const { data: daily, error } = useSWR<Daily>(
    () =>
      selectedDate
        ? `api/${Months[selectedDate.getMonth()]}/${selectedDate.getDate()}`
        : null,
    fetcher
  )

  const loading = !daily && !error

  useEffect(() => {
    function hideOnEsc(event: KeyboardEvent) {
      if (event.code === 'Escape') setSelectedDate(undefined)
    }

    window.addEventListener('keydown', hideOnEsc)

    return () => window.removeEventListener('keydown', hideOnEsc)
  }, [setSelectedDate])

  return (
    <AnimatePresence exitBeforeEnter>
      {selectedDate && (
        <Container
          as={motion.div}
          variants={variants}
          // react magic: unmount component on `selectedDate` change
          key={selectedDate.toString()}
          initial="hide"
          animate="show"
          exit="hide"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          css={{
            $$padding: 'calc(var(--contentPaddingX) * 2)',
            width: 'calc(100% - $$padding)',
            position: 'fixed',
            bottom: 'var(--contentPaddingY)',
            right: '50%',
            maxWidth: 'calc(var(--contentMaxWidth) - $$padding)',
          }}
        >
          {loading ? (
            <LoadingTitleSkeleton />
          ) : daily ? (
            <ToastTitle title={daily.title} />
          ) : (
            <Title size={{ '@initial': 'base', '@tab': 'lg' }}>
              No content yet!
            </Title>
          )}

          {daily ? (
            <Link passHref href={daily ? daily.url : '/'}>
              <Action>View</Action>
            </Link>
          ) : null}
        </Container>
      )}
    </AnimatePresence>
  )
}

const LoadingTitleSkeleton = styled('div', {
  $$skeletonColor: '$colors$olive5',
  $$shineColor: '$colors$olive2',

  backgroundImage:
    'linear-gradient(270deg, $$skeletonColor, $$shineColor, $$skeletonColor)',
  backgroundSize: '400% 100%',
  width: '15rem',
  height: '1rem',
  borderRadius: '0.5rem',
  animation: `${shimmer} 8s ease-in-out infinite`,
})

const toastTitleComponents = {
  p: (props: ComponentProps<typeof Title>) => (
    <Title {...props} size={{ '@initial': 'base', '@tab': 'lg' }} />
  ),
}

function ToastTitle({ title }: Pick<Daily, 'title'>) {
  const TitleMDX = useMDXComponent(title.code)

  return <TitleMDX components={toastTitleComponents} />
}

//////////////////////////////////////////////////////////////////

const Container = styled('div', {
  borderRadius: '0.5rem',
  border: '1px solid $olive6',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  px: '0.75rem',
  py: '0.5rem',

  '@tab': {
    px: '1rem',
    py: '0.75rem',
  },
})

const Title = styled(Text, {
  color: '$olive11',
  fontWeight: '$bold',

  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const Action = styled('a', {
  backgroundColor: '$olive3',
  color: '$olive11',
  borderRadius: '4px',
  px: '0.5rem',
  py: '0.25rem',
  display: 'grid',
  placeItems: 'center',
  transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '$base',

  '&:focus': {
    outline: 'none',
    ring: '$olive7',
  },

  '@tab': {
    fontSize: '$lg',
    px: '0.75rem',
    py: '0.25rem',
  },
})

//////////////////////////////////////////////////////////////////

async function fetcher(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    const error: Error & { info: unknown; status: number } = {
      ...new Error('An error occurred while fetching the data.'),
      info: await res.json(),
      status: res.status,
    }
    throw error
  }

  return res.json()
}
