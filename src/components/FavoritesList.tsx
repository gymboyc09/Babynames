'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { calculateNumerology } from '@/lib/numerology';
import { analyzePhonology } from '@/lib/phonology';
import { Heart, Trash2, Star, Volume2, Share2 } from 'lucide-react';

export const FavoritesList: React.FC = () => {
  const { favoriteNames, removeFromFavorites, addToRecentCalculations } = useAppStore();

  const handleRemoveFavorite = (name: string) => {
    removeFromFavorites(name);
  };

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
    
    addToRecentCalculations(analysis);
  };

  if (favoriteNames.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No favorite names yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start exploring names and add them to your favorites to see them here.
          </p>
          <Button
            onClick={() => {
              // This would navigate to the suggestions tab
              console.log('Navigate to suggestions');
            }}
          >
            Find Names
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Your Favorite Names ({favoriteNames.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteNames.map((name) => {
              const numerology = calculateNumerology(name);
              const phonology = analyzePhonology(name);
              
              return (
                <div
                  key={name}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAnalyzeName(name)}
                >
                  <Card
                    variant="outlined"
                  >
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      {/* Name */}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {name}
                      </h3>
                      
                      {/* Numerology */}
                      <div className="flex justify-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          C: {numerology.chaldean.value}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          P: {numerology.pythagorean.value}
                        </span>
                      </div>
                      
                      {/* Phonology */}
                      <div className="text-xs text-gray-500">
                        {phonology.syllables} syllable{phonology.syllables !== 1 ? 's' : ''} • {phonology.difficulty}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnalyzeName(name);
                          }}
                          className="p-1"
                          title="Analyze name"
                        >
                          <Star className="h-4 w-4 text-yellow-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Play pronunciation (placeholder)
                            console.log('Play pronunciation for:', name);
                          }}
                          className="p-1"
                          title="Play pronunciation"
                        >
                          <Volume2 className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Share name (placeholder)
                            navigator.clipboard.writeText(name);
                          }}
                          className="p-1"
                          title="Share name"
                        >
                          <Share2 className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(name);
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
