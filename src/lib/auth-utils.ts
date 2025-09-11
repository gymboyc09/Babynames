import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

export async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  
  if (!session || !(session as { user?: { id: string } }).user?.id) {
    return null;
  }
  
  return (session as { user: { id: string } }).user.id;
}
