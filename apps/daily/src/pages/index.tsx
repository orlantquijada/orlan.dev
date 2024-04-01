import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'

import { getCachedOrSetReminders, getDailyToday } from '@/lib/api'
import { getDetailSocialMediaImage } from '@/lib/utils'

import DailyDetail from '@/components/DailyDetail'
import MetaTags from '@/components/MetaTags'

export default function Home({
  daily,
  reminders,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const image = getDetailSocialMediaImage({
    title: daily.title.raw,
    subtitle: `${daily.month} ${daily.day}`,
    author: daily.author,
  })

  return (
    <>
      <MetaTags
        description={daily.quote.raw}
        title={daily.title.raw}
        image={image}
        url=""
      />
      <DailyDetail daily={daily} reminders={reminders} />
    </>
  )
}

export async function getServerSideProps({
  query: { timezone },
  res,
}: GetServerSidePropsContext) {
  res.setHeader('Cache-Control', 'public, no-cache')
  const dailyToday = getDailyToday(timezone as string)

  if (!dailyToday) return { notFound: true }

  const reminders = await getCachedOrSetReminders(
    { month: dailyToday.month, day: dailyToday.day },
    {
      subject: dailyToday.monthSubject,
      author: dailyToday.author,
      title: dailyToday.title.raw,
      quote: dailyToday.quote.raw,
      body: dailyToday.body.raw,
    },
  )

  return {
    props: { daily: dailyToday, reminders },
  }
}
