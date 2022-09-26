import { type GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { Months, MonthSubjectsMap, type Month } from '@/lib/contentlayer'
import { capitalize, getDetailSocialMediaImage } from '@/lib/utils'

import DailyCalendar from '@/components/DailyCalendar'
import MetaTags from '@/components/MetaTags'

export default function MonthsNavPage() {
  const { query } = useRouter()
  const month = query.month as Lowercase<Month>
  const currentMonth = capitalize(month)
  const subject = MonthSubjectsMap[currentMonth]
  const image = getDetailSocialMediaImage('month', {
    month,
    monthSubject: subject,
  })

  return (
    <>
      <MetaTags
        description={subject}
        title={`${currentMonth} — ${subject}`}
        image={image}
        url={`/${currentMonth}`}
      />
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
