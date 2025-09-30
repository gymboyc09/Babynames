import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { backfillNameGenders } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  // @ts-ignore
  if (!session?.user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const batch = parseInt((req.body?.batch as string) || '1000', 10)
  const force = Boolean(req.body?.force)
  const result = await backfillNameGenders(isNaN(batch) ? 1000 : batch, force)
  return res.status(200).json(result)
}
