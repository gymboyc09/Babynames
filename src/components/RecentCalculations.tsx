'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { calculateNumerology } from '@/lib/numerology';
import { analyzePhonology } from '@/lib/phonology';
import { History, Trash2, Star, Heart } from 'lucide-react';

export const RecentCalculations: React.FC = () => {
  const { recentCalculations, clearRecentCalculations, addToFavorites, isFavorite } = useAppStore();

  const handleAnalyzeName = (name: string) => {
    const numerology = calculateNumerology(name);
    const phonology = analyzePhonology(name);
    
    const analysis = {
      name,
      numerology,
      phonology,
      cultural: {
        origin: 'Unknown',
        meaning: 'To be determined',
        popularity: 50,
        famousNamesakes: [],
        culturalSignificance: 'Analysis in progress'
      }
    };
    
    // This would typically navigate back to calculator with the analysis
    console.log('Analyze name:', name);
  };

  if (recentCalculations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recent calculations
          </h3>
          <p className="text-gray-600">
            Start analyzing names to see your recent calculations here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              Recent Calculations ({recentCalculations.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearRecentCalculations}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentCalculations.map((analysis, index) => (
              <Card
                key={`${analysis.name}-${index}`}
                variant="outlined"
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAnalyzeName(analysis.name)}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    {/* Name */}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {analysis.name}
                    </h3>
                    
                    {/* Numerology */}
                    <div className="flex justify-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        C: {analysis.numerology.chaldean.value}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        P: {analysis.numerology.pythagorean.value}
                      </span>
                    </div>
                    
                    {/* Phonology */}
                    <div className="text-xs text-gray-500">
                      {analysis.phonology.syllables} syllable{analysis.phonology.syllables !== 1 ? 's' : ''} • {analysis.phonology.difficulty}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnalyzeName(analysis.name);
                        }}
                        className="p-1"
                        title="Re-analyze name"
                      >
                        <Star className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFavorite(analysis.name)) {
                            console.log('Already in favorites');
                          } else {
                            addToFavorites(analysis.name);
                          }
                        }}
                        className="p-1"
                        title="Add to favorites"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            isFavorite(analysis.name) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
