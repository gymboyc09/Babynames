import type { NextApiRequest, NextApiResponse } from 'next'
import { getTrendingNames } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const items = await getTrendingNames()
    return res.status(200).json({ names: items })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}


