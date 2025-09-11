/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';

const client = process.env.MONGODB_URI ? new MongoClient(process.env.MONGODB_URI) : null;
const clientPromise = client ? client.connect() : null;

export const authOptions = {
  adapter: clientPromise ? MongoDBAdapter(clientPromise as Promise<MongoClient>) : undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'database' as const,
  },
};