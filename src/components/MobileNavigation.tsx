'use client';

import React from 'react';
import { NavigationTab } from '@/components/Navigation';
import { Calculator, Search, Star, Heart, History, Settings } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'calculator' as NavigationTab,
      label: 'Calculator',
      icon: Calculator
    },
    {
      id: 'suggestions' as NavigationTab,
      label: 'Find Names',
      icon: Search
    },
    {
      id: 'astrology' as NavigationTab,
      label: 'Astrology',
      icon: Star
    },
    {
      id: 'favorites' as NavigationTab,
      label: 'Favorites',
      icon: Heart
    },
    {
      id: 'history' as NavigationTab,
      label: 'History',
      icon: History
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-xs truncate ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
