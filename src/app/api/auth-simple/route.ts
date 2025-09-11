import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Simple auth route test',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Simple auth POST test',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
