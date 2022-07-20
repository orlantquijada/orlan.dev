import { type NextApiRequest, NextApiResponse } from 'next'
import { Months } from 'src/lib/contentlayer'
import { getDailies } from 'src/lib/daily'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const today = new Date()
  const monthToday = today.getMonth()
  const dateToday = today.getDate()

  const dailyToday = getDailies({
    filter: { month: Months[monthToday], day: dateToday },
  })

  if (dailyToday.length) res.status(200).json(dailyToday)
  else
    res.status(404).json({
      message: `No entry found for ${Months[monthToday]} ${dateToday}.`,
    })
}
