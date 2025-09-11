import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/auth-utils';
import { getUserData, updateUserData } from '@/lib/database';

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await getUserData(userId);
    return NextResponse.json({ recentCalculations: userData?.recentCalculations || [] });
  } catch (error) {
    console.error('Error fetching recent calculations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analysis = await request.json();
    
    if (!analysis || !analysis.name) {
      return NextResponse.json({ error: 'Analysis data is required' }, { status: 400 });
    }

    const userData = await getUserData(userId);
    if (!userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    // Add new analysis to the beginning and limit to 20 items
    const updatedRecent = [analysis, ...userData.recentCalculations.filter(a => (a as { name: string }).name !== analysis.name)].slice(0, 20);
    
    await updateUserData(userId, { recentCalculations: updatedRecent });

    return NextResponse.json({ recentCalculations: updatedRecent });
  } catch (error) {
    console.error('Error adding recent calculation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await updateUserData(userId, { recentCalculations: [] });

    return NextResponse.json({ message: 'Recent calculations cleared' });
  } catch (error) {
    console.error('Error clearing recent calculations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}