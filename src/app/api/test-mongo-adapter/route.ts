import { NextResponse } from 'next/server';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'No MongoDB URI' }, { status: 500 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    const clientPromise = client.connect();
    
    // Test if we can create the adapter
    const adapter = MongoDBAdapter(clientPromise as Promise<MongoClient>);
    
    await client.close();
    
    return NextResponse.json({
      message: 'MongoDB adapter test successful',
      hasAdapter: !!adapter,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      error: 'MongoDB adapter test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
