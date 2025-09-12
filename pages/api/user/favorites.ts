import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { addFavoriteName, removeFavoriteName } from '@/lib/database';
import { NameAnalysis } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, {});
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.email;

  try {
    switch (req.method) {
      case 'POST':
        const nameAnalysis: NameAnalysis = req.body;
        const addSuccess = await addFavoriteName(userId, nameAnalysis);
        if (addSuccess) {
          return res.status(200).json({ message: 'Favorite added successfully' });
        } else {
          return res.status(500).json({ error: 'Failed to add favorite' });
        }

      case 'DELETE':
        const { nameId } = req.body;
        const removeSuccess = await removeFavoriteName(userId, nameId);
        if (removeSuccess) {
          return res.status(200).json({ message: 'Favorite removed successfully' });
        } else {
          return res.status(500).json({ error: 'Failed to remove favorite' });
        }

      default:
        res.setHeader('Allow', ['POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
