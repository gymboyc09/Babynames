import React from 'react'
import Head from 'next/head'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

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
        <Header activeTab="suggestions" onTabChange={() => {}} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setActiveTab('names')} className={`px-4 py-2 rounded ${activeTab==='names' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Names</button>
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded ${activeTab==='users' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Users</button>
          </div>

          {activeTab === 'names' ? <NamesTab /> : <UsersTab />}
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
  const [oldName, setOldName] = React.useState('')
  const [newName, setNewName] = React.useState('')
  const [bulkText, setBulkText] = React.useState('')

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input value={q} onChange={e => setQ(e.target.value)} className="border rounded px-3 py-2" placeholder="Search names" />
        <select value={mode} onChange={e => setMode(e.target.value as any)} className="border rounded px-3 py-2">
          <option value="starts">Starts with</option>
          <option value="ends">Ends with</option>
          <option value="contains">Contains</option>
        </select>
        <button onClick={() => setPage(1)} className="px-4 py-2 bg-blue-600 text-white rounded" >Search</button>
        <button onClick={deleteSelected} className="px-4 py-2 bg-red-600 text-white rounded" >Delete Selected</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Add Names (bulk)</h3>
          <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} className="w-full h-32 border rounded p-2" placeholder="Enter names separated by comma, newline, or tab" />
          <div className="mt-2">
            <button onClick={addBulk} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
          </div>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Update Name</h3>
          <input value={oldName} onChange={e => setOldName(e.target.value)} className="border rounded px-3 py-2 mr-2" placeholder="Old name" />
          <input value={newName} onChange={e => setNewName(e.target.value)} className="border rounded px-3 py-2" placeholder="New name" />
          <div className="mt-2">
            <button onClick={updateOne} className="px-4 py-2 bg-yellow-600 text-white rounded">Update</button>
          </div>
        </div>
      </div>

      <div className="border rounded">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="text-sm text-gray-600">Total: {total}</div>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <button disabled={(page*pageSize)>=total} onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 w-12"></th>
              <th className="p-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {names.map(n => (
              <tr key={n} className="border-t">
                <td className="p-2"><input type="checkbox" checked={!!selected[n]} onChange={e => setSelected(prev => ({ ...prev, [n]: e.target.checked }))} /></td>
                <td className="p-2 font-medium">{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <div className="flex gap-2">
        <button onClick={() => blockOrUnblock(true)} className="px-4 py-2 bg-yellow-600 text-white rounded">Block Selected</button>
        <button onClick={() => blockOrUnblock(false)} className="px-4 py-2 bg-green-600 text-white rounded">Unblock Selected</button>
        <button onClick={deleteSelected} className="px-4 py-2 bg-red-600 text-white rounded">Delete Selected</button>
      </div>

      <div className="border rounded">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="text-sm text-gray-600">Total: {total}</div>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <button disabled={(page*pageSize)>=total} onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 w-12"></th>
              <th className="p-2">Email</th>
              <th className="p-2">Admin</th>
              <th className="p-2">Blocked</th>
              <th className="p-2">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2"><input type="checkbox" checked={!!selected[u.id]} onChange={e => setSelected(prev => ({ ...prev, [u.id]: e.target.checked }))} /></td>
                <td className="p-2 font-medium">{u.email}</td>
                <td className="p-2">{u.isAdmin ? 'Yes' : 'No'}</td>
                <td className="p-2">{u.isBlocked ? 'Yes' : 'No'}</td>
                <td className="p-2">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


