import React, { useState } from 'react';
import { calculateNumerology } from '@/lib/numerology';
import { analyzePhonology } from '@/lib/phonology';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { NameAnalysis } from '@/types';
import { useSession } from 'next-auth/react';

export function NumerologyCalculator() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<NameAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data: session } = useSession();

  const handleAnalyze = async () => {
    if (!name.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const numerology = calculateNumerology(name);
      const phonology = analyzePhonology(name);
      
      const analysis: NameAnalysis = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        numerology,
        phonology,
        timestamp: new Date(),
        isFavorite: false
      };
      
      setResult(analysis);
      
      // Save to recent calculations if user is logged in
      if (session) {
        // TODO: Save to database
        console.log('Saving analysis to database:', analysis);
      }
    } catch (error) {
      console.error('Error analyzing name:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!result) return;
    
    setResult({
      ...result,
      isFavorite: !result.isFavorite
    });
    
    // TODO: Update in database if user is logged in
    if (session) {
      console.log('Toggling favorite:', result.name);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Numerology Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-2">
                Enter a name to analyze
              </label>
              <Input
                id="name-input"
                value={name}
                onChange={setName}
                placeholder="Type a name to analyze..."
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={!name.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Name'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Analysis for "{result.name}"</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFavorite}
                >
                  {result.isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Numerology</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Total Value:</span> {result.numerology.totalValue}</p>
                    <p><span className="font-medium">Reduced Value:</span> {result.numerology.reducedValue}</p>
                    <p><span className="font-medium">Meaning:</span> {result.numerology.meaning}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Characteristics:</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.numerology.characteristics.map((char, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Compatible Numbers:</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.numerology.compatibility.map((num, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {result.numerology.warnings.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Warnings:</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.numerology.warnings.map((warning, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                            {warning}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Phonology</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Syllables:</span> {result.phonology.syllables}</p>
                    <p><span className="font-medium">Vowels:</span> {result.phonology.vowelCount}</p>
                    <p><span className="font-medium">Consonants:</span> {result.phonology.consonantCount}</p>
                    <p><span className="font-medium">Analysis:</span> {result.phonology.phoneticAnalysis}</p>
                    <p><span className="font-medium">Pronunciation:</span> {result.phonology.pronunciation}</p>
                  </div>
                  
                  {result.phonology.culturalNotes.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Cultural Notes:</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.phonology.culturalNotes.map((note, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
