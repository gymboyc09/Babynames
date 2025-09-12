import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectToDatabase, getUserData, createUserData, updateUserData } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
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
      return res.status(200).json(userData)
    }

    if (req.method === 'PUT') {
      const { favorites, recentCalculations } = req.body
      await updateUserData(userId, { 
        favoriteNames: favorites || [], 
        recentCalculations: recentCalculations || [] 
      })
      return res.status(200).json({ success: true })
    }
  } catch (error) {
    console.error('Error in user data API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
