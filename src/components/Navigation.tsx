'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Search, Star, Heart, History, Settings } from 'lucide-react';

export type NavigationTab = 'calculator' | 'suggestions' | 'astrology' | 'favorites' | 'history' | 'settings';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'calculator' as NavigationTab,
      label: 'Calculator',
      icon: Calculator,
      description: 'Analyze names with numerology'
    },
    {
      id: 'suggestions' as NavigationTab,
      label: 'Find Names',
      icon: Search,
      description: 'Discover perfect names'
    },
    {
      id: 'astrology' as NavigationTab,
      label: 'Astrology',
      icon: Star,
      description: 'Astrological insights'
    },
    {
      id: 'favorites' as NavigationTab,
      label: 'Favorites',
      icon: Heart,
      description: 'Your saved names'
    },
    {
      id: 'history' as NavigationTab,
      label: 'History',
      icon: History,
      description: 'Recent calculations'
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
      description: 'Preferences & options'
    }
  ];

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? 'primary' : 'ghost'}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            );
          })}
        </div>
        
        {/* Active tab description */}
        <div className="mt-3 text-sm text-gray-600">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </div>
      </div>
    </Card>
  );
};
