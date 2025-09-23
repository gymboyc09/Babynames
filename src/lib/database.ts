import { MongoClient, Db } from 'mongodb';
import { NameAnalysis, UserData } from '@/types';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }

  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db('babynames');
    console.log('Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const { db } = await connectToDatabase();
    const userData = await db.collection('userData').findOne({ id: userId });
    return userData as UserData | null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function createUserData(userData: UserData): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    await db.collection('userData').insertOne(userData);
    return true;
  } catch (error) {
    console.error('Error creating user data:', error);
    return false;
  }
}

export async function updateUserData(userId: string, updates: Partial<UserData>): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    await db.collection('userData').updateOne(
      { id: userId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
}

export async function addFavoriteName(userId: string, nameAnalysis: NameAnalysis): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    
    // Normalize the name for case-insensitive comparison
    const normalizedName = nameAnalysis.name.toLowerCase().trim();
    
    // First, get the user's current data
    const userData = await db.collection('userData').findOne({ id: userId });
    
    if (userData && userData.favoriteNames) {
      // Check if favorite already exists (case-insensitive)
      const existingFavoriteIndex = userData.favoriteNames.findIndex(
        (fav: any) => fav.name.toLowerCase().trim() === normalizedName
      );
      
      if (existingFavoriteIndex === -1) {
        // Add new favorite
        const newFavorites = [...userData.favoriteNames, nameAnalysis];
        
        await db.collection('userData').updateOne(
          { id: userId },
          { 
            $set: { 
              favoriteNames: newFavorites,
              updatedAt: new Date() 
            }
          }
        );
      }
    } else {
      // User doesn't exist or has no favorites, create new
      await db.collection('userData').updateOne(
        { id: userId },
        { 
          $set: { 
            favoriteNames: [nameAnalysis],
            updatedAt: new Date() 
          }
        },
        { upsert: true }
      );
    }
    
    // Mark as favorite in recent calculations (case-insensitive)
    if (userData && userData.recentCalculations) {
      const recentIndex = userData.recentCalculations.findIndex(
        (calc: any) => calc.name.toLowerCase().trim() === normalizedName
      );
      
      if (recentIndex !== -1) {
        const updatedCalculations = [...userData.recentCalculations];
        updatedCalculations[recentIndex] = {
          ...updatedCalculations[recentIndex],
          isFavorite: true
        };
        
        await db.collection('userData').updateOne(
          { id: userId },
          { 
            $set: { 
              recentCalculations: updatedCalculations,
              updatedAt: new Date() 
            }
          }
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error adding favorite name:', error);
    return false;
  }
}

export async function removeFavoriteName(userId: string, nameId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    
    // First, get the user's current data to find the name
    const userData = await db.collection('userData').findOne({ id: userId });
    
    if (userData && userData.favoriteNames) {
      // Find the favorite to get the name for case-insensitive matching
      const favoriteToRemove = userData.favoriteNames.find((fav: any) => fav.id === nameId);
      
      if (favoriteToRemove) {
        const normalizedName = favoriteToRemove.name.toLowerCase().trim();
        
        // Remove from favorites
        const updatedFavorites = userData.favoriteNames.filter((fav: any) => fav.id !== nameId);
        
        await db.collection('userData').updateOne(
          { id: userId },
          { 
            $set: { 
              favoriteNames: updatedFavorites,
              updatedAt: new Date() 
            }
          }
        );
        
        // Mark as not favorite in recent calculations (case-insensitive)
        if (userData.recentCalculations) {
          const recentIndex = userData.recentCalculations.findIndex(
            (calc: any) => calc.name.toLowerCase().trim() === normalizedName
          );
          
          if (recentIndex !== -1) {
            const updatedCalculations = [...userData.recentCalculations];
            updatedCalculations[recentIndex] = {
              ...updatedCalculations[recentIndex],
              isFavorite: false
            };
            
            await db.collection('userData').updateOne(
              { id: userId },
              { 
                $set: { 
                  recentCalculations: updatedCalculations,
                  updatedAt: new Date() 
                }
              }
            );
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error removing favorite name:', error);
    return false;
  }
}

export async function addRecentCalculation(userId: string, nameAnalysis: NameAnalysis): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    
    // Normalize the name for case-insensitive comparison
    const normalizedName = nameAnalysis.name.toLowerCase().trim();
    
    // First, get the user's current data
    const userData = await db.collection('userData').findOne({ id: userId });
    
    if (userData && userData.recentCalculations) {
      // Check if a calculation with the same normalized name exists
      const existingIndex = userData.recentCalculations.findIndex(
        (calc: any) => calc.name.toLowerCase().trim() === normalizedName
      );
      
      if (existingIndex !== -1) {
        // Update existing calculation
        const updatedCalculations = [...userData.recentCalculations];
        updatedCalculations[existingIndex] = {
          ...updatedCalculations[existingIndex],
          timestamp: nameAnalysis.timestamp,
          numerology: nameAnalysis.numerology,
          phonology: nameAnalysis.phonology
        };
        
        await db.collection('userData').updateOne(
          { id: userId },
          { 
            $set: { 
              recentCalculations: updatedCalculations,
              updatedAt: new Date() 
            }
          }
        );
      } else {
        // Add new calculation
        const newCalculations = [...userData.recentCalculations, nameAnalysis];
        // Keep only the last 50 calculations
        const limitedCalculations = newCalculations.slice(-50);
        
        await db.collection('userData').updateOne(
          { id: userId },
          { 
            $set: { 
              recentCalculations: limitedCalculations,
              updatedAt: new Date() 
            }
          }
        );
      }
    } else {
      // User doesn't exist or has no calculations, create new
      await db.collection('userData').updateOne(
        { id: userId },
        { 
          $set: { 
            recentCalculations: [nameAnalysis],
            updatedAt: new Date() 
          }
        },
        { upsert: true }
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error adding recent calculation:', error);
    return false;
  }
}

export async function removeRecentCalculation(userId: string, nameId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    await db.collection('userData').updateOne(
      { id: userId },
      { 
        $pull: { recentCalculations: { id: nameId } },
        $set: { updatedAt: new Date() }
      }
    );
    return true;
  } catch (error) {
    console.error('Error removing recent calculation:', error);
    return false;
  }
}

// Names collection functions
export async function searchNames(searchTerm: string, limit: number = 10): Promise<string[]> {
  try {
    const { db } = await connectToDatabase();
    const names = await db.collection('names')
      .find({ 
        name: { 
          $regex: searchTerm, 
          $options: 'i' 
        } 
      })
      .limit(limit)
      .toArray();
    
    return names.map(doc => doc.name);
  } catch (error) {
    console.error('Error searching names:', error);
    return [];
  }
}

export async function getAllNames(limit: number = 10): Promise<string[]> {
  try {
    const { db } = await connectToDatabase();
    const names = await db.collection('names')
      .find({})
      .limit(limit)
      .toArray();
    
    return names.map(doc => doc.name);
  } catch (error) {
    console.error('Error getting all names:', error);
    return [];
  }
}