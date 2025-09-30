import { NextApiRequest, NextApiResponse } from 'next';
import { searchNames, getAllNames, type DbNameItem } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { search, limit = '10' } = req.query;
    const limitNum = parseInt(limit as string, 10);
    
    if (limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: 'Limit must be between 1 and 50' });
    }

    let items: DbNameItem[] = [];
    
    if (search && typeof search === 'string' && search.trim()) {
      items = await searchNames(search.trim(), limitNum);
    } else {
      items = await getAllNames(limitNum);
    }

    res.status(200).json({ names: items });
  } catch (error) {
    console.error('Error in names search API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
