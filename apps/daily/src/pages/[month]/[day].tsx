import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { allDailies, type Daily } from 'contentlayer/generated'
import { Month } from 'src/lib/contentlayer'

import { getCachedOrSetReminders, getDailies } from '@/lib/api'
import { capitalize, getDetailSocialMediaImage } from '@/lib/utils'

import DailyDetail from '@/components/DailyDetail'
import MetaTags from '@/components/MetaTags'
import { Reminder } from '@/lib/schema'

export default function EntryDetailPage({
  daily,
  reminders,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
        url={`/${daily.month.toLowerCase()}/${daily.day}`}
      />
      <DailyDetail daily={daily} reminders={reminders} />
    </>
  )
}

export async function getStaticPaths() {
  const paths = allDailies.map(({ day, month }) => ({
    params: { month: month.toLowerCase(), day: day.toString() },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  { daily: Daily; reminders: Reminder[] },
  { month: Lowercase<Month>; day: string }
> = async ({ params }) => {
  if (!params) return { notFound: true }

  const { day, month } = params
  const parsedDay = parseInt(day, 10)
  const capitalizedMonth = capitalize(month)

  const daily = getDailies({
    filter: { day: parsedDay, month: capitalizedMonth },
  })[0]

  if (!daily) return { notFound: true }

  const reminders = await getCachedOrSetReminders(
    {
      day: daily.day,
      month: daily.month,
    },
    {
      body: daily.month,
      quote: daily.quote.raw,
      title: daily.title.raw,
      author: daily.author,
      subject: daily.monthSubject,
    },
  )

  return {
    props: {
      daily,
      reminders,
    },
  }
}
