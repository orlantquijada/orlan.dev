import { type InferGetServerSidePropsType } from 'next'
import { allDailies, Daily } from 'contentlayer/generated'
import { Month, Months } from 'src/lib/contentlayer'
import DailyDetail from '@components/daily/DailyDetail'

export default function DailyPage({
  daily,
  toLocaleString,
  toString,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <DailyDetail daily={daily} />
      <div>
        <div>{toLocaleString}</div>
        <div>{toString}</div>
      </div>
    </>
  )
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
      toLocaleString: today.toLocaleString(),
      toString: today.toString(),
    },
    notFound: !dailyToday,
  }
}
