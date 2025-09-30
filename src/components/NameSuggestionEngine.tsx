import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { LoginModal } from './LoginModal';
import { Heart } from 'lucide-react';

interface SuggestionItem { name: string; gender?: string }

export function NameSuggestionEngine() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultLimit, setResultLimit] = useState<number>(10);
  const [favoriteSet, setFavoriteSet] = useState<Record<string, boolean>>({});
  const [loginOpen, setLoginOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      params.append('limit', resultLimit.toString());
      
      const response = await fetch(`/api/names/search?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        const items: SuggestionItem[] = Array.isArray(data.names)
          ? data.names.map((it: any) => typeof it === 'string' ? { name: it } : { name: it?.name, gender: it?.gender })
          : [];
        setSuggestions(items);
      } else {
        console.error('Error fetching names:', data.error);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching names:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeName = async (name: string) => {
    try {
      const response = await fetch('/api/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.sessionId && data.cleanName) {
        const url = `/calculator/${data.cleanName}?s=${data.sessionId}`;
        window.open(url, '_blank');
      } else {
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const url = `/calculator/${cleanName}`;
        window.open(url, '_blank');
      }
    } catch (error) {
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const url = `/calculator/${cleanName}`;
      window.open(url, '_blank');
    }
  };

  const toggleFavorite = async (name: string) => {
    if (!session) {
      setLoginOpen(true);
      return;
    }
    const normalized = name.trim();
    const isFav = !!favoriteSet[normalized];
    try {
      if (isFav) {
        const response = await fetch('/api/user/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nameId: normalized })
        });
        if (response.ok) {
          setFavoriteSet(prev => ({ ...prev, [normalized]: false }));
        }
      } else {
        const body = {
          id: normalized,
          name: normalized,
          numerology: { pythagorean: { totalValue: 0, reducedValue: 0, meaning: '', characteristics: [], compatibility: [], warnings: [], letterBreakdown: [] }, chaldean: { totalValue: 0, reducedValue: 0, meaning: '', characteristics: [], compatibility: [], warnings: [], letterBreakdown: [] }, coreNumbers: { lifePath: 0, destiny: 0, soul: 0, personality: 0, radical: 0 } },
          phonology: { syllables: 0, vowelCount: 0, consonantCount: 0, phoneticAnalysis: '', pronunciation: '', culturalNotes: [], vibrations: { energy: 0, frequency: '', resonance: '', harmony: '', score: 0, rating: '' }, soundPatterns: { alliteration: [], assonance: [], rhythm: '', flow: '' }, vibratoryScience: { positiveCombinations: [], negativeCombinations: [], overallVibration: 'Neutral', avoidableNumbers: [] } },
          timestamp: new Date(),
          isFavorite: true
        };
        const response = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          setFavoriteSet(prev => ({ ...prev, [normalized]: true }));
        }
      }
    } catch (e) {
      // ignore
    }
  }

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
                  Number of Results
                </label>
                <select
                  value={resultLimit}
                  onChange={(e) => setResultLimit(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 names</option>
                  <option value={15}>15 names</option>
                  <option value={20}>20 names</option>
                </select>
              </div>
            </div>
            
            <Button onClick={handleSearch} className="w-full" disabled={loading}>
              {loading ? 'Searching...' : 'Find Names'}
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">#</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Gender</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((item, index) => (
                    <tr key={item.name} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{item.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.gender || 'Unisex'}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAnalyzeName(item.name)}
                            className="text-sm"
                          >
                            Analyze
                          </Button>
                          <button
                            aria-label="Toggle favorite"
                            className={`p-2 rounded hover:bg-gray-100 ${favoriteSet[item.name] ? 'text-red-600' : 'text-gray-500'}`}
                            onClick={() => toggleFavorite(item.name)}
                            title={favoriteSet[item.name] ? 'Remove favorite' : 'Save to favorites'}
                          >
                            <Heart className={`h-4 w-4 ${favoriteSet[item.name] ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
