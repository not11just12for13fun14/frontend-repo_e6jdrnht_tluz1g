import React, { useEffect, useState } from 'react'

export default function CaseDetail({ caseItem, onUpdated }) {
  const [status, setStatus] = useState(caseItem?.status || 'open')
  const [notes, setNotes] = useState(caseItem?.notes || '')
  const [riskScore, setRiskScore] = useState(caseItem?.risk_score || '')
  const [evidence, setEvidence] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadEvidence = async () => {
    try {
      const res = await fetch(`${backend}/api/cases/${caseItem.id}/evidence`)
      const data = await res.json()
      setEvidence(data)
    } catch {}
  }

  useEffect(() => {
    if (caseItem?.id) loadEvidence()
  }, [caseItem?.id])

  const save = async () => {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch(`${backend}/api/cases/${caseItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status || undefined,
          notes: notes || undefined,
          risk_score: riskScore === '' ? undefined : Number(riskScore)
        })
      })
      if (!res.ok) throw new Error('Update failed')
      onUpdated && onUpdated()
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const addEvidence = async (type, url, description) => {
    try {
      const res = await fetch(`${backend}/api/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseItem.id, type, url: url || null, description: description || null })
      })
      if (res.ok) loadEvidence()
    } catch {}
  }

  const handleAddEvidence = (e) => {
    e.preventDefault()
    const form = e.target
    addEvidence(form.type.value, form.url.value, form.description.value)
    form.reset()
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5 space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-blue-200/80 mb-1">Status</label>
          <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white">
            <option value="open">open</option>
            <option value="in_review">in_review</option>
            <option value="closed">closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200/80 mb-1">Risk Score (0-100)</label>
          <input type="number" min="0" max="100" value={riskScore} onChange={(e)=>setRiskScore(e.target.value)} className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-blue-200/80 mb-1">Notes</label>
        <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} rows={4} className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" />
      </div>
      <div className="flex items-center gap-3">
        {err && <span className="text-sm text-red-300">{err}</span>}
        <button onClick={save} disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg">{loading ? 'Saving...' : 'Save'}</button>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <h3 className="text-white font-semibold mb-2">Evidence</h3>
        <form onSubmit={handleAddEvidence} className="grid sm:grid-cols-4 gap-2 mb-3">
          <select name="type" className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white">
            <option value="screenshot">screenshot</option>
            <option value="link">link</option>
            <option value="payment_proof">payment_proof</option>
            <option value="chat_log">chat_log</option>
            <option value="other">other</option>
          </select>
          <input name="url" placeholder="URL (optional)" className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" />
          <input name="description" placeholder="Description (optional)" className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" />
          <button className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-3 py-2">Add</button>
        </form>
        <ul className="space-y-2">
          {evidence.map(ev => (
            <li key={ev.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
              <p className="text-white text-sm"><span className="font-semibold">{ev.type}</span> {ev.url && (<a href={ev.url} className="text-blue-300 underline ml-2" target="_blank" rel="noreferrer">view</a>)} </p>
              {ev.description && <p className="text-blue-200/80 text-xs mt-1">{ev.description}</p>}
            </li>
          ))}
          {evidence.length === 0 && <li className="text-blue-200/70 text-sm">No evidence yet</li>}
        </ul>
      </div>
    </div>
  )
}
