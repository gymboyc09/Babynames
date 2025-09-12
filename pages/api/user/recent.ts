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
      return res.status(200).json(userData?.recentCalculations || [])
    }

    if (req.method === 'POST') {
      const { calculation } = req.body
      const userData = await getUserData(userId)
      const recentCalculations = userData?.recentCalculations || []
      
      // Add new calculation to the beginning
      recentCalculations.unshift({
        ...calculation,
        timestamp: new Date().toISOString()
      })
      
      // Keep only last 50 calculations
      const limitedCalculations = recentCalculations.slice(0, 50)
      await updateUserData(userId, { recentCalculations: limitedCalculations })
      
      return res.status(200).json({ success: true })
    }

    if (req.method === 'DELETE') {
      const { id } = req.body
      const userData = await getUserData(userId)
      const recentCalculations = (userData?.recentCalculations || []).filter((calc: any) => calc.id !== id)
      await updateUserData(userId, { recentCalculations })
      
      return res.status(200).json({ success: true })
    }
  } catch (error) {
    console.error('Error in recent calculations API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
