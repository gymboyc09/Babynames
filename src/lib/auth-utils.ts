import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'

export async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions)
  return (session?.user as { id?: string })?.id || null
}