import {
  type GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { allDailies, type Daily } from 'contentlayer/generated'

import { Months, MonthSubjectsMap, type Month } from '@/lib/contentlayer'
import { getNextMonth, getPreviousMonth } from '@/lib/api'
import DailyCalendar from '@/components/DailyCalendar'

export default function MonthsNavPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { query } = useRouter()
  const currentMonth = capitalize(query.month as Lowercase<Month>)

  const { data: currentMonthData } = useSWR(currentMonth, {
    fallbackData: data,
  })
  // prefetch previous and next month
  useSWR(getPreviousMonth(currentMonth), fetcher)
  useSWR(getNextMonth(currentMonth), fetcher)

  const subject = MonthSubjectsMap[currentMonth]

  return (
    <>
      <Head>
        <title>
          {currentMonth} — {subject}
        </title>
        <meta name="description" content={subject} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DailyCalendar month={currentMonth} data={currentMonthData || []} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Months.map((month) => ({
    params: { month: month.toLowerCase() },
  }))

  return {
    paths,
    fallback: false,
  }
}

type Data = Pick<Daily, '_id' | 'title' | 'url'>

export const getStaticProps: GetStaticProps<
  { data: Data[] },
  { month: Lowercase<Month> }
> = async ({ params }) => {
  if (!params) return { notFound: true }

  return {
    props: {
      data: allDailies
        .filter(({ month }) => month.toLowerCase() === params.month)
        .map(({ _id, title, url }) => ({ _id, title, url })),
    },
  }
}

function capitalize<T extends string>(str: T) {
  return `${str[0].toUpperCase()}${str.slice(1)}` as Capitalize<T>
}

async function fetcher(month: Month) {
  const params = new URLSearchParams({
    fields: '_id,title,url',
    month: month,
  })

  return fetch(`/api/dailies?${params.toString()}`).then((res) => res.json())
}
