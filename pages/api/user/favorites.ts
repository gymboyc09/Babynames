import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectToDatabase, getUserData, updateUserData } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = session.user.id

    if (req.method === 'GET') {
      const userData = await getUserData(userId)
      return res.status(200).json(userData?.favoriteNames || [])
    }

    if (req.method === 'POST') {
      const { name } = req.body
      const userData = await getUserData(userId)
      const favorites = userData?.favoriteNames || []
      
      if (!favorites.includes(name)) {
        favorites.push(name)
        await updateUserData(userId, { favoriteNames: favorites })
      }
      
      return res.status(200).json({ success: true })
    }

    if (req.method === 'DELETE') {
      const { name } = req.body
      const userData = await getUserData(userId)
      const favorites = (userData?.favoriteNames || []).filter((fav: string) => fav !== name)
      await updateUserData(userId, { favoriteNames: favorites })
      
      return res.status(200).json({ success: true })
    }
  } catch (error) {
    console.error('Error in favorites API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
