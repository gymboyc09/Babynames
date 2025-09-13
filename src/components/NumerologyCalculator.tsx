import React, { useState } from 'react';
import { calculateNumerology } from '@/lib/numerology';
import { analyzePhonology } from '@/lib/phonology';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { NameAnalysis } from '@/types';
import { useSession } from 'next-auth/react';

interface NumerologyCalculatorProps {
  initialName?: string;
}

export function NumerologyCalculator({ initialName = '' }: NumerologyCalculatorProps) {
  const [name, setName] = useState(initialName);
  const [result, setResult] = useState<NameAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data: session } = useSession();

  // Update name when initialName prop changes
  React.useEffect(() => {
    if (initialName) {
      setName(initialName);
    }
  }, [initialName]);

  // Clear result when name changes manually
  React.useEffect(() => {
    if (name !== initialName) {
      setResult(null);
    }
  }, [name, initialName]);

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
        try {
          const response = await fetch('/api/user/recent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analysis)
          });
          if (response.ok) {
            console.log('Saved to recent calculations');
          }
        } catch (error) {
          console.error('Error saving to recent calculations:', error);
        }
      }
    } catch (error) {
      console.error('Error analyzing name:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setName('');
    setResult(null);
  };

  const handleToggleFavorite = async () => {
    if (!result || !session) return;
    
    try {
      if (result.isFavorite) {
        // Remove from favorites
        const response = await fetch('/api/user/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nameId: result.id })
        });
        if (response.ok) {
          setResult({ ...result, isFavorite: false });
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result)
        });
        if (response.ok) {
          setResult({ ...result, isFavorite: true });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Numerology Calculator</CardTitle>
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
            <div className="flex space-x-2">
              <Button
                onClick={handleAnalyze}
                disabled={!name.trim() || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Name'}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={!name.trim() && !result}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Analysis for "{result.name}"</CardTitle>
                {session && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleFavorite}
                  >
                    {result.isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Numerology Section */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Pythagorean Numerology</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Letter Breakdown:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {result.numerology.pythagorean.letterBreakdown.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                              {item.letter}({item.value})
                            </span>
                          ))}
                          <span className="px-2 py-1 bg-blue-200 text-blue-900 text-sm rounded font-bold">
                            = {result.numerology.pythagorean.totalValue}
                          </span>
                        </div>
                      </div>
                      <p><span className="font-medium">Reduced Value:</span> {result.numerology.pythagorean.reducedValue}</p>
                      <p><span className="font-medium">Meaning:</span> {result.numerology.pythagorean.meaning}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Characteristics:</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.numerology.pythagorean.characteristics.map((char, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Chaldean Numerology</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Letter Breakdown:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {result.numerology.chaldean.letterBreakdown.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                              {item.letter}({item.value})
                            </span>
                          ))}
                          <span className="px-2 py-1 bg-purple-200 text-purple-900 text-sm rounded font-bold">
                            = {result.numerology.chaldean.totalValue}
                          </span>
                        </div>
                      </div>
                      <p><span className="font-medium">Reduced Value:</span> {result.numerology.chaldean.reducedValue}</p>
                      <p><span className="font-medium">Meaning:</span> {result.numerology.chaldean.meaning}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Characteristics:</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.numerology.chaldean.characteristics.map((char, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Core Numbers</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.numerology.coreNumbers.lifePath}</div>
                        <div className="text-sm text-gray-600">Life Path</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.numerology.coreNumbers.destiny}</div>
                        <div className="text-sm text-gray-600">Destiny</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{result.numerology.coreNumbers.soul}</div>
                        <div className="text-sm text-gray-600">Soul</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{result.numerology.coreNumbers.personality}</div>
                        <div className="text-sm text-gray-600">Personality</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phonology Section */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Phonology Analysis</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Syllables:</span> {result.phonology.syllables}</p>
                      <p><span className="font-medium">Vowels:</span> {result.phonology.vowelCount}</p>
                      <p><span className="font-medium">Consonants:</span> {result.phonology.consonantCount}</p>
                      <p><span className="font-medium">Analysis:</span> {result.phonology.phoneticAnalysis}</p>
                      <p><span className="font-medium">Pronunciation:</span> {result.phonology.pronunciation}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Vibrations</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Vibration Score:</span>
                          <span className="text-2xl font-bold text-blue-600">{result.phonology.vibrations.score}/100</span>
                        </div>
                        <div className="mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                            {result.phonology.vibrations.rating}
                          </span>
                        </div>
                      </div>
                      <p><span className="font-medium">Energy Level:</span> {result.phonology.vibrations.energy}</p>
                      <p><span className="font-medium">Frequency:</span> {result.phonology.vibrations.frequency}</p>
                      <p><span className="font-medium">Resonance:</span> {result.phonology.vibrations.resonance}</p>
                      <p><span className="font-medium">Harmony:</span> {result.phonology.vibrations.harmony}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Sound Patterns</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Rhythm:</span> {result.phonology.soundPatterns.rhythm}</p>
                      <p><span className="font-medium">Flow:</span> {result.phonology.soundPatterns.flow}</p>
                      {result.phonology.soundPatterns.alliteration.length > 0 && (
                        <div>
                          <span className="font-medium">Alliteration:</span> {result.phonology.soundPatterns.alliteration.join(', ')}
                        </div>
                      )}
                      {result.phonology.soundPatterns.assonance.length > 0 && (
                        <div>
                          <span className="font-medium">Assonance:</span> {result.phonology.soundPatterns.assonance.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Vibratory Name Science</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Overall Vibration:</span>
                          <span className={`px-2 py-1 text-sm rounded font-bold ${
                            result.phonology.vibratoryScience.overallVibration === 'Positive' 
                              ? 'bg-green-100 text-green-800' 
                              : result.phonology.vibratoryScience.overallVibration === 'Negative'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {result.phonology.vibratoryScience.overallVibration}
                          </span>
                        </div>
                      </div>
                      
                      {result.phonology.vibratoryScience.positiveCombinations.length > 0 && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Positive Combinations Found:</h5>
                          <div className="flex flex-wrap gap-1">
                            {result.phonology.vibratoryScience.positiveCombinations.map((combo, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                {combo}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {result.phonology.vibratoryScience.negativeCombinations.length > 0 && (
                        <div>
                          <h5 className="font-medium text-red-700 mb-2">Negative Combinations Found:</h5>
                          <div className="flex flex-wrap gap-1">
                            {result.phonology.vibratoryScience.negativeCombinations.map((combo, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                                {combo}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result.phonology.culturalNotes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Cultural Notes</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.phonology.culturalNotes.map((note, index) => (
                          <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded">
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