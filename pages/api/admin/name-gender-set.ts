import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { setNameGender } from '@/lib/database'

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

  const { name, gender } = req.body || {}
  if (!name || !gender) {
    return res.status(400).json({ error: 'name and gender are required' })
  }

  const ok = await setNameGender(String(name), gender)
  return res.status(ok ? 200 : 500).json(ok ? { saved: true } : { error: 'Failed to update' })
}
