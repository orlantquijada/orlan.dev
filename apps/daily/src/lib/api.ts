import { parse } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { allDailies, Daily } from 'contentlayer/generated'
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { z } from 'zod'

import { Month, Months } from './contentlayer'
import { FilterFalseProps, KeysFlag, pickProps } from './utils'
import { genAI, getPrompt } from './gemini'
import { Reminder, reminderSchema, promptSchema } from './schema'
import { redis } from './redis'

type FilterKeys = Extract<keyof Daily, 'author' | 'day' | 'month'>
type BetterTypedDaily = Daily & { month: Month }

function filterByKey<Key extends FilterKeys>(
  dailies: Daily[],
  key: Key,
  value: BetterTypedDaily[Key],
) {
  return dailies.filter((daily) => daily[key] === value)
}

export function getDailies<
  Flags extends KeysFlag<Daily> = { [Key in keyof Daily]: true },
  Result = [FilterFalseProps<Flags>] extends [keyof Daily]
    ? Pick<Daily, FilterFalseProps<Flags>>
    : Daily,
>(
  options: {
    select?: Flags
    filter?: Partial<Pick<BetterTypedDaily, FilterKeys>>
  } = {},
): Result[] {
  const { select, filter } = options

  let dailies = allDailies

  if (filter) {
    const { author, day, month } = filter

    if (month) dailies = filterByKey(dailies, 'month', month as Month)
    if (day) dailies = filterByKey(dailies, 'day', day)
    if (author) dailies = filterByKey(dailies, 'author', author)
  }
  if (select) dailies = dailies.map((daily) => pickProps(daily, select))

  return dailies as unknown as Result[]
}

export function getDailyToday(timezone = 'Asia/Manila') {
  // correctly display `Daily` today based on timezone if given
  // ^ above is necessary bec `getServerSideProps` uses UTC by default
  const format = 'yyyy-MM-dd HH:mm:ss'
  const today = parse(
    formatInTimeZone(new Date(), timezone, format),
    format,
    new Date(),
  )

  const dailyToday = getDailies({
    filter: { month: Months[today.getMonth()], day: today.getDate() },
  })

  if (dailyToday.length) return dailyToday[0]
}

export function getPreviousMonth(month: Month) {
  const indexOfPrevMonth = Months.indexOf(month) - 1
  return Months[
    indexOfPrevMonth < Months.indexOf('January')
      ? Months.indexOf('December')
      : indexOfPrevMonth
  ]
}

export function getNextMonth(month: Month) {
  const indexOfNextMonth = Months.indexOf(month) + 1
  return Months[
    indexOfNextMonth > Months.indexOf('December')
      ? Months.indexOf('January')
      : indexOfNextMonth
  ]
}

export function getMonthToday() {
  const today = new Date()
  return Months[today.getMonth()]
}

type RemindersData = {
  title: string
  author: string
  subject: string
  quote: string
  body: string
}

export async function getRemindersAI(data: RemindersData) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-pro',
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  })

  const prompt = getPrompt(data)
  const result = await model.generateContent(prompt)
  return result.response.text()
}

const DAILY_KEY = '__daily_/'
export const getKey = ({ day, month }: Pick<Daily, 'month' | 'day'>) =>
  `${DAILY_KEY}${month}/${day}`
export const parseKey = <
  T extends string = `${typeof DAILY_KEY}${Month}/${string}`,
>(
  key: T,
) => {
  const [, month, _day] = key.split('/')

  const day = parseInt(_day, 10)
  if (Months.includes(month as Month) && !Number.isNaN(day)) {
    return {
      success: true,
      data: { month: month as Month, day },
    } as const
  }

  return {
    success: false,
  } as const
}

export async function getCachedOrSetReminders(
  { day, month }: Pick<Daily, 'month' | 'day'>,
  data: RemindersData,
) {
  const key = getKey({ month: month, day: day })

  // `redis.get` automatically runs `JSON.parse`
  const cachedResponse = await redis.get<Reminder[]>(key)

  let reminders: Reminder[] = []
  if (cachedResponse !== null) {
    const parseResult = z.array(reminderSchema).safeParse(cachedResponse)
    reminders = parseResult.success ? parseResult.data : []
  } else {
    const promptResult = await getRemindersAI({
      body: data.body,
      quote: data.quote,
      subject: data.subject,
      author: data.author,
      title: data.title,
    })
    const parseResult = promptSchema.safeParse(promptResult)
    reminders = parseResult.success ? parseResult.data : []

    await redis.set(key, reminders)
  }

  return reminders
}
