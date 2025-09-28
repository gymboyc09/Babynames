import { NextApiRequest, NextApiResponse } from 'next';
import { generateSitemapXml } from '@/lib/sitemap';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sitemap = await generateSitemapXml();

    // Set proper headers for XML
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(sitemap);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
