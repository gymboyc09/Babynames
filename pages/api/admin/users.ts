import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { deleteUsers, listGoogleUsers, setUsersBlocked } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  // @ts-ignore
  if (!session?.user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  try {
    if (req.method === 'GET') {
      const { page = '1', pageSize = '50' } = req.query
      const pageNum = Math.max(parseInt(page as string, 10) || 1, 1)
      const sizeNum = Math.min(Math.max(parseInt(pageSize as string, 10) || 50, 1), 200)
      const skip = (pageNum - 1) * sizeNum
      const data = await listGoogleUsers({ skip, limit: sizeNum })
      return res.status(200).json({ ...data, page: pageNum, pageSize: sizeNum })
    }

    if (req.method === 'PUT') {
      const { ids, block } = req.body as { ids: string[]; block: boolean }
      const modified = await setUsersBlocked(ids || [], !!block)
      return res.status(200).json({ modified })
    }

    if (req.method === 'DELETE') {
      const { ids } = req.body as { ids: string[] }
      const deleted = await deleteUsers(ids || [])
      return res.status(200).json({ deleted })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  } catch (error) {
    console.error('Admin users API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


