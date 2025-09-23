import { NextApiRequest, NextApiResponse } from 'next';
import { generateSecureToken } from '@/lib/security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    const token = generateSecureToken(name.trim());
    
    // Generate SEO-friendly URL
    const seoUrl = `/calculator/${cleanName}?t=${token}`;
    
    res.status(200).json({ 
      url: seoUrl,
      token,
      cleanName 
    });
  } catch (error) {
    console.error('Error generating SEO URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
