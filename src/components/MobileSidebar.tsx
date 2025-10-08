import React from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { NavigationTab } from '@/types';
import { Button } from './ui/button';
import { X, Menu, Home } from 'lucide-react';
import Image from 'next/image';

interface MobileSidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileSidebar({ activeTab, onTabChange, isOpen, onToggle }: MobileSidebarProps) {
  const { data: session } = useSession();
  
  const allTabs: { id: NavigationTab; label: string; icon: string; requiresAuth?: boolean }[] = [
    { id: 'suggestions', label: 'Find Names', icon: '🔍' },
    { id: 'calculator', label: 'Calculator', icon: '🧮' },
    { id: 'trending', label: 'Trending', icon: '📈' },
    { id: 'blog', label: 'Blogs', icon: '📝' },
    { id: 'favorites', label: 'Favorites', icon: '❤️', requiresAuth: true },
    { id: 'history', label: 'History', icon: '📚', requiresAuth: true },
    { id: 'astrology', label: 'Astrology', icon: '⭐', requiresAuth: true },
    { id: 'settings', label: 'Settings', icon: '⚙️', requiresAuth: true }
  ];
  
  // Filter tabs based on authentication status
  const tabs = allTabs.filter(tab => !tab.requiresAuth || session);

  const handleTabClick = (tab: NavigationTab) => {
    if (tab === 'trending') {
      window.location.href = '/trending';
    } else if (tab === 'blog') {
      window.location.href = '/blog';
    } else {
      onTabChange(tab);
    }
    onToggle(); // Close sidebar after selection
  };

  const handleHomeClick = () => {
    onTabChange('suggestions');
    onToggle(); // Close sidebar after selection
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Sidebar overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Image
              src="/logo.png"
              alt="Baby Names"
              width={100}
              height={32}
              className="h-6 w-auto"
            />
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* User info section */}
          {session ? (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="w-full mt-3"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Sign in to save your favorites
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signIn("google")}
                  className="w-full"
                >
                  Sign In with Google
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {/* Home button */}
              <button
                onClick={handleHomeClick}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
              >
                <Home className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Home</span>
              </button>
              
              {/* Navigation tabs */}
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Baby Names App v1.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
