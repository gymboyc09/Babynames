import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'babynames';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// User data models
export interface UserData {
  userId: string;
  favoriteNames: string[];
  recentCalculations: unknown[];
  searchHistory: string[];
  preferences: {
    savedNames: string[];
    favoriteOrigins: string[];
    preferredDifficulty: string;
    darkMode: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserData(userId: string): Promise<UserData | null> {
  const { db } = await connectToDatabase();
  const userData = await db.collection('userData').findOne({ userId }) as UserData | null;
  return userData;
}

export async function createUserData(userId: string): Promise<UserData> {
  const { db } = await connectToDatabase();
  const userData: UserData = {
    userId,
    favoriteNames: [],
    recentCalculations: [],
    searchHistory: [],
    preferences: {
      savedNames: [],
      favoriteOrigins: [],
      preferredDifficulty: 'medium',
      darkMode: false,
      language: 'en'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await db.collection('userData').insertOne(userData);
  return userData;
}

export async function updateUserData(userId: string, updates: Partial<UserData>): Promise<UserData | null> {
  const { db } = await connectToDatabase();
  const result = await db.collection('userData').findOneAndUpdate(
    { userId },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  ) as UserData | null;
  return result;
}

export async function deleteUserData(userId: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  const result = await db.collection('userData').deleteOne({ userId });
  return result.deletedCount > 0;
}

// Global type declaration for cached connection
declare global {
  var mongo: {
    conn: { client: MongoClient; db: Db } | null;
    promise: Promise<{ client: MongoClient; db: Db }> | null;
  };
}
