import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function TrendingNames() {
  const [names, setNames] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const [sortAsc, setSortAsc] = React.useState(true)

  const fetchTrending = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/trending')
      const data = await res.json()
      setNames(data.names || [])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { fetchTrending() }, [fetchTrending])

  const toggleSort = () => {
    setSortAsc(prev => !prev)
    setNames(prev => {
      const sorted = [...prev].sort((a,b) => a.localeCompare(b))
      return sortAsc ? sorted.reverse() : sorted
    })
  }

  const analyze = (name: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    window.open(`/calculator/${cleanName}`, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trending Names ({names.length})</CardTitle>
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
        ) : names.length === 0 ? (
          <div className="text-gray-600">No trending names yet.</div>
        ) : (
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
                {names.map((n, i) => (
                  <tr key={`${n}-${i}`} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{i + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{n}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Button variant="outline" size="sm" onClick={() => analyze(n)}>Analyze</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


