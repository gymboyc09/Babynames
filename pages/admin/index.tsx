import React from 'react'
import Head from 'next/head'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { AdminHeader } from '@/components/AdminHeader'
import { Footer } from '@/components/Footer'
import { QuickFilter } from '@/components/QuickFilter'

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions)
  // @ts-ignore
  if (!session?.user?.isAdmin) {
    return {
      redirect: { destination: '/', permanent: false },
    }
  }
  return { props: {} }
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = React.useState<'names' | 'trending' | 'users'>('names')

  return (
    <>
      <Head>
        <title>Admin Panel - Baby Names</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="bg-white rounded-lg shadow-sm border p-4 h-max">
              <h2 className="text-lg font-semibold mb-4">Admin Menu</h2>
              <nav className="space-y-2">
                <button onClick={() => setActiveSection('names')} className={`w-full text-left px-4 py-2 rounded ${activeSection==='names' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Names</button>
                <button onClick={() => setActiveSection('trending')} className={`w-full text-left px-4 py-2 rounded ${activeSection==='trending' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Trending</button>
                <button onClick={() => setActiveSection('users')} className={`w-full text-left px-4 py-2 rounded ${activeSection==='users' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Users</button>
              </nav>
            </aside>

            {/* Content */}
            <section className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>
                {activeSection === 'names' && <NamesTab />}
                {activeSection === 'trending' && <TrendingAdminTab />}
                {activeSection === 'users' && <UsersTab />}
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

function NamesTab() {
  const [q, setQ] = React.useState('')
  const [mode, setMode] = React.useState<'starts' | 'ends' | 'contains'>('starts')
  const [page, setPage] = React.useState(1)
  const [pageSize] = React.useState(50)
  const [total, setTotal] = React.useState(0)
  const [names, setNames] = React.useState<string[]>([])
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [quick, setQuick] = React.useState('')
  const [oldName, setOldName] = React.useState('')
  const [newName, setNewName] = React.useState('')
  const [bulkText, setBulkText] = React.useState('')
  const [backfillRunning, setBackfillRunning] = React.useState(false)
  const [backfillInfo, setBackfillInfo] = React.useState<{ updated: number; remaining: number } | null>(null)
  const [overrideName, setOverrideName] = React.useState('')
  const [overrideGender, setOverrideGender] = React.useState<'Boy' | 'Girl' | 'Unisex'>('Boy')
  const [overrideMsg, setOverrideMsg] = React.useState('')

  const fetchNames = React.useCallback(async () => {
    const params = new URLSearchParams({ q, mode: String(mode), page: String(page), pageSize: String(pageSize) })
    const res = await fetch(`/api/admin/names?${params}`)
    const data = await res.json()
    setNames(data.names || [])
    setTotal(data.total || 0)
    setSelected({})
  }, [q, mode, page, pageSize])

  React.useEffect(() => { fetchNames() }, [fetchNames])

  const addBulk = async () => {
    const list = bulkText.split(/\r?\n|,|;|\t/).map(s => s.trim()).filter(Boolean)
    if (list.length === 0) return
    await fetch('/api/admin/names', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ names: list }) })
    setBulkText('')
    fetchNames()
  }

  const updateOne = async () => {
    if (!oldName || !newName) return
    await fetch('/api/admin/names', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ oldName, newName }) })
    setOldName('')
    setNewName('')
    fetchNames()
  }

  const deleteSelected = async () => {
    const toDelete = Object.keys(selected).filter(k => selected[k])
    if (toDelete.length === 0) return
    await fetch('/api/admin/names', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ names: toDelete }) })
    fetchNames()
  }

  const runBackfill = async (force: boolean = false) => {
    setBackfillRunning(true)
    try {
      const res = await fetch('/api/admin/names-gender-backfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch: 5000, force })
      })
      const data = await res.json()
      setBackfillInfo({ updated: data.updated ?? 0, remaining: data.remaining ?? 0 })
    } catch (e) {
      setBackfillInfo({ updated: 0, remaining: 0 })
    } finally {
      setBackfillRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions Bar */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Names</label>
            <input 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              className="w-full border rounded px-3 py-2" 
              placeholder="Enter search term..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
            <select 
              value={mode} 
              onChange={e => setMode(e.target.value as any)} 
              className="w-full border rounded px-3 py-2"
            >
              <option value="starts">Starts with</option>
              <option value="ends">Ends with</option>
              <option value="contains">Contains</option>
            </select>
          </div>
          <div>
            <button 
              onClick={() => setPage(1)} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
          <div>
            <button 
              onClick={deleteSelected} 
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total: {total}</div>
          </div>
        </div>
      </div>

      {/* Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Names Section */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Names (Bulk)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter names (one per line, comma, or tab separated)
              </label>
              <textarea 
                value={bulkText} 
                onChange={e => setBulkText(e.target.value)} 
                className="w-full h-32 border rounded p-3" 
                placeholder="Enter names separated by comma, newline, or tab"
              />
            </div>
            <button 
              onClick={addBulk} 
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Names
            </button>
          </div>
        </div>

        {/* Gender Tools */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Tools</h3>
          <p className="text-sm text-gray-600 mb-3">Populate missing genders using intelligent prediction on up to 5,000 names per run.</p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button onClick={() => runBackfill(true)} disabled={backfillRunning} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {backfillRunning ? 'Running...' : 'Recompute & Apply Overrides (5000)'}
            </button>
            {backfillInfo && (
              <span className="text-sm text-gray-700">Updated: {backfillInfo.updated}, Remaining: {backfillInfo.remaining}</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2">Tip: Use “Recompute & Apply Overrides” to fix names already labeled incorrectly (e.g., Srinivasa, Srinivasan → Boy).</p>
          <div className="border-t pt-4 mt-2">
            <h4 className="font-semibold mb-2">Manual Override</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div className="md:col-span-3">
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input value={overrideName} onChange={e => setOverrideName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter name e.g. Srinivas" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Gender</label>
                <select value={overrideGender} onChange={e => setOverrideGender(e.target.value as any)} className="w-full border rounded px-3 py-2">
                  <option value="Boy">Boy</option>
                  <option value="Girl">Girl</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              <div>
                <button
                  onClick={async () => {
                    setOverrideMsg('')
                    const resp = await fetch('/api/admin/name-gender-set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: overrideName, gender: overrideGender }) })
                    if (resp.ok) {
                      setOverrideMsg('Saved')
                      setOverrideName('')
                    } else {
                      setOverrideMsg('Failed')
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-black"
                >
                  Save
                </button>
              </div>
            </div>
            {overrideMsg && <p className="text-sm text-gray-600 mt-2">{overrideMsg}</p>}
          </div>
        </div>
      </div>

      {/* Names Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Names Database</h3>
            <div className="flex gap-2">
              <button 
                disabled={page<=1} 
                onClick={() => setPage(p => Math.max(1, p-1))} 
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>
              <button 
                disabled={(page*pageSize)>=total} 
                onClick={() => setPage(p => p+1)} 
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b">
          <QuickFilter 
            value={quick} 
            onChange={setQuick} 
            placeholder="Filter names in table..." 
            className="w-full md:w-80" 
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {names.filter(n => n.toLowerCase().includes(quick.toLowerCase())).map(n => (
                <tr key={n} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={!!selected[n]} 
                      onChange={e => setSelected(prev => ({ ...prev, [n]: e.target.checked }))} 
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TrendingAdminTab() {
  const [trendingText, setTrendingText] = React.useState('')
  const [savingTrending, setSavingTrending] = React.useState(false)

  const loadTrending = React.useCallback(async () => {
    const res = await fetch('/api/admin/trending')
    const data = await res.json()
    const list = (data.names || []).map((it: any) => typeof it === 'string' ? it : `${it.name},${it.gender || 'Unisex'}`)
    setTrendingText(list.join('\n'))
  }, [])

  React.useEffect(() => { loadTrending() }, [loadTrending])

  const saveTrending = async () => {
    setSavingTrending(true)
    try {
      const rows = trendingText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
      const parsed = rows
        .filter((line, idx) => !(idx === 0 && /name\s*,\s*gender/i.test(line)))
        .map(line => {
          const parts = line.split(',').map(s => s.trim())
          const name = (parts[0] || '').trim()
          const gender = (parts[1] || 'Unisex').trim()
          return name ? { name, gender } : null
        })
        .filter(Boolean)

      await fetch('/api/admin/trending', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ names: parsed }) })
    } finally {
      setSavingTrending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Names (Public)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste CSV like: <code>Name,Gender</code> on the first line (optional) followed by rows like <code>Aarav,Boy</code>, <code>Aadhya,Girl</code>.
        </p>
        <div className="space-y-4">
          <textarea 
            value={trendingText} 
            onChange={e => setTrendingText(e.target.value)} 
            className="w-full h-64 border rounded p-3" 
            placeholder={"Name,Gender\nAarav,Boy\nAadhya,Girl"}
          />
          <button 
            onClick={saveTrending} 
            disabled={savingTrending} 
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {savingTrending ? 'Saving...' : 'Save Trending Names'}
          </button>
        </div>
      </div>
    </div>
  )
}

function UsersTab() {
  const [page, setPage] = React.useState(1)
  const [pageSize] = React.useState(50)
  const [total, setTotal] = React.useState(0)
  const [users, setUsers] = React.useState<any[]>([])
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [quick, setQuick] = React.useState('')

  const fetchUsers = React.useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    const res = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data.users || [])
    setTotal(data.total || 0)
    setSelected({})
  }, [page, pageSize])

  React.useEffect(() => { fetchUsers() }, [fetchUsers])

  const blockOrUnblock = async (blocked: boolean) => {
    const ids = Object.keys(selected).filter(k => selected[k])
    if (ids.length === 0) return
    await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids, blocked }) })
    fetchUsers()
  }

  const deleteSelected = async () => {
    const ids = Object.keys(selected).filter(k => selected[k])
    if (ids.length === 0) return
    await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) })
    fetchUsers()
  }

  return (
    <div className="space-y-6">
      {/* User Actions Bar */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => blockOrUnblock(true)} 
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Block Selected
          </button>
          <button 
            onClick={() => blockOrUnblock(false)} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Unblock Selected
          </button>
          <button 
            onClick={deleteSelected} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Users Database</h3>
            <div className="flex gap-2">
              <button 
                disabled={page<=1} 
                onClick={() => setPage(p => Math.max(1, p-1))} 
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>
              <button 
                disabled={(page*pageSize)>=total} 
                onClick={() => setPage(p => p+1)} 
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">Total: {total}</div>
        </div>
        
        <div className="p-4 border-b">
          <QuickFilter 
            value={quick} 
            onChange={setQuick} 
            placeholder="Filter users by email..." 
            className="w-full md:w-80" 
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blocked
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.filter(u => `${u.email}`.toLowerCase().includes(quick.toLowerCase())).map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={!!selected[u.id]} 
                      onChange={e => setSelected(prev => ({ ...prev, [u.id]: e.target.checked }))} 
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {u.isAdmin ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.isBlocked ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {u.isBlocked ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


