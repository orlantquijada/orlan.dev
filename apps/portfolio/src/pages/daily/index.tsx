import { type InferGetServerSidePropsType } from 'next'
import { allDailies, Daily } from 'contentlayer/generated'
import { Month, Months } from 'src/lib/contentlayer'
import DailyDetail from '@components/daily/DailyDetail'

import { formatInTimeZone } from 'date-fns-tz'
import { parse } from 'date-fns'

export default function DailyPage({
  daily,
  toLocaleString,
  toString,
}: // defaultLocale, locale,
// locales,
InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <DailyDetail daily={daily} />
      <div>
        <div>{toLocaleString}</div>
        <div>{toString}</div>
        {/* <div>{locale}</div>
        <div>
          {locales?.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
        <div>{defaultLocale}</div> */}
      </div>
    </>
  )
}
DailyPage.theme = 'light'

export async function getServerSideProps() {
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
    props: {
      daily: dailyToday,
      toLocaleString: today.toLocaleString(),
      toString: today.toString(),
      // locale,
      // locales,
      // defaultLocale,
    },
    notFound: !dailyToday,
  }
}
