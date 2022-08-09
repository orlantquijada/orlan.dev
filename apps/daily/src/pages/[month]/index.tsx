import {
  type GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { type Daily } from 'contentlayer/generated'

import { Months, MonthSubjectsMap, type Month } from '@/lib/contentlayer'
import { getDailies, getNextMonth, getPreviousMonth } from '@/lib/api'
import DailyCalendar from '@/components/DailyCalendar'
import { capitalize, NonEmptyArray } from '@/lib/utils'

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
    fallback: 'blocking',
  }
}

type Data = Pick<Daily, '_id' | 'title' | 'url' | 'month' | 'day'>
const fields: NonEmptyArray<keyof Data> = [
  '_id',
  'title',
  'url',
  'month',
  'day',
]

function getSelectFromFields<T extends NonEmptyArray<keyof Daily>>(f: T) {
  type Select = { [k in keyof Daily]: true }
  const select: Select = {} as Select

  for (const key of f) {
    select[key as T[number]] = true
  }

  return select
}

export const getStaticProps: GetStaticProps<
  { data: Data[] },
  { month: Lowercase<Month> }
> = async ({ params }) => {
  if (!params) return { notFound: true }

  const month = capitalize(params.month)

  if (!Months.includes(month)) return { notFound: true }

  return {
    props: {
      data: getDailies({
        filter: { month },
        select: getSelectFromFields(fields),
      }),
    },
  }
}

async function fetcher(month: Month) {
  const params = new URLSearchParams({
    fields: fields.join(','),
    month: month,
  })

  return fetch(`/api/dailies?${params.toString()}`).then((res) => res.json())
}
