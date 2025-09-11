'use client';

import React, { useState, useEffect } from 'react';
import { calculateNumerology, getNumerologicalMeaning } from '@/lib/numerology';
import { analyzePhonology } from '@/lib/phonology';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { formatName } from '@/lib/utils';
import { Calculator, Heart, Star, Info, Sparkles } from 'lucide-react';

export const NumerologyCalculator: React.FC = () => {
  const [name, setName] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { setCurrentAnalysis, addToRecentCalculations, addToFavorites, isFavorite } = useAppStore();

  const handleCalculate = async () => {
    if (!name.trim()) return;
    
    setIsCalculating(true);
    
    try {
      const formattedName = formatName(name);
      const numerology = calculateNumerology(formattedName);
      const phonology = analyzePhonology(formattedName, numerology.chaldean.value, numerology.pythagorean.value);
      
      const fullAnalysis = {
        name: formattedName,
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
      
      setAnalysis(fullAnalysis);
      setCurrentAnalysis(fullAnalysis);
      addToRecentCalculations(fullAnalysis);
    } catch (error) {
      console.error('Error calculating numerology:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClear = () => {
    setName('');
    setAnalysis(null);
    setCurrentAnalysis(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Numerology Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Baby Name
              </label>
              <Input
                id="name-input"
                value={name}
                onChange={setName}
                placeholder="Type a name to analyze..."
                className="text-lg"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleCalculate}
                disabled={!name.trim() || isCalculating}
                className="flex-1"
              >
                {isCalculating ? 'Calculating...' : 'Calculate'}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={!name.trim()}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysis && (
        <div className="space-y-4">
          {/* Name Display */}
          <Card variant="elevated">
            <CardContent className="text-center py-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                "{analysis.name}"
              </h2>
              <p className="text-gray-600">Numerology Analysis</p>
            </CardContent>
          </Card>

          {/* Numerology Results */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Chaldean Numerology */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Star className="h-5 w-5" />
                  Chaldean Numerology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {analysis.numerology.chaldean.value}
                    </div>
                    {analysis.numerology.chaldean.isSacredNumber && (
                      <div className="text-sm text-blue-500 font-medium">
                        Sacred Number
                      </div>
                    )}
                    {analysis.numerology.chaldean.isMasterNumber && (
                      <div className="text-sm text-purple-500 font-medium">
                        Master Number
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium mb-2">Letter Breakdown:</div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.numerology.chaldean.breakdown.map((letter: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {letter.letter}({letter.chaldeanValue})
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {getNumerologicalMeaning(analysis.numerology.chaldean.value, 'chaldean')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pythagorean Numerology */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Calculator className="h-5 w-5" />
                  Pythagorean Numerology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {analysis.numerology.pythagorean.value}
                    </div>
                    {analysis.numerology.pythagorean.isMasterNumber && (
                      <div className="text-sm text-purple-500 font-medium">
                        Master Number
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium mb-2">Letter Breakdown:</div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.numerology.pythagorean.breakdown.map((letter: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        >
                          {letter.letter}({letter.pythagoreanValue})
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {getNumerologicalMeaning(analysis.numerology.pythagorean.value, 'pythagorean')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Phonology Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Info className="h-5 w-5" />
                Phonology Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Pronunciation</div>
                  <div className="text-lg font-mono bg-gray-100 p-2 rounded">
                    {analysis.phonology.phoneticTranscription}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Difficulty</div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.phonology.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    analysis.phonology.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {analysis.phonology.difficulty.charAt(0).toUpperCase() + analysis.phonology.difficulty.slice(1)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Syllables</div>
                  <div className="text-lg font-semibold">{analysis.phonology.syllables}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Stress Pattern</div>
                  <div className="text-lg font-mono">{analysis.phonology.stressPattern}</div>
                </div>
              </div>
              
              {analysis.phonology.nicknamePotential.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Potential Nicknames</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.phonology.nicknamePotential.map((nickname: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm"
                      >
                        {nickname}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vibration Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="h-5 w-5" />
                Vibration Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Vibration Type and Score */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Vibration Type</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.phonology.vibration.type === 'positive' ? 'bg-green-100 text-green-800' :
                      analysis.phonology.vibration.type === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {analysis.phonology.vibration.type.charAt(0).toUpperCase() + analysis.phonology.vibration.type.slice(1)} Vibration
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Vibration Score</div>
                    <div className={`text-2xl font-bold ${
                      analysis.phonology.vibration.score > 0 ? 'text-green-600' :
                      analysis.phonology.vibration.score < 0 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {analysis.phonology.vibration.score > 0 ? '+' : ''}{analysis.phonology.vibration.score}
                    </div>
                  </div>
                </div>

                {/* Positive Combinations */}
                {analysis.phonology.vibration.positiveCombinations.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-green-700 mb-2">✨ Positive Vibration Combinations</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.phonology.vibration.positiveCombinations.map((combination: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium"
                        >
                          {combination}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Negative Combinations */}
                {analysis.phonology.vibration.negativeCombinations.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-red-700 mb-2">⚠️ Negative Vibration Combinations</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.phonology.vibration.negativeCombinations.map((combination: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium"
                        >
                          {combination}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Numerology Warning */}
                {analysis.phonology.vibration.numerologyWarning && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="text-sm font-medium text-red-700 mb-2">⚠️ Numerology Warning</div>
                    <div className="text-sm text-red-600">
                      This name contains avoidable numerology numbers that may bring challenges. 
                      Consider alternative spellings or names with more favorable numerological values.
                    </div>
                  </div>
                )}

                {/* Vibration Interpretation */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Vibration Interpretation</div>
                  <div className="text-sm text-gray-600">
                    {analysis.phonology.vibration.type === 'positive' && 
                      "This name carries positive vibrational energy that can bring good fortune, success, and harmony to the bearer."
                    }
                    {analysis.phonology.vibration.type === 'negative' && 
                      "This name contains negative vibrational patterns that may create challenges or obstacles in life."
                    }
                    {analysis.phonology.vibration.type === 'neutral' && 
                      "This name has a balanced vibrational energy with no significant positive or negative influences."
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => {
                if (isFavorite(analysis.name)) {
                  // Already in favorites, could show a message or do nothing
                  console.log('Already in favorites:', analysis.name);
                } else {
                  addToFavorites(analysis.name);
                }
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${isFavorite(analysis.name) ? 'text-red-500 fill-current' : ''}`} />
              {isFavorite(analysis.name) ? 'In Favorites' : 'Add to Favorites'}
            </Button>
            <Button
              onClick={() => {
                // Share functionality
                navigator.clipboard.writeText(`Check out the numerology analysis for "${analysis.name}"!`);
              }}
              variant="outline"
            >
              Share Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
