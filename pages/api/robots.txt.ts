import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onlinebabynames.com';
    
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/api/sitemap.xml
Sitemap: ${baseUrl}/api/sitemap-index.xml
Sitemap: ${baseUrl}/api/sitemap-static.xml
Sitemap: ${baseUrl}/api/sitemap-names.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow all search engines to crawl calculator pages
User-agent: Googlebot
Allow: /calculator/
Allow: /api/

User-agent: Bingbot
Allow: /calculator/
Allow: /api/

User-agent: Slurp
Allow: /calculator/
Allow: /api/

# Disallow admin or private areas (if any)
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /api/auth/`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.status(200).send(robotsTxt);

  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
