import React, { useState } from 'react';
import { babyNames, nameCategories, nameOrigins } from '@/data/names';
import { calculateNumerology } from '@/lib/numerology';
import { analyzePhonology } from '@/lib/phonology';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { NameAnalysis } from '@/types';
import { useSession } from 'next-auth/react';

export function NameSuggestionEngine() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('English');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string>('');
  const [analysis, setAnalysis] = useState<NameAnalysis | null>(null);
  const { data: session } = useSession();

  const handleSearch = () => {
    let filteredNames = babyNames;
    
    if (searchTerm) {
      filteredNames = babyNames.filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      const categoryNames = nameCategories[selectedCategory as keyof typeof nameCategories] || [];
      filteredNames = filteredNames.filter(name => categoryNames.includes(name));
    }
    
    if (selectedOrigin !== 'All') {
      const originNames = nameOrigins[selectedOrigin as keyof typeof nameOrigins] || [];
      filteredNames = filteredNames.filter(name => originNames.includes(name));
    }
    
    setSuggestions(filteredNames.slice(0, 20));
  };

  const handleAnalyzeName = async (name: string) => {
    setSelectedName(name);
    
    try {
      const numerology = calculateNumerology(name);
      const phonology = analyzePhonology(name);
      
      const nameAnalysis: NameAnalysis = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        numerology,
        phonology,
        timestamp: new Date(),
        isFavorite: false
      };
      
      setAnalysis(nameAnalysis);
      
      // Save to recent calculations if user is logged in
      if (session) {
        console.log('Saving analysis to database:', nameAnalysis);
      }
    } catch (error) {
      console.error('Error analyzing name:', error);
    }
  };

  const handleToggleFavorite = (name: string) => {
    if (!analysis) return;
    
    setAnalysis({
      ...analysis,
      isFavorite: !analysis.isFavorite
    });
    
    // TODO: Update in database if user is logged in
    if (session) {
      console.log('Toggling favorite:', name);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Name Suggestion Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search for names
              </label>
              <Input
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Enter name or part of name..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Categories</option>
                  {Object.keys(nameCategories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Origins</option>
                  {Object.keys(nameOrigins).map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button onClick={handleSearch} className="w-full">
              Find Names
            </Button>
          </div>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Name Suggestions ({suggestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {suggestions.map((name) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeName(name)}
                  className={`text-sm ${
                    selectedName === name ? 'bg-blue-100 text-blue-800' : ''
                  }`}
                >
                  {name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Analysis for "{analysis.name}"</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleFavorite(analysis.name)}
              >
                {analysis.isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Numerology</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Total Value:</span> {analysis.numerology.totalValue}</p>
                  <p><span className="font-medium">Reduced Value:</span> {analysis.numerology.reducedValue}</p>
                  <p><span className="font-medium">Meaning:</span> {analysis.numerology.meaning}</p>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Characteristics:</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.numerology.characteristics.map((char, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Phonology</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Syllables:</span> {analysis.phonology.syllables}</p>
                  <p><span className="font-medium">Vowels:</span> {analysis.phonology.vowelCount}</p>
                  <p><span className="font-medium">Consonants:</span> {analysis.phonology.consonantCount}</p>
                  <p><span className="font-medium">Analysis:</span> {analysis.phonology.phoneticAnalysis}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
