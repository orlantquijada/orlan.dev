import { type InferGetServerSidePropsType } from 'next'
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
  const today = new Date()

  const dailyToday = allDailies.find(
    ({ month, day }) =>
      Months.indexOf(month as Month) === today.getMonth() &&
      day === today.getDate()
  ) as Daily

  return {
    props: {
      daily: dailyToday,
    },
    notFound: !dailyToday,
  }
}
