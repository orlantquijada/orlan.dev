import { type NextApiRequest, type NextApiResponse } from 'next'
import { Months, type Month } from 'src/lib/contentlayer'
import { getDailies } from 'src/lib/api'
import { capitalize } from '@/lib/utils'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { month, day, fields } = _req.query

  const parsedDay = parseInt(day as string, 10)
  if (isNaN(parsedDay)) res.status(400).json('Invalid day value')

  const capitalizedMonth = month
    ? capitalize(month as Lowercase<Month>)
    : undefined

  if (capitalizedMonth && Months.indexOf(capitalizedMonth) === -1)
    res.status(400).json('Invalid month value')

  let select: Record<string, boolean> | undefined = undefined
  if (fields && typeof fields === 'string') {
    select = {}
    for (const key of fields.split(',')) select[key] = true
  }

  const daily = getDailies({
    filter: {
      month: capitalizedMonth,
      day: parsedDay,
    },
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=604800, stale-while-revalidate=86400'
  )

  if (!daily.length)
    res
      .status(404)
      .json(`No entry found for ${capitalizedMonth}, ${parsedDay}.`)

  res.status(200).json(daily[0])
}