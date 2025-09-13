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
    
    // Add to favorites
    await db.collection('userData').updateOne(
      { id: userId },
      { 
        $push: { favoriteNames: nameAnalysis },
        $set: { updatedAt: new Date() }
      }
    );
    
    // Mark as favorite in recent calculations
    await db.collection('userData').updateOne(
      { id: userId, 'recentCalculations.id': nameAnalysis.id },
      { 
        $set: { 
          'recentCalculations.$.isFavorite': true,
          updatedAt: new Date() 
        }
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error adding favorite name:', error);
    return false;
  }
}

export async function removeFavoriteName(userId: string, nameId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    
    // Remove from favorites
    await db.collection('userData').updateOne(
      { id: userId },
      { 
        $pull: { favoriteNames: { id: nameId } },
        $set: { updatedAt: new Date() }
      }
    );
    
    // Mark as not favorite in recent calculations
    await db.collection('userData').updateOne(
      { id: userId, 'recentCalculations.id': nameId },
      { 
        $set: { 
          'recentCalculations.$.isFavorite': false,
          updatedAt: new Date() 
        }
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error removing favorite name:', error);
    return false;
  }
}

export async function addRecentCalculation(userId: string, nameAnalysis: NameAnalysis): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    
    // Check if name already exists in recent calculations
    const existingUser = await db.collection('userData').findOne({
      id: userId,
      'recentCalculations.name': nameAnalysis.name
    });
    
    if (existingUser) {
      // Update timestamp for existing name
      await db.collection('userData').updateOne(
        { id: userId, 'recentCalculations.name': nameAnalysis.name },
        { 
          $set: { 
            'recentCalculations.$.timestamp': nameAnalysis.timestamp,
            'recentCalculations.$.numerology': nameAnalysis.numerology,
            'recentCalculations.$.phonology': nameAnalysis.phonology,
            updatedAt: new Date() 
          }
        }
      );
    } else {
      // Add new calculation
      await db.collection('userData').updateOne(
        { id: userId },
        { 
          $push: { recentCalculations: { $each: [nameAnalysis], $slice: -50 } },
          $set: { updatedAt: new Date() }
        }
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
