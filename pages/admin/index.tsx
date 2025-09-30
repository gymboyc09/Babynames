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
  const [activeTab, setActiveTab] = React.useState<'names' | 'users'>('names')

  return (
    <>
      <Head>
        <title>Admin Panel - Baby Names</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

            <div className="flex gap-4 mb-6">
              <button onClick={() => setActiveTab('names')} className={`px-4 py-2 rounded ${activeTab==='names' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Names</button>
              <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded ${activeTab==='users' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Users</button>
            </div>

            {activeTab === 'names' ? <NamesTab /> : activeTab === 'users' ? <UsersTab /> : null}
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
  const [trendingText, setTrendingText] = React.useState('')
  const [savingTrending, setSavingTrending] = React.useState(false)

  const loadTrending = React.useCallback(async () => {
    const res = await fetch('/api/admin/trending')
    const data = await res.json()
    const list: string[] = data.names || []
    setTrendingText(list.join('\n'))
  }, [])

  React.useEffect(() => { loadTrending() }, [loadTrending])

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

  const saveTrending = async () => {
    setSavingTrending(true)
    try {
      const list = trendingText.split(/\r?\n|,|;|\t/).map(s => s.trim()).filter(Boolean)
      await fetch('/api/admin/trending', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ names: list }) })
    } finally {
      setSavingTrending(false)
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

        {/* Update Name Section */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Name</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Old Name</label>
              <input 
                value={oldName} 
                onChange={e => setOldName(e.target.value)} 
                className="w-full border rounded px-3 py-2" 
                placeholder="Enter old name" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Name</label>
              <input 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                className="w-full border rounded px-3 py-2" 
                placeholder="Enter new name" 
              />
            </div>
            <button 
              onClick={updateOne} 
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Update Name
            </button>
          </div>
        </div>
      </div>

      {/* Trending Names Section */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Names (Public)</h3>
        <p className="text-sm text-gray-600 mb-4">
          These names will appear on the public Trending page for all users to see.
        </p>
        <div className="space-y-4">
          <textarea 
            value={trendingText} 
            onChange={e => setTrendingText(e.target.value)} 
            className="w-full h-40 border rounded p-3" 
            placeholder="Enter trending names, one per line..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      const checked = e.target.checked
                      const filtered = names.filter(n => n.toLowerCase().includes(quick.toLowerCase()))
                      setSelected(prev => {
                        const newSelected = { ...prev }
                        filtered.forEach(n => newSelected[n] = checked)
                        return newSelected
                      })
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
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

  const blockOrUnblock = async (block: boolean) => {
    const ids = Object.keys(selected).filter(k => selected[k])
    if (ids.length === 0) return
    await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids, block }) })
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      const checked = e.target.checked
                      const filtered = users.filter(u => `${u.email}`.toLowerCase().includes(quick.toLowerCase()))
                      setSelected(prev => {
                        const newSelected = { ...prev }
                        filtered.forEach(u => newSelected[u.id] = checked)
                        return newSelected
                      })
                    }}
                  />
                </th>
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


