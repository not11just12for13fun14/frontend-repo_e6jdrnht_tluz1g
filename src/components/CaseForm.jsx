import React, { useState } from 'react'

export default function CaseForm({ onCreated }) {
  const [username, setUsername] = useState('')
  const [allegations, setAllegations] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [reporterContact, setReporterContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const createCase = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${backend}/api/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          allegations: allegations || null,
          reporter_name: reporterName || null,
          reporter_contact: reporterContact || null
        })
      })
      if (!res.ok) throw new Error('Failed to create case')
      const data = await res.json()
      setUsername('')
      setAllegations('')
      setReporterName('')
      setReporterContact('')
      onCreated && onCreated(data.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={createCase} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5 space-y-4">
      <div>
        <label className="block text-sm text-blue-200/80 mb-1">Instagram Username</label>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} required placeholder="e.g. johndoe" className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm text-blue-200/80 mb-1">Allegations (optional)</label>
        <textarea value={allegations} onChange={(e)=>setAllegations(e.target.value)} placeholder="Describe the suspected behavior" className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-blue-200/80 mb-1">Reporter Name (with consent)</label>
          <input value={reporterName} onChange={(e)=>setReporterName(e.target.value)} placeholder="Optional" className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-blue-200/80 mb-1">Reporter Contact (with consent)</label>
          <input value={reporterContact} onChange={(e)=>setReporterContact(e.target.value)} placeholder="Optional" className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        {error && <span className="text-sm text-red-300">{error}</span>}
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg transition-colors">
          {loading ? 'Creating...' : 'Create Case'}
        </button>
      </div>
    </form>
  )
}
