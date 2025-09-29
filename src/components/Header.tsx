import React from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { NavigationTab } from '@/types';
import { AnimatedHeadline } from './AnimatedHeadline';
import Image from 'next/image';
import { Home } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { data: session } = useSession();

  const allTabs: { id: NavigationTab; label: string; requiresAuth?: boolean }[] = [
    { id: 'suggestions', label: 'Find Names' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'trending', label: 'Trending' },
    { id: 'favorites', label: 'Favorites', requiresAuth: true },
    { id: 'history', label: 'History', requiresAuth: true },
    { id: 'astrology', label: 'Astrology', requiresAuth: true },
    { id: 'settings', label: 'Settings', requiresAuth: true }
  ];
  
  // Filter tabs based on authentication status
  const tabs = allTabs.filter(tab => !tab.requiresAuth || session);

  const handleHomeClick = () => {
    // Navigate to homepage by changing to the default tab (suggestions)
    onTabChange('suggestions');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row with logo, animated headline, and user info */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Baby Names"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          
          {/* Animated headline in center */}
          <div className="hidden lg:flex items-center flex-1 justify-center px-4">
            <AnimatedHeadline />
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
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
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  Sign in to save your favorites
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signIn("google")}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation tabs for desktop */}
        <div className="hidden md:block border-t border-gray-200">
          <nav className="flex items-center space-x-6 overflow-x-auto">
            {/* Home icon */}
            <button
              onClick={handleHomeClick}
              className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 transition-colors duration-200"
              title="Go to Homepage"
            >
              <Home className="h-5 w-5 text-gray-500 hover:text-blue-600" />
            </button>
            
            {/* Navigation tabs */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
