import { NextApiRequest, NextApiResponse } from 'next';
import { validateToken } from '@/lib/security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ valid: false, error: 'Token is required' });
    }
    
    // Validate token
    const result = validateToken(token);
    
    if (result.valid) {
      res.status(200).json({ valid: true, name: result.name });
    } else {
      res.status(400).json({ valid: false, error: result.error });
    }
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({ valid: false, error: 'Internal server error' });
  }
}
