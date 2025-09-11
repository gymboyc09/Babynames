'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import AuthButton from '@/components/AuthButton';
import { Moon, Sun, Heart, History } from 'lucide-react';

interface HeaderProps {
  onNavigateToFavorites?: () => void;
  onNavigateToHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToFavorites, onNavigateToHistory }) => {
  const { isDarkMode, toggleDarkMode, favoriteNames, recentCalculations } = useAppStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Baby Names
            </h1>
            <span className="ml-2 text-sm text-gray-500">by Numerology</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Calculator
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Find Names
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Astrology
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Favorites indicator */}
            {favoriteNames.length > 0 && (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={onNavigateToFavorites}
                  title="View Favorites"
                >
                  <Heart className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoriteNames.length}
                  </span>
                </Button>
              </div>
            )}

            {/* Recent calculations indicator */}
            {recentCalculations.length > 0 && (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={onNavigateToHistory}
                  title="View Recent Calculations"
                >
                  <History className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {recentCalculations.length}
                  </span>
                </Button>
              </div>
            )}

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Authentication */}
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};
