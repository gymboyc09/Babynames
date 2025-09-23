import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/router';

export function NameSuggestionEngine() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultLimit, setResultLimit] = useState<number>(10);
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
        setSuggestions(data.names || []);
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
      // Generate SEO-friendly URL with secure token
      const response = await fetch('/api/generate-seo-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        // Open SEO-friendly calculator page in new tab for AdSense refresh
        window.open(data.url, '_blank');
      } else {
        console.error('Failed to generate SEO URL:', data.error);
        // Fallback to simple approach if URL generation fails
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const url = `/calculator/${cleanName}`;
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error generating SEO URL:', error);
      // Fallback to simple approach if URL generation fails
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const url = `/calculator/${cleanName}`;
      window.open(url, '_blank');
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
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((name, index) => (
                    <tr key={name} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{name}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAnalyzeName(name)}
                          className="text-sm"
                        >
                          Analyze
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
