import { getNamesForSitemap, getTotalNamesCount } from './database';

export interface SitemapUrl {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export async function generateStaticPages(): Promise<SitemapUrl[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onlinebabynames.com';
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      url: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: `${baseUrl}/about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: `${baseUrl}/privacy`,
      lastmod: today,
      changefreq: 'yearly',
      priority: '0.5'
    }
  ];
}

export async function generateNamePages(): Promise<SitemapUrl[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onlinebabynames.com';
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const allNames = await getNamesForSitemap();
    
    return allNames.map(name => {
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return {
        url: `${baseUrl}/calculator/${cleanName}`,
        lastmod: today,
        changefreq: 'weekly' as const,
        priority: '0.9'
      };
    });
  } catch (error) {
    console.error('Error generating name pages for sitemap:', error);
    return [];
  }
}

export async function generateSitemapXml(): Promise<string> {
  try {
    const [staticPages, namePages] = await Promise.all([
      generateStaticPages(),
      generateNamePages()
    ]);
    
    const allPages = [...staticPages, ...namePages];
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  } catch (error) {
    console.error('Error generating sitemap XML:', error);
    throw error;
  }
}

export async function generateSitemapIndex(): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onlinebabynames.com';
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const totalNames = await getTotalNamesCount();
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-names.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    throw error;
  }
}

export async function pingSearchEngines(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onlinebabynames.com';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  
  // Ping Google
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log('Pinged Google with sitemap');
  } catch (error) {
    console.error('Error pinging Google:', error);
  }
  
  // Ping Bing
  try {
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log('Pinged Bing with sitemap');
  } catch (error) {
    console.error('Error pinging Bing:', error);
  }
}
