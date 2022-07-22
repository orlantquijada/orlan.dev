import { type InferGetServerSidePropsType } from 'next'
import { parse } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { allDailies, Daily } from 'contentlayer/generated'
import { Month, Months } from 'src/lib/contentlayer'
import DailyDetail from '@components/daily/DailyDetail'

export default function DailyPage({
  daily,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <DailyDetail daily={daily} />
}
DailyPage.theme = 'light'

export async function getServerSideProps() {
  // necessary to display the correct daily entry based on HK timezone
  // since `getServerSideProps` uses UTC by default
  const format = 'yyyy-MM-dd HH:mm:ss'
  const today = parse(
    formatInTimeZone(new Date(), 'Asia/Hong_Kong', format),
    format,
    new Date()
  )

  const dailyToday = allDailies.find(
    ({ month, day }) =>
      Months.indexOf(month as Month) === today.getMonth() &&
      day === today.getDate()
  ) as Daily

  return {
    props: { daily: dailyToday },
    notFound: !dailyToday,
  }
}
