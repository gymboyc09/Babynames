import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function TrendingNames() {
  const [names, setNames] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending Names ({names.length})</CardTitle>
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
                </tr>
              </thead>
              <tbody>
                {names.map((n, i) => (
                  <tr key={`${n}-${i}`} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{i + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4">
          <Button onClick={fetchTrending} disabled={loading}>Refresh</Button>
        </div>
      </CardContent>
    </Card>
  )
}


