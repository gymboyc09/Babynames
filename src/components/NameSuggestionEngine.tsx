'use client';

import React, { useState, useMemo } from 'react';
import { calculateNumerology } from '@/lib/numerology';
import { analyzePhonology } from '@/lib/phonology';
import { SAMPLE_NAMES, CULTURAL_ORIGINS } from '@/data/names';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { SearchFilters, NameSuggestion } from '@/types';
import { Search, Heart, Star, Volume2, Share2 } from 'lucide-react';

export const NameSuggestionEngine: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    numerologyTarget: undefined,
    gender: 'any',
    origin: 'any',
    minLength: 2,
    maxLength: 12,
    difficulty: 'any',
    modernOnly: false,
    traditionalOnly: false
  });
  
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { addToFavorites, removeFromFavorites, isFavorite, addToRecentCalculations } = useAppStore();

  // Filter and search names based on criteria
  const filteredSuggestions = useMemo(() => {
    let filtered = SAMPLE_NAMES;

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(name => 
        name.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply gender filter
    if (filters.gender && filters.gender !== 'any') {
      filtered = filtered.filter(name => name.gender === filters.gender);
    }

    // Apply origin filter
    if (filters.origin && filters.origin !== 'any') {
      filtered = filtered.filter(name => 
        name.cultural.origin.toLowerCase().includes(filters.origin!.toLowerCase())
      );
    }

    // Apply length filters
    if (filters.minLength) {
      filtered = filtered.filter(name => name.name.length >= filters.minLength!);
    }
    if (filters.maxLength) {
      filtered = filtered.filter(name => name.name.length <= filters.maxLength!);
    }

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty !== 'any') {
      filtered = filtered.filter(name => {
        const phonology = analyzePhonology(name.name);
        return phonology.difficulty === filters.difficulty;
      });
    }

    // Apply numerology filter
    if (filters.numerologyTarget) {
      filtered = filtered.filter(name => {
        const numerology = calculateNumerology(name.name);
        return numerology.chaldean.value === filters.numerologyTarget ||
               numerology.pythagorean.value === filters.numerologyTarget;
      });
    }

    // Convert to suggestions with scores
    return filtered.map(name => {
      const numerology = calculateNumerology(name.name);
      const phonology = analyzePhonology(name.name);
      
      let score = 50; // Base score
      
      // Boost score for matching numerology
      if (filters.numerologyTarget) {
        if (numerology.chaldean.value === filters.numerologyTarget) score += 20;
        if (numerology.pythagorean.value === filters.numerologyTarget) score += 15;
      }
      
      // Boost score for popularity
      score += name.cultural.popularity * 0.3;
      
      // Boost score for easy pronunciation
      if (phonology.difficulty === 'easy') score += 10;
      if (phonology.difficulty === 'hard') score -= 5;
      
      const reasons: string[] = [];
      if (filters.numerologyTarget && numerology.chaldean.value === filters.numerologyTarget) {
        reasons.push(`Chaldean numerology: ${numerology.chaldean.value}`);
      }
      if (filters.numerologyTarget && numerology.pythagorean.value === filters.numerologyTarget) {
        reasons.push(`Pythagorean numerology: ${numerology.pythagorean.value}`);
      }
      if (phonology.difficulty === 'easy') {
        reasons.push('Easy to pronounce');
      }
      if (name.cultural.popularity > 80) {
        reasons.push('Very popular');
      }

      return {
        name: name.name,
        numerology,
        cultural: name.cultural,
        score: Math.min(100, Math.max(0, score)),
        reasons
      };
    }).sort((a, b) => b.score - a.score);
  }, [filters, searchQuery]);

  const handleGenerateSuggestions = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSuggestions(filteredSuggestions.slice(0, 24)); // Show top 24
      setIsLoading(false);
    }, 500);
  };

  const handleNameClick = (suggestion: NameSuggestion) => {
    const analysis = {
      name: suggestion.name,
      numerology: suggestion.numerology,
      phonology: analyzePhonology(suggestion.name),
      cultural: suggestion.cultural
    };
    
    addToRecentCalculations(analysis);
  };

  const handleToggleFavorite = (name: string) => {
    if (isFavorite(name)) {
      removeFromFavorites(name);
    } else {
      addToFavorites(name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Perfect Names
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Names
              </label>
              <Input
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Type to search names..."
              />
            </div>

            {/* Filters Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Numerology Target */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numerology Target
                </label>
                <select
                  value={filters.numerologyTarget || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    numerologyTarget: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any number</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={filters.gender || 'any'}
                  onChange={(e) => setFilters({
                    ...filters,
                    gender: e.target.value as 'male' | 'female' | 'unisex' | 'any'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                <select
                  value={filters.origin || 'any'}
                  onChange={(e) => setFilters({
                    ...filters,
                    origin: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="any">Any origin</option>
                  {CULTURAL_ORIGINS.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </div>

              {/* Length Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Length
                </label>
                <Input
                  type="number"
                  value={filters.minLength || 2}
                  onChange={(value) => setFilters({
                    ...filters,
                    minLength: parseInt(value) || 2
                  })}
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Length
                </label>
                <Input
                  type="number"
                  value={filters.maxLength || 12}
                  onChange={(value) => setFilters({
                    ...filters,
                    maxLength: parseInt(value) || 12
                  })}
                  placeholder="12"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pronunciation
                </label>
                <select
                  value={filters.difficulty || 'any'}
                  onChange={(e) => setFilters({
                    ...filters,
                    difficulty: e.target.value as 'easy' | 'medium' | 'hard' | 'any'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="any">Any difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateSuggestions}
                disabled={isLoading}
                className="px-8"
              >
                {isLoading ? 'Generating...' : 'Generate Suggestions'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Suggested Names ({suggestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.name}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleNameClick(suggestion)}
                >
                  <Card
                    variant="outlined"
                  >
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      {/* Name */}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {suggestion.name}
                      </h3>
                      
                      {/* Numerology */}
                      <div className="flex justify-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          C: {suggestion.numerology.chaldean.value}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          P: {suggestion.numerology.pythagorean.value}
                        </span>
                      </div>
                      
                      {/* Score */}
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {Math.round(suggestion.score)}%
                        </span>
                      </div>
                      
                      {/* Origin */}
                      <div className="text-xs text-gray-500">
                        {suggestion.cultural.origin}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(suggestion.name);
                          }}
                          className="p-1"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              isFavorite(suggestion.name) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Play pronunciation (placeholder)
                            console.log('Play pronunciation for:', suggestion.name);
                          }}
                          className="p-1"
                        >
                          <Volume2 className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Share name (placeholder)
                            navigator.clipboard.writeText(suggestion.name);
                          }}
                          className="p-1"
                        >
                          <Share2 className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {filteredSuggestions.length > suggestions.length && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSuggestions(filteredSuggestions)}
                >
                  Load More Names ({filteredSuggestions.length - suggestions.length} remaining)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
