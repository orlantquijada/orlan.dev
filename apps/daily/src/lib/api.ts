import { parse } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { allDailies, Daily } from 'contentlayer/generated'

import { Month, Months } from './contentlayer'
import { FilterFalseProps, KeysFlag, pickProps } from './utils'

type FilterKeys = Extract<keyof Daily, 'author' | 'day' | 'month'>
type BetterTypedDaily = Daily & { month: Month }

function filterByKey<Key extends FilterKeys>(
  dailies: Daily[],
  key: Key,
  value: BetterTypedDaily[Key]
) {
  return dailies.filter((daily) => daily[key] === value)
}

export function getDailies<
  Flags extends KeysFlag<Daily> = { [Key in keyof Daily]: true },
  Result = [FilterFalseProps<Flags>] extends [keyof Daily]
    ? Pick<Daily, FilterFalseProps<Flags>>
    : Daily
>(
  options: {
    select?: Flags
    filter?: Partial<Pick<BetterTypedDaily, FilterKeys>>
  } = {}
): Result[] {
  const { select, filter } = options

  let dailies = allDailies

  if (select) dailies = dailies.map((daily) => pickProps(daily, select))
  if (filter) {
    const { author, day, month } = filter

    if (month) dailies = filterByKey(dailies, 'month', month as Month)
    if (day) dailies = filterByKey(dailies, 'day', day)
    if (author) dailies = filterByKey(dailies, 'author', author)
  }

  return dailies as unknown as Result[]
}

export function getDailyToday(timezone = 'Asia/Manila') {
  // correctly display `Daily` today based on timezone if given
  // ^ above is necessary bec `getServerSideProps` uses UTC by default
  const format = 'yyyy-MM-dd HH:mm:ss'
  const today = parse(
    formatInTimeZone(new Date(), timezone, format),
    format,
    new Date()
  )

  const dailyToday = getDailies({
    filter: { month: Months[today.getMonth()], day: today.getDate() },
  })

  if (dailyToday.length) return dailyToday[0]
}
