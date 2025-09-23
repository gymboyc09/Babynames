import crypto from 'crypto';

// Secret key for token generation (should be in environment variables)
const SECRET_KEY = process.env.TOKEN_SECRET || 'your-secret-key-change-in-production';

export interface TokenData {
  name: string;
  timestamp: number;
  expiresAt: number;
}

export function generateSecureToken(name: string): string {
  const timestamp = Date.now();
  const expiresAt = timestamp + (60 * 60 * 1000); // 1 hour expiration
  
  const tokenData: TokenData = {
    name,
    timestamp,
    expiresAt
  };
  
  // Create a hash of the token data
  const dataString = JSON.stringify(tokenData);
  const hash = crypto.createHmac('sha256', SECRET_KEY).update(dataString).digest('hex');
  
  // Combine data with hash
  const token = Buffer.from(dataString).toString('base64') + '.' + hash;
  
  return token;
}

export function validateToken(token: string): { valid: boolean; name?: string; error?: string } {
  try {
    const [dataString, hash] = token.split('.');
    
    if (!dataString || !hash) {
      return { valid: false, error: 'Invalid token format' };
    }
    
    // Verify hash
    const expectedHash = crypto.createHmac('sha256', SECRET_KEY).update(dataString).digest('hex');
    if (hash !== expectedHash) {
      return { valid: false, error: 'Invalid token signature' };
    }
    
    // Decode and parse token data
    const tokenData: TokenData = JSON.parse(Buffer.from(dataString, 'base64').toString());
    
    // Check expiration
    if (Date.now() > tokenData.expiresAt) {
      return { valid: false, error: 'Token expired' };
    }
    
    return { valid: true, name: tokenData.name };
  } catch (error) {
    return { valid: false, error: 'Token validation failed' };
  }
}
