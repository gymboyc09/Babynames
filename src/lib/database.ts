import { MongoClient, Db } from 'mongodb';
import { NameAnalysis, UserData } from '@/types';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

  try {
    client = new MongoClient(mongoUri);
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
          $regex: `^${searchTerm}`, 
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

export async function getNamesForSitemap(): Promise<string[]> {
  try {
    const { db } = await connectToDatabase();
    const names = await db.collection('names')
      .find({})
      .sort({ name: 1 }) // Sort alphabetically for consistent sitemap
      .limit(50000) // Limit for sitemap size
      .toArray();
    
    return names.map(doc => doc.name);
  } catch (error) {
    console.error('Error getting names for sitemap:', error);
    return [];
  }
}

export async function getTotalNamesCount(): Promise<number> {
  try {
    const { db } = await connectToDatabase();
    const count = await db.collection('names').countDocuments();
    return count;
  } catch (error) {
    console.error('Error getting names count:', error);
    return 0;
  }
}

// Admin: Names management
export async function getNamesPage(params: { search?: string; mode?: 'starts' | 'ends' | 'contains'; skip?: number; limit?: number }): Promise<{ names: string[]; total: number; }>{
  try {
    const { db } = await connectToDatabase();
    const { search = '', mode = 'contains', skip = 0, limit = 50 } = params || {} as any;
    const filter: any = {};
    if (search && search.trim()) {
      let pattern = `${search.trim()}`;
      if (mode === 'starts') pattern = `^${search.trim()}`;
      if (mode === 'ends') pattern = `${search.trim()}$`;
      filter.name = { $regex: pattern, $options: 'i' };
    }
    const cursor = db.collection('names').find(filter).skip(skip).limit(limit);
    const [docs, total] = await Promise.all([
      cursor.toArray(),
      db.collection('names').countDocuments(filter),
    ]);
    return { names: docs.map((d: any) => d.name), total };
  } catch (error) {
    console.error('Error paging names:', error);
    return { names: [], total: 0 };
  }
}

export async function addNamesBulk(names: string[]): Promise<{ inserted: number; skipped: number; }>{
  if (!names || names.length === 0) return { inserted: 0, skipped: 0 };
  try {
    const { db } = await connectToDatabase();
    const normalized = Array.from(new Set(names
      .map(n => (n || '').toString().trim())
      .filter(n => n.length > 0)));
    if (normalized.length === 0) return { inserted: 0, skipped: 0 };
    // Avoid duplicates by checking existing
    const existingDocs = await db.collection('names').find({ name: { $in: normalized } }).project({ name: 1 }).toArray();
    const existing = new Set(existingDocs.map((d: any) => d.name));
    const toInsert = normalized.filter(n => !existing.has(n)).map(n => ({ name: n }));
    if (toInsert.length > 0) {
      await db.collection('names').insertMany(toInsert);
    }
    return { inserted: toInsert.length, skipped: normalized.length - toInsert.length };
  } catch (error) {
    console.error('Error adding names bulk:', error);
    return { inserted: 0, skipped: 0 };
  }
}

export async function updateNameValue(oldName: string, newName: string): Promise<boolean>{
  try {
    const { db } = await connectToDatabase();
    const res = await db.collection('names').updateOne({ name: oldName }, { $set: { name: newName } });
    return res.matchedCount > 0;
  } catch (error) {
    console.error('Error updating name:', error);
    return false;
  }
}

export async function deleteNamesBulk(names: string[]): Promise<number>{
  if (!names || names.length === 0) return 0;
  try {
    const { db } = await connectToDatabase();
    const res = await db.collection('names').deleteMany({ name: { $in: names } });
    return res.deletedCount ?? 0;
  } catch (error) {
    console.error('Error deleting names:', error);
    return 0;
  }
}

// Admin: Users management
export interface AdminUser {
  id: string;
  email: string;
  isAdmin?: boolean;
  isBlocked?: boolean;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

export async function listGoogleUsers(params: { skip?: number; limit?: number; }): Promise<{ users: AdminUser[]; total: number; }>{
  try {
    const { db } = await connectToDatabase();
    const { skip = 0, limit = 50 } = params || {} as any;
    // Include all users who have logged in at least once (have an email)
    const filter: any = { email: { $exists: true } };
    const cursor = db.collection('userData').find(filter).sort({ lastLoginAt: -1 }).skip(skip).limit(limit);
    const [docs, total] = await Promise.all([
      cursor.toArray(),
      db.collection('userData').countDocuments(filter),
    ]);
    const users: AdminUser[] = docs.map((d: any) => ({
      id: d.id,
      email: d.email,
      isAdmin: !!d.isAdmin,
      isBlocked: !!d.isBlocked,
      provider: d.provider,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      lastLoginAt: d.lastLoginAt,
    }));
    return { users, total };
  } catch (error) {
    console.error('Error listing users:', error);
    return { users: [], total: 0 };
  }
}

export async function setUsersBlocked(ids: string[], blocked: boolean): Promise<number>{
  if (!ids || ids.length === 0) return 0;
  try {
    const { db } = await connectToDatabase();
    const res = await db.collection('userData').updateMany(
      { id: { $in: ids } },
      { $set: { isBlocked: blocked, updatedAt: new Date() } }
    );
    return res.modifiedCount ?? 0;
  } catch (error) {
    console.error('Error blocking/unblocking users:', error);
    return 0;
  }
}

export async function deleteUsers(ids: string[]): Promise<number>{
  if (!ids || ids.length === 0) return 0;
  try {
    const { db } = await connectToDatabase();
    const res = await db.collection('userData').deleteMany({ id: { $in: ids } });
    return res.deletedCount ?? 0;
  } catch (error) {
    console.error('Error deleting users:', error);
    return 0;
  }
}