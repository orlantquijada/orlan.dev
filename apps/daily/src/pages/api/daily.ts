import { type Daily } from 'contentlayer/generated'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { getDailyToday } from 'src/lib/api'
import { pickProps } from 'src/lib/utils'

function transformData(data: Daily) {
  return {
    ...pickProps(data, {
      author: true,
      book: true,
      section: true,
      url: true,
      day: true,
      month: true,
      monthSubject: true,
    }),
    title: data.title.raw,
    quote: data.quote.raw,
    body: data.body.raw,
  }
}

export default function handler(
  { query: { timezone } }: NextApiRequest,
  res: NextApiResponse
) {
  const dailyToday = getDailyToday(timezone as string)

  if (dailyToday) res.status(200).json(transformData(dailyToday))
  else
    res.status(404).json({
      message: `No entry found for today.`,
    })
}
