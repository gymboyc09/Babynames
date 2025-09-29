import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { JWT } from "next-auth/jwt"
import type { NextAuthOptions } from "next-auth"
import { createUserData, getUserData, updateUserData } from "@/lib/database"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false

      const userId = user.email
      const existing = await getUserData(userId)
      const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase())
      const now = new Date()

      if (!existing) {
        await createUserData({
          id: userId,
          email: user.email,
          favoriteNames: [],
          recentCalculations: [],
          createdAt: now,
          updatedAt: now,
          // @ts-ignore augment optional flags
          isAdmin,
          // @ts-ignore
          isBlocked: false,
          // @ts-ignore
          provider: account?.provider || "google",
          // @ts-ignore
          lastLoginAt: now,
        } as any)
      } else {
        await updateUserData(userId, {
          // @ts-ignore
          isAdmin: existing?.isAdmin ?? isAdmin,
          // @ts-ignore
          isBlocked: existing?.isBlocked ?? false,
          // @ts-ignore
          provider: existing?.provider ?? account?.provider ?? "google",
          // @ts-ignore
          lastLoginAt: now,
        } as any)
      }

      // Blocked users cannot sign in
      const updated = await getUserData(userId)
      // @ts-ignore
      if (updated?.isBlocked) return false

      return true
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const userData = await getUserData(user.email)
        // @ts-ignore
        token.isAdmin = !!userData?.isAdmin
        // @ts-ignore
        token.isBlocked = !!userData?.isBlocked
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.isAdmin = !!(token as JWT & { isAdmin?: boolean }).isAdmin
      // @ts-ignore
      session.user.isBlocked = !!(token as JWT & { isBlocked?: boolean }).isBlocked
      return session
    },
  },
  debug: false,
}

export default NextAuth(authOptions)
