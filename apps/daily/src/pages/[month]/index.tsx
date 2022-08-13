import { type GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Months, MonthSubjectsMap, type Month } from '@/lib/contentlayer'
import { capitalize } from '@/lib/utils'
import DailyCalendar from '@/components/DailyCalendar'

export default function MonthsNavPage() {
  const { query } = useRouter()
  const currentMonth = capitalize(query.month as Lowercase<Month>)
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
      <DailyCalendar month={currentMonth} />
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
