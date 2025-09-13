import React from 'react';
import { NavigationTab } from '@/types';
import { useSession } from 'next-auth/react';

interface MobileNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const { data: session } = useSession();
  
  const allTabs: { id: NavigationTab; label: string; icon: string; requiresAuth?: boolean }[] = [
    { id: 'calculator', label: 'Calculator', icon: '🧮' },
    { id: 'suggestions', label: 'Find', icon: '🔍' },
    { id: 'favorites', label: 'Favorites', icon: '❤️', requiresAuth: true },
    { id: 'history', label: 'History', icon: '📚', requiresAuth: true },
    { id: 'astrology', label: 'Astrology', icon: '⭐', requiresAuth: true },
    { id: 'settings', label: 'Settings', icon: '⚙️', requiresAuth: true }
  ];
  
  // Filter tabs based on authentication status
  const tabs = allTabs.filter(tab => !tab.requiresAuth || session);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className={`grid gap-1 ${tabs.length === 2 ? 'grid-cols-2' : tabs.length === 3 ? 'grid-cols-3' : tabs.length === 4 ? 'grid-cols-4' : tabs.length === 5 ? 'grid-cols-5' : 'grid-cols-6'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-1 text-xs transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-lg mb-1">{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
