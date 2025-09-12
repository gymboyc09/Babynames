import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { addRecentCalculation, removeRecentCalculation } from '@/lib/database';
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
        const addSuccess = await addRecentCalculation(userId, nameAnalysis);
        if (addSuccess) {
          return res.status(200).json({ message: 'Recent calculation added successfully' });
        } else {
          return res.status(500).json({ error: 'Failed to add recent calculation' });
        }

      case 'DELETE':
        const { nameId } = req.body;
        const removeSuccess = await removeRecentCalculation(userId, nameId);
        if (removeSuccess) {
          return res.status(200).json({ message: 'Recent calculation removed successfully' });
        } else {
          return res.status(500).json({ error: 'Failed to remove recent calculation' });
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
