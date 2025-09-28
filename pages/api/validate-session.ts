import { NextApiRequest, NextApiResponse } from 'next';
import { sessions } from './create-session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;
    
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ valid: false, error: 'Session ID is required' });
    }
    
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(400).json({ valid: false, error: 'Session not found' });
    }
    
    // Check expiration
    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionId);
      return res.status(400).json({ valid: false, error: 'Session expired' });
    }
    
    res.status(200).json({ 
      valid: true, 
      name: session.name 
    });
  } catch (error) {
    console.error('Error validating session:', error);
    res.status(500).json({ valid: false, error: 'Internal server error' });
  }
}

