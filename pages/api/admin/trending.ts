import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getTrendingNames, setTrendingNames, type TrendingItem } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  // @ts-ignore
  if (!session?.user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  try {
    if (req.method === 'GET') {
      const names = await getTrendingNames()
      return res.status(200).json({ names })
    }
    if (req.method === 'PUT') {
      const { names } = req.body as { names: TrendingItem[] }
      const ok = await setTrendingNames(names || [])
      return res.status(ok ? 200 : 500).json(ok ? { saved: true } : { error: 'Failed to save' })
    }
    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  } catch (error) {
    console.error('Admin trending API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


