import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

interface HeaderProps {
  onNavigateToFavorites: () => void;
  onNavigateToHistory: () => void;
}

export function Header({ onNavigateToFavorites, onNavigateToHistory }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Baby Names
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToFavorites}
                >
                  Favorites
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToHistory}
                >
                  History
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    {session.user?.name}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Sign in to save your favorites
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
