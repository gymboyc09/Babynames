import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Production API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    env: {
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    }
  });
}
