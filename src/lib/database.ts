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

export interface DbNameItem { name: string; gender?: 'Boy' | 'Girl' | 'Unisex' | string }

export function predictGenderFromName(name: string): 'Boy' | 'Girl' | 'Unisex' {
  if (!name) return 'Unisex';
  const n = name.toLowerCase().trim();

  // Quick overrides by strong prefixes
  if (n.startsWith('srinivas')) return 'Boy';

  // Common female endings/patterns
  const femaleSuffixes = [
    'a','aa','i','ii','ee','y','iya','ya','ika','ita','isha','eesha','eisha','ini','ani','sri','shree','pri','preet','reet','latha','lata','kshi','akshi','aksha','akshita','shika','nika','nita','nitha','rita','vya','aya','ya'
  ];
  
  // Common male endings/patterns
  const maleSuffixes = [
    'n','an','tan','han','ran','van','yan','vin','esh','eash','eesh','it','ith','rit','raj','tej','ansh','aansh','yansh','yanshu','vansh','tirth','arth','veer','vir','rajit','ket','ketu','dev','ishan','kumar','karthik','kartik','nath','jeet','meet','preet','pran','laksh','lakshit','lakshan'
  ];

  // Strong gender-specific prefixes
  const femalePrefixes = ['sri ', 'shri ', 'kumari', 'kanya', 'lady'];
  const malePrefixes = ['mr', 'shri ', 'sri ', 'kunal', 'raj', 'sriniv', 'srinivas'];

  if (femalePrefixes.some(p => n.startsWith(p))) return 'Girl';
  if (malePrefixes.some(p => n.startsWith(p))) return 'Boy';

  if (femaleSuffixes.some(s => n.endsWith(s))) return 'Girl';
  if (maleSuffixes.some(s => n.endsWith(s))) return 'Boy';

  // If contains certain tokens
  const femaleTokens = ['kumari','rani','devi','laxmi','lakshmi','priya','beti'];
  const maleTokens = ['kumar','raj','veer','singh','dev','nath'];
  if (femaleTokens.some(t => n.includes(t))) return 'Girl';
  if (maleTokens.some(t => n.includes(t))) return 'Boy';

  return 'Unisex';
}

export async function setNameGender(name: string, gender: 'Boy' | 'Girl' | 'Unisex'): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const res = await db.collection('names').updateOne(
      { name },
      { $set: { gender, updatedAt: new Date() } }
    );
    return res.matchedCount > 0;
  } catch (error) {
    console.error('Error setting name gender:', error);
    return false;
  }
}

async function applyGenderOverrides(): Promise<number> {
  try {
    const { db } = await connectToDatabase();
    const rules: { regex: RegExp; gender: 'Boy' | 'Girl' | 'Unisex' }[] = [
      { regex: /^srinivas/i, gender: 'Boy' },
      { regex: /^srinu/i, gender: 'Boy' },
    ];
    let modified = 0;
    for (const rule of rules) {
      const res = await db.collection('names').updateMany(
        { name: { $regex: rule.regex } },
        { $set: { gender: rule.gender, updatedAt: new Date() } }
      );
      modified += res.modifiedCount ?? 0;
    }
    return modified;
  } catch (e) {
    console.error('applyGenderOverrides error:', e);
    return 0;
  }
}

export async function backfillNameGenders(batchSize: number = 1000, force: boolean = false): Promise<{ updated: number; remaining: number; overridesApplied?: number }>{
  try {
    const { db } = await connectToDatabase();

    let overridesApplied = 0;
    if (force) {
      // Apply known overrides first
      overridesApplied = await applyGenderOverrides();
    }

    // Select documents to process in this batch
    const query = force
      ? {}
      : { $or: [ { gender: { $exists: false } }, { gender: null }, { gender: '' } ] };

    const docs = await db.collection('names')
      .find(query)
      .project({ name: 1, gender: 1 })
      .limit(batchSize)
      .toArray();

    if (docs.length === 0) {
      const remainingQuery = force ? {} : { $or: [ { gender: { $exists: false } }, { gender: null }, { gender: '' } ] };
      const remaining = await db.collection('names').countDocuments(remainingQuery);
      return { updated: 0, remaining, overridesApplied };
    }

    const ops = docs.map((d: any) => {
      const predicted = predictGenderFromName(d.name);
      const shouldUpdate = force ? d.gender !== predicted : !d.gender;
      if (!shouldUpdate) return null;
      return {
        updateOne: {
          filter: { _id: d._id },
          update: { $set: { gender: predicted, updatedAt: new Date() } }
        }
      }
    }).filter(Boolean) as any[];

    const res = ops.length > 0 ? await db.collection('names').bulkWrite(ops) : { modifiedCount: 0 } as any;

    const remainingQuery = force ? {} : { $or: [ { gender: { $exists: false } }, { gender: null }, { gender: '' } ] };
    const remaining = await db.collection('names').countDocuments(remainingQuery);
    return { updated: res.modifiedCount ?? 0, remaining, overridesApplied };
  } catch (error) {
    console.error('Error backfilling genders:', error);
    return { updated: 0, remaining: 0 };
  }
}

// Names collection functions
export async function searchNames(searchTerm: string, limit: number = 10): Promise<DbNameItem[]> {
  try {
    const { db } = await connectToDatabase();
    const names = await db.collection('names')
      .find({ 
        name: { 
          $regex: `^${searchTerm}`, 
          $options: 'i' 
        } 
      })
      .project({ name: 1, gender: 1, _id: 0 })
      .limit(limit)
      .toArray();
    return names as DbNameItem[];
  } catch (error) {
    console.error('Error searching names:', error);
    return [];
  }
}

export async function getAllNames(limit: number = 10): Promise<DbNameItem[]> {
  try {
    const { db } = await connectToDatabase();
    const names = await db.collection('names')
      .find({})
      .project({ name: 1, gender: 1, _id: 0 })
      .limit(limit)
      .toArray();
    return names as DbNameItem[];
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
    // Include all users who have logged in at least once (have an email) and de-duplicate by email
    const matchStage: any = { $match: { email: { $exists: true } } };
    const sortStage: any = { $sort: { lastLoginAt: -1 } };
    const groupStage: any = { $group: { _id: '$email', doc: { $first: '$$ROOT' } } };
    const projectStage: any = { $project: { _id: 0, doc: 1 } };

    const pipeline = [matchStage, sortStage, groupStage, projectStage, { $skip: skip }, { $limit: limit }];
    const groups = await db.collection('userData').aggregate(pipeline).toArray();

    // Total distinct emails
    const totalAgg = await db.collection('userData').aggregate([matchStage, groupStage, { $count: 'total' }]).toArray();
    const total = totalAgg.length > 0 ? totalAgg[0].total : 0;

    const users: AdminUser[] = groups.map((g: any) => {
      const d = g.doc;
      return {
        id: d.id,
        email: d.email,
        isAdmin: !!d.isAdmin,
        isBlocked: !!d.isBlocked,
        provider: d.provider,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        lastLoginAt: d.lastLoginAt,
      } as AdminUser;
    });
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

// Trending names
export type TrendingItem = { name: string; gender: 'Boy' | 'Girl' | 'Unisex' | string };

export async function getTrendingNames(): Promise<TrendingItem[]> {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection('settings').findOne({ key: 'trending_names' });
    const raw = doc?.names;

    if (Array.isArray(raw)) {
      // Backward compatibility: strings => objects
      if (raw.length > 0 && typeof raw[0] === 'string') {
        return (raw as string[]).map((n: string) => ({ name: (n || '').toString().trim(), gender: 'Unisex' }));
      }
      // Already objects
      return (raw as any[])
        .map((it) => ({ name: (it?.name || '').toString().trim(), gender: (it?.gender || 'Unisex').toString() }))
        .filter((it) => it.name);
    }
    return [];
  } catch (error) {
    console.error('Error getting trending names:', error);
    return [];
  }
}

export async function setTrendingNames(items: TrendingItem[]): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const normalized = Array.from(
      new Map(
        (items || [])
          .map((it) => ({ name: (it?.name || '').toString().trim(), gender: (it?.gender || 'Unisex').toString() }))
          .filter((it) => !!it.name)
          .map((it) => [it.name.toLowerCase(), it])
      ).values()
    );

    await db.collection('settings').updateOne(
      { key: 'trending_names' },
      { $set: { names: normalized, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('Error setting trending names:', error);
    return false;
  }
}