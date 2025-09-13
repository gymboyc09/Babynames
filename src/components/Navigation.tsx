import React from 'react';
import { NavigationTab } from '@/types';
import { useSession } from 'next-auth/react';

export type { NavigationTab };

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { data: session } = useSession();
  
  const allTabs: { id: NavigationTab; label: string; requiresAuth?: boolean }[] = [
    { id: 'calculator', label: 'Calculator' },
    { id: 'suggestions', label: 'Find Names' },
    { id: 'favorites', label: 'Favorites', requiresAuth: true },
    { id: 'history', label: 'History', requiresAuth: true },
    { id: 'astrology', label: 'Astrology', requiresAuth: true },
    { id: 'settings', label: 'Settings', requiresAuth: true }
  ];
  
  // Filter tabs based on authentication status
  const tabs = allTabs.filter(tab => !tab.requiresAuth || session);

  return (
    <nav className="border-b border-gray-200">
      <div className="flex space-x-6 overflow-x-auto">
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
      </div>
    </nav>
  );
}
