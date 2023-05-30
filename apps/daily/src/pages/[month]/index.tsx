import { type GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'

import { Months, MonthSubjectsMap, type Month } from '@/lib/contentlayer'
import { capitalize, getDetailSocialMediaImage } from '@/lib/utils'
import { fadeIn, styled } from '@stitches.config'
import { useLikes } from '@/hooks/useLikes'

import DailyCalendar from '@/components/DailyCalendar'
import MetaTags from '@/components/MetaTags'
import { LikesList } from '@/components/Likes'
import { Daily } from 'contentlayer/generated'
import { textStyles } from '@/components/Text'
// import InstallButton from '@/components/InstallButton'

export default function MonthsNavPage() {
  const { query } = useRouter()
  const month = query.month as Lowercase<Month>
  const capitalizedMonth = capitalize(month)
  const subject = MonthSubjectsMap[capitalizedMonth]
  const image = getDetailSocialMediaImage('month', {
    month: capitalizedMonth,
    monthSubject: subject,
  })

  const likes = useLikes()
  const likesThisMonth = likes
    .filter((daily) => daily.month === capitalizedMonth)
    .sort((current, next) => current.day - next.day)

  return (
    <>
      <MetaTags
        description={subject}
        title={`${capitalizedMonth} — ${subject}`}
        image={image}
        url={`/${month}`}
      />
      <Main>
        <DailyCalendar month={capitalizedMonth} />
        <Likes likes={likesThisMonth} month={capitalizedMonth} />

        {/* <InstallButton */}
        {/*   css={{ */}
        {/*     height: 'var(--toastHeight)', */}
        {/*     position: 'fixed', */}
        {/*     bottom: 'var(--contentPaddingY)', */}
        {/*     right: 'var(--contentPaddingX)', */}

        {/*     '@tab': { */}
        {/*       right: 'var(--contentPaddingY)', */}
        {/*     }, */}
        {/*   }} */}
        {/* /> */}
      </Main>
    </>
  )
}

function Likes({ likes, month }: { likes: Daily[]; month: Month }) {
  return (
    <AnimatePresence exitBeforeEnter>
      {likes.length ? (
        <LikesContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          key={month}
        >
          <SectionTitle size={{ '@initial': 'xl', '@tab': '2xl' }}>
            Liked
          </SectionTitle>

          <LikesList likes={likes} />
        </LikesContainer>
      ) : null}
    </AnimatePresence>
  )
}

const LikesContainer = styled(motion.section, {
  width: '100%',

  // '@tab': {
  //   opacity: 0.75,
  //   transition: 'all 200ms ease',

  //   '&:hover, &:focus-within': {
  //     opacity: 1,
  //   },
  // },
})

const SectionTitle = styled('h2', textStyles, {
  color: '$olive11',
})

const Main = styled('main', {
  '--contentMaxWidth': '650px',
  '--contentPaddingX': '1rem',
  '--contentPaddingY': '2rem',
  '--toastHeight': '4rem',

  maxWidth: 'var(--contentMaxWidth)',
  mx: 'auto',
  px: 'var(--contentPaddingX)',
  pt: 'var(--contentPaddingY)',
  pb: 'calc(var(--contentPaddingY) + var(--toastHeight) + 1rem)',
  minHeight: '100vh',

  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  alignItems: 'center',

  animation: `${fadeIn} 1s both`,

  // handle days drag to the right (translateX overflow) which causes everything to scale down
  overflowX: 'hidden',

  '@tab': {
    overflowX: 'initial',
  },
})

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Months.map((month) => ({
    params: { month: month.toLowerCase() },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  Record<string, never>,
  { month: Lowercase<Month> }
> = async ({ params }) => {
  if (!params) return { notFound: true }

  const month = capitalize(params.month)

  if (!Months.includes(month)) return { notFound: true }

  return {
    props: {},
  }
}
