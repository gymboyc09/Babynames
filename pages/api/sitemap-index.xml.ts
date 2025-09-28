import { NextApiRequest, NextApiResponse } from 'next';
import { generateSitemapIndex } from '@/lib/sitemap';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sitemapIndex = await generateSitemapIndex();

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(sitemapIndex);

  } catch (error) {
    console.error('Error generating sitemap index:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
