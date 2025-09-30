import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuickFilter } from '@/components/QuickFilter'
import { useSession } from 'next-auth/react'
import { LoginModal } from '@/components/LoginModal'
import { Heart } from 'lucide-react'

type TrendingItem = { name: string; gender?: string }

export function TrendingNames() {
  const [items, setItems] = React.useState<TrendingItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [sortAsc, setSortAsc] = React.useState(true)
  const [filter, setFilter] = React.useState('')
  const [favoriteSet, setFavoriteSet] = React.useState<Record<string, boolean>>({})
  const [loginOpen, setLoginOpen] = React.useState(false)
  const { data: session } = useSession()

  const fetchTrending = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/trending')
      const data = await res.json()
      const list: TrendingItem[] = Array.isArray(data.names)
        ? data.names.map((it: any) => typeof it === 'string' ? { name: it, gender: 'Unisex' } : { name: it?.name, gender: it?.gender || 'Unisex' })
        : []
      setItems(list)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { fetchTrending() }, [fetchTrending])

  const toggleSort = () => {
    setSortAsc(prev => !prev)
    setItems(prev => {
      const sorted = [...prev].sort((a,b) => a.name.localeCompare(b.name))
      return sortAsc ? sorted.reverse() : sorted
    })
  }

  const analyze = (name: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    window.open(`/calculator/${cleanName}`, '_blank')
  }

  const toggleFavorite = async (name: string) => {
    if (!session) {
      setLoginOpen(true)
      return
    }
    const normalized = name.trim()
    const isFav = !!favoriteSet[normalized]
    try {
      if (isFav) {
        const response = await fetch('/api/user/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nameId: normalized })
        })
        if (response.ok) {
          setFavoriteSet(prev => ({ ...prev, [normalized]: false }))
        }
      } else {
        const body = {
          id: normalized,
          name: normalized,
          numerology: { pythagorean: { totalValue: 0, reducedValue: 0, meaning: '', characteristics: [], compatibility: [], warnings: [], letterBreakdown: [] }, chaldean: { totalValue: 0, reducedValue: 0, meaning: '', characteristics: [], compatibility: [], warnings: [], letterBreakdown: [] }, coreNumbers: { lifePath: 0, destiny: 0, soul: 0, personality: 0, radical: 0 } },
          phonology: { syllables: 0, vowelCount: 0, consonantCount: 0, phoneticAnalysis: '', pronunciation: '', culturalNotes: [], vibrations: { energy: 0, frequency: '', resonance: '', harmony: '', score: 0, rating: '' }, soundPatterns: { alliteration: [], assonance: [], rhythm: '', flow: '' }, vibratoryScience: { positiveCombinations: [], negativeCombinations: [], overallVibration: 'Neutral', avoidableNumbers: [] } },
          timestamp: new Date(),
          isFavorite: true
        }
        const response = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (response.ok) {
          setFavoriteSet(prev => ({ ...prev, [normalized]: true }))
        }
      }
    } catch (e) {
      console.error('Error toggling favorite from trending:', e)
    }
  }

  const filtered = items.filter(it => it.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trending Names ({items.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={toggleSort}>
              {sortAsc ? '↑' : '↓'}
            </Button>
            <Button onClick={fetchTrending} disabled={loading}>Refresh</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">No trending names yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex justify-end mb-2">
              <QuickFilter value={filter} onChange={setFilter} placeholder="Filter names..." />
            </div>
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
                {filtered.map((it, i) => (
                  <tr key={`${it.name}-${i}`} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{i + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{it.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{it.gender || 'Unisex'}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => analyze(it.name)}>Analyze</Button>
                        <button
                          aria-label="Toggle favorite"
                          className={`p-2 rounded hover:bg-gray-100 ${favoriteSet[it.name] ? 'text-red-600' : 'text-gray-500'}`}
                          onClick={() => toggleFavorite(it.name)}
                          title={favoriteSet[it.name] ? 'Remove favorite' : 'Save to favorites'}
                        >
                          <Heart className={`h-4 w-4 ${favoriteSet[it.name] ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} message="Please sign in to save trending names to favorites" />
      </CardContent>
    </Card>
  )
}


