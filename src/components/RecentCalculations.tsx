import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { NameAnalysis } from '@/types';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';

export function RecentCalculations() {
  const { data: session } = useSession();
  const [recentCalculations, setRecentCalculations] = useState<NameAnalysis[]>([]);

  // TODO: Load recent calculations from database
  React.useEffect(() => {
    if (session) {
      // Load recent calculations from database
      console.log('Loading recent calculations for user:', session.user?.email);
    }
  }, [session]);

  const handleAnalyzeName = (name: string) => {
    // TODO: Navigate to analysis or show analysis
    console.log('Analyzing name:', name);
  };

  const handleToggleFavorite = (id: string) => {
    setRecentCalculations(prev => 
      prev.map(calc => 
        calc.id === id 
          ? { ...calc, isFavorite: !calc.isFavorite }
          : calc
      )
    );
    // TODO: Update in database
    if (session) {
      console.log('Toggling favorite for calculation:', id);
    }
  };

  const handleRemoveCalculation = (id: string) => {
    setRecentCalculations(prev => prev.filter(calc => calc.id !== id));
    // TODO: Remove from database
    if (session) {
      console.log('Removing calculation:', id);
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
                      {formatDate(calculation.timestamp)}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Numerology:</span> {calculation.numerology.reducedValue}
                      </div>
                      <div>
                        <span className="font-medium">Syllables:</span> {calculation.phonology.syllables}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Meaning:</span> {calculation.numerology.meaning}
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
