import React, { useState } from 'react'
import Header from './components/Header'
import CaseForm from './components/CaseForm'
import CaseList from './components/CaseList'
import CaseDetail from './components/CaseDetail'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selected, setSelected] = useState(null)

  const onCreated = (id) => {
    setRefreshKey((k) => k + 1)
  }

  const onUpdated = () => setRefreshKey((k)=>k+1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.08),transparent_40%)]" />
      <div className="relative max-w-6xl mx-auto p-6">
        <Header />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <CaseForm onCreated={onCreated} />
            <CaseList refreshKey={refreshKey} onSelect={setSelected} />
          </div>
          <div className="lg:col-span-2">
            {selected ? (
              <CaseDetail caseItem={selected} onUpdated={onUpdated} />
            ) : (
              <div className="h-full min-h-[300px] flex items-center justify-center bg-slate-800/60 border border-blue-500/20 rounded-xl">
                <p className="text-blue-200/80">Select a case to view details</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-blue-200/60">
          Built for compliant investigations. Public info only. Use with consent and follow platform policies.
        </div>
      </div>
    </div>
  )
}

export default App
