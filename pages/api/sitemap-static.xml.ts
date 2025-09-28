import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onlinebabynames.com';
    
    // Static pages with high priority
    const staticPages = [
      {
        url: `${baseUrl}/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: `${baseUrl}/about`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: `${baseUrl}/contact`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: `${baseUrl}/privacy`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: '0.5'
      }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages.map(page => `  <url>
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
    console.error('Error generating static sitemap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
