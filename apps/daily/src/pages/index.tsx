import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import Head from 'next/head'
import { Daily } from 'contentlayer/generated'

import { getDailyToday } from '@/lib/api'
import DailyDetail from '@/components/DailyDetail'

export default function Home({
  daily,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{daily.title.raw}</title>
        <meta name="description" content={daily.quote.raw} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DailyDetail daily={daily} />
    </>
  )
}

export async function getServerSideProps({
  query: { timezone },
}: GetServerSidePropsContext) {
  const dailyToday = getDailyToday(timezone as string)

  return {
    props: { daily: dailyToday as Daily },
    notFound: !dailyToday,
  }
}
