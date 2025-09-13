import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { NameAnalysis } from '@/types';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';

interface RecentCalculationsProps {
  onNavigateToCalculator?: (name: string) => void;
}

export function RecentCalculations({ onNavigateToCalculator }: RecentCalculationsProps) {
  const { data: session } = useSession();
  const [recentCalculations, setRecentCalculations] = useState<NameAnalysis[]>([]);

  // Load recent calculations from database
  React.useEffect(() => {
    const loadRecentCalculations = async () => {
      if (session) {
        try {
          const response = await fetch('/api/user/data');
          if (response.ok) {
            const userData = await response.json();
            const sortedCalculations = (userData.recentCalculations || []).sort((a: any, b: any) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setRecentCalculations(sortedCalculations);
          }
        } catch (error) {
          console.error('Error loading recent calculations:', error);
        }
      }
    };
    loadRecentCalculations();
  }, [session]);

  const handleAnalyzeName = (name: string) => {
    // Find the calculation for this name
    const calculation = recentCalculations.find(calc => calc.name === name);
    if (calculation) {
      // Navigate to calculator tab and set the name
      onNavigateToCalculator?.(calculation.name);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    if (!session) return;
    
    const calculation = recentCalculations.find(calc => calc.id === id);
    if (!calculation) return;
    
    try {
      if (calculation.isFavorite) {
        // Remove from favorites
        const response = await fetch('/api/user/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nameId: id })
        });
        if (response.ok) {
          setRecentCalculations(prev => 
            prev.map(calc => 
              calc.id === id 
                ? { ...calc, isFavorite: false }
                : calc
            )
          );
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(calculation)
        });
        if (response.ok) {
          setRecentCalculations(prev => 
            prev.map(calc => 
              calc.id === id 
                ? { ...calc, isFavorite: true }
                : calc
            )
          );
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRemoveCalculation = async (id: string) => {
    if (!session) return;
    
    try {
      const response = await fetch('/api/user/recent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameId: id })
      });
      
      if (response.ok) {
        setRecentCalculations(prev => prev.filter(calc => calc.id !== id));
      }
    } catch (error) {
      console.error('Error removing calculation:', error);
    }
  };

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Calculations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            Please sign in to view your recent calculations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Calculations ({recentCalculations.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {recentCalculations.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No recent calculations yet. Start analyzing names to see them here!
          </p>
        ) : (
          <div className="space-y-4">
            {recentCalculations.map((calculation) => (
              <div key={calculation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {calculation.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(new Date(calculation.timestamp))}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Pythagorean:</span> {calculation.numerology.pythagorean.reducedValue}
                      </div>
                      <div>
                        <span className="font-medium">Chaldean:</span> {calculation.numerology.chaldean.reducedValue}
                      </div>
                      <div>
                        <span className="font-medium">Syllables:</span> {calculation.phonology.syllables}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Meaning:</span> {calculation.numerology.pythagorean.meaning}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnalyzeName(calculation.name)}
                    >
                      Analyze
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFavorite(calculation.id)}
                    >
                      {calculation.isFavorite ? '❤️' : '🤍'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCalculation(calculation.id)}
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
