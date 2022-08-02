import {
  type GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Link from 'next/link'
import Head from 'next/head'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { allDailies, type Daily } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'

import { css } from '@stitches.config'
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
      <div className={main()}>
        {currentMonth}
        {currentMonthData?.map((data) => (
          <Card data={data} key={data._id} />
        ))}

        <DailyCalendar month={currentMonth} />
      </div>
    </>
  )
}

const main = css({
  maxWidth: '650px',
  mx: 'auto',
})

function Card({ data: { title, url } }: { data: Data }) {
  const Title = useMDXComponent(title.code)
  return (
    <div>
      <Link href={url}>
        <a>
          <Title />
        </a>
      </Link>
    </div>
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
