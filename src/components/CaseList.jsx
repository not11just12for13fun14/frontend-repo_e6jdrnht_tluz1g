import React, { useEffect, useState } from 'react'

export default function CaseList({ refreshKey, onSelect }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameQuery, setUsernameQuery] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadCases = async () => {
    setLoading(true)
    setError('')
    try {
      const query = new URLSearchParams()
      if (usernameQuery) query.append('username', usernameQuery)
      const res = await fetch(`${backend}/api/cases?${query.toString()}`)
      if (!res.ok) throw new Error('Failed to load cases')
      const data = await res.json()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCases() }, [refreshKey])

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <input value={usernameQuery} onChange={(e)=>setUsernameQuery(e.target.value)} placeholder="Filter by username" className="flex-1 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={loadCases} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg">Search</button>
      </div>
      {error && <p className="text-sm text-red-300 mb-2">{error}</p>}
      {loading ? (
        <p className="text-blue-200">Loading...</p>
      ) : (
        <ul className="divide-y divide-slate-700">
          {items.map((it) => (
            <li key={it.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">@{it.username}</p>
                <p className="text-xs text-blue-200/70">Status: {it.status || 'open'}</p>
              </div>
              <button onClick={()=>onSelect && onSelect(it)} className="text-blue-300 hover:text-white underline">Open</button>
            </li>
          ))}
          {items.length === 0 && <li className="py-6 text-blue-200/80 text-center">No cases found</li>}
        </ul>
      )}
    </div>
  )
}
