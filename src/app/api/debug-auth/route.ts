import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Test if authOptions can be imported and used
    const hasAuthOptions = !!authOptions;
    const hasProviders = authOptions.providers?.length > 0;
    const providerName = authOptions.providers?.[0]?.name || 'none';
    
    // Test environment variables
    const envCheck = {
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    };

    // Test MongoDB connection
    let mongoTest: { connected: boolean; error: string | null } = { connected: false, error: null };
    try {
      if (process.env.MONGODB_URI) {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        await client.close();
        mongoTest = { connected: true, error: null };
      }
    } catch (error) {
      mongoTest = { connected: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    return NextResponse.json({
      message: 'Auth debug info',
      timestamp: new Date().toISOString(),
      authConfig: {
        hasAuthOptions,
        hasProviders,
        providerName,
        sessionStrategy: authOptions.session?.strategy,
        // hasAdapter: !!authOptions.adapter, // Removed since adapter is commented out
      },
      environment: envCheck,
      mongoTest,
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Auth debug error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
