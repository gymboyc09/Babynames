'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation, NavigationTab } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { NumerologyCalculator } from '@/components/NumerologyCalculator';
import { NameSuggestionEngine } from '@/components/NameSuggestionEngine';
import { FavoritesList } from '@/components/FavoritesList';
import { RecentCalculations } from '@/components/RecentCalculations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('calculator');
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onNavigateToFavorites={() => setActiveTab('favorites')}
        onNavigateToHistory={() => setActiveTab('history')}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Find the Perfect
            <span className="text-blue-600"> Baby Name</span>
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden md:block">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main Content */}
        {activeTab === 'calculator' && <NumerologyCalculator />}
        {activeTab === 'suggestions' && <NameSuggestionEngine />}
        {activeTab === 'favorites' && <FavoritesList />}
        {activeTab === 'history' && <RecentCalculations />}
        {activeTab === 'astrology' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Astrology Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Astrology features are coming soon! This will include birth chart analysis, 
                astrological compatibility with names, and personalized recommendations 
                based on planetary positions.
              </p>
            </CardContent>
          </Card>
        )}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Settings and preferences will be available here. This will include 
                theme customization, language selection, and personal preferences.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
