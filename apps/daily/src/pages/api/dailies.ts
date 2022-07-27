import { type NextApiRequest, type NextApiResponse } from 'next'
import { type Month } from 'src/lib/contentlayer'
import { getDailies } from 'src/lib/api'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { month } = _req.query
  const dailies = getDailies({ filter: { month: month as Month | undefined } })

  res.status(200).json(dailies)
}
