import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/auth-utils';
import { getUserData, updateUserData } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const localData = await request.json();
    
    if (!localData) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const userData = await getUserData(userId);
    if (!userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    // Merge local data with existing user data
    const mergedData = {
      favoriteNames: [...new Set([...userData.favoriteNames, ...(localData.favoriteNames || [])])],
      recentCalculations: [
        ...localData.recentCalculations || [],
        ...userData.recentCalculations.filter((existing) => 
          !localData.recentCalculations?.some((local: { name: string }) => local.name === (existing as { name: string }).name)
        )
      ].slice(0, 20),
      searchHistory: [...new Set([...userData.searchHistory, ...(localData.searchHistory || [])])].slice(0, 10),
      preferences: {
        ...userData.preferences,
        ...localData.preferences
      }
    };

    await updateUserData(userId, mergedData);

    return NextResponse.json({ 
      message: 'Data migrated successfully',
      data: mergedData
    });
  } catch (error) {
    console.error('Error migrating data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}