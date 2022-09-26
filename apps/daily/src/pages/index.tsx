import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { Daily } from 'contentlayer/generated'

import { getDailyToday } from '@/lib/api'
import { getDetailSocialMediaImage } from '@/lib/utils'

import DailyDetail from '@/components/DailyDetail'
import MetaTags from '@/components/MetaTags'

export default function Home({
  daily,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const image = getDetailSocialMediaImage('detail', daily)

  return (
    <>
      <MetaTags
        description={daily.quote.raw}
        title={daily.title.raw}
        image={image}
        url="/"
      />
      <DailyDetail daily={daily} />
    </>
  )
}

export async function getServerSideProps({
  query: { timezone },
  res,
}: GetServerSidePropsContext) {
  res.setHeader('Cache-Control', 'public, no-cache')
  const dailyToday = getDailyToday(timezone as string)

  return {
    props: { daily: dailyToday as Daily },
    notFound: !dailyToday,
  }
}
