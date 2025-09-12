import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { getUserData, createUserData, updateUserData } from '@/lib/database';
import { UserData } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, {});
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.email;

  try {
    switch (req.method) {
      case 'GET':
        const userData = await getUserData(userId);
        if (!userData) {
          // Create new user data if doesn't exist
          const newUserData: UserData = {
            id: userId,
            email: session.user.email,
            favoriteNames: [],
            recentCalculations: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          await createUserData(newUserData);
          return res.status(200).json(newUserData);
        }
        return res.status(200).json(userData);

      case 'PUT':
        const updates = req.body;
        const success = await updateUserData(userId, updates);
        if (success) {
          return res.status(200).json({ message: 'User data updated successfully' });
        } else {
          return res.status(500).json({ error: 'Failed to update user data' });
        }

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
