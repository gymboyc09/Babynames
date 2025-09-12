import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectToDatabase, getUserData, createUserData, updateUserData } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = session.user.id
    const { favorites, recentCalculations } = req.body

    // Check if user data already exists
    let userData = await getUserData(userId)
    
    if (!userData) {
      // Create new user data
      await createUserData(userId)
      // Then update with the migrated data
      await updateUserData(userId, {
        favoriteNames: favorites || [],
        recentCalculations: recentCalculations || []
      })
    } else {
      // Update existing user data
      await updateUserData(userId, {
        favoriteNames: favorites || [],
        recentCalculations: recentCalculations || []
      })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error in migrate API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
