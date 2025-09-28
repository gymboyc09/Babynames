import { NextApiRequest, NextApiResponse } from 'next';
import { getNamesForSitemap } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onlinebabynames.com';
    const allNames = await getNamesForSitemap(); // Get names optimized for sitemap
    
    // Generate dynamic calculator pages for each name
    const dynamicPages = allNames.map(name => {
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return {
        url: `${baseUrl}/calculator/${cleanName}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
      };
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${dynamicPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(sitemap);

  } catch (error) {
    console.error('Error generating names sitemap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
