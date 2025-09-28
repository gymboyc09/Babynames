import { NextApiRequest, NextApiResponse } from 'next';
import { getTotalNamesCount } from '@/lib/database';
import { pingSearchEngines } from '@/lib/sitemap';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This endpoint can be called to refresh sitemap cache
    // Useful when new names are added to the database
    
    const totalNames = await getTotalNamesCount();
    
    // Ping search engines about sitemap updates
    await pingSearchEngines();
    
    // Log sitemap update
    console.log(`Sitemap updated with ${totalNames} names`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Sitemap updated successfully',
      totalNames: totalNames,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating sitemap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
