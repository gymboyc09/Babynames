import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { NameAnalysis } from '@/types';
import { useSession } from 'next-auth/react';

export function FavoritesList() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<NameAnalysis[]>([]);

  // Load favorites from database
  React.useEffect(() => {
    const loadFavorites = async () => {
      if (session) {
        try {
          const response = await fetch('/api/user/data');
          if (response.ok) {
            const userData = await response.json();
            setFavorites(userData.favoriteNames || []);
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      }
    };
    loadFavorites();
  }, [session]);

  const handleRemoveFavorite = async (id: string) => {
    if (session) {
      try {
        const response = await fetch('/api/user/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nameId: id })
        });
        if (response.ok) {
          setFavorites(prev => prev.filter(fav => fav.id !== id));
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    }
  };

  const handleAnalyzeName = (name: string) => {
    // TODO: Navigate to analysis or show analysis
    console.log('Analyzing name:', name);
  };

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            Please sign in to view your favorite names
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Favorite Names ({favorites.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No favorite names yet. Start analyzing names to add them to your favorites!
          </p>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {favorite.name}
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Pythagorean:</span> {favorite.numerology.pythagorean.reducedValue}
                      </div>
                      <div>
                        <span className="font-medium">Chaldean:</span> {favorite.numerology.chaldean.reducedValue}
                      </div>
                      <div>
                        <span className="font-medium">Syllables:</span> {favorite.phonology.syllables}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Meaning:</span> {favorite.numerology.pythagorean.meaning}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnalyzeName(favorite.name)}
                    >
                      Analyze
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFavorite(favorite.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
