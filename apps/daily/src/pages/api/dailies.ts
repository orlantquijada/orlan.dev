import { type NextApiRequest, type NextApiResponse } from 'next'
import { type Month } from 'src/lib/contentlayer'
import { getDailies } from 'src/lib/api'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { month, fields } = _req.query

  const select: Record<string, boolean> = {}
  if (fields && typeof fields === 'string') {
    for (const key of fields.split(',')) select[key] = true
  }

  const dailies = getDailies({
    filter: { month: month as Month | undefined },
    select,
  })

  res.status(200).json(dailies)
}
