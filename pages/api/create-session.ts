import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for sessions (in production, use Redis or database)
const sessions = new Map<string, { name: string; createdAt: number; expiresAt: number }>();

// Clean up expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Generate unique session ID
    const sessionId = uuidv4();
    const now = Date.now();
    const expiresAt = now + (60 * 60 * 1000); // 1 hour expiration
    
    // Store session
    sessions.set(sessionId, {
      name: name.trim(),
      createdAt: now,
      expiresAt
    });
    
    res.status(200).json({ 
      sessionId,
      cleanName: name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export sessions for validation
export { sessions };

