import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { addNamesBulk, deleteNamesBulk, getNamesPage, updateNameValue } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  // @ts-ignore
  if (!session?.user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  try {
    if (req.method === 'GET') {
      const { q = '', mode = 'contains', page = '1', pageSize = '50' } = req.query
      const pageNum = Math.max(parseInt(page as string, 10) || 1, 1)
      const sizeNum = Math.min(Math.max(parseInt(pageSize as string, 10) || 50, 1), 200)
      const skip = (pageNum - 1) * sizeNum
      const data = await getNamesPage({ search: String(q), mode: (String(mode) as any), skip, limit: sizeNum })
      return res.status(200).json({ ...data, page: pageNum, pageSize: sizeNum })
    }

    if (req.method === 'POST') {
      const { names } = req.body as { names: string[] }
      const result = await addNamesBulk(names || [])
      return res.status(200).json(result)
    }

    if (req.method === 'PUT') {
      const { oldName, newName } = req.body as { oldName: string; newName: string }
      const ok = await updateNameValue(oldName, newName)
      return res.status(ok ? 200 : 404).json(ok ? { updated: true } : { error: 'Name not found' })
    }

    if (req.method === 'DELETE') {
      const { names } = req.body as { names: string[] }
      const deleted = await deleteNamesBulk(names || [])
      return res.status(200).json({ deleted })
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  } catch (error) {
    console.error('Admin names API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


