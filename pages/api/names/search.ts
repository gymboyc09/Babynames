import { NextApiRequest, NextApiResponse } from 'next';
import { searchNames, getAllNames } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { search, limit = '10' } = req.query;
    const limitNum = parseInt(limit as string, 10);
    
    // Validate limit
    if (limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: 'Limit must be between 1 and 50' });
    }

    let names: string[] = [];
    
    if (search && typeof search === 'string' && search.trim()) {
      names = await searchNames(search.trim(), limitNum);
    } else {
      names = await getAllNames(limitNum);
    }

    res.status(200).json({ names });
  } catch (error) {
    console.error('Error in names search API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
