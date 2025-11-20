import React from 'react'

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
          <span className="text-blue-300 font-bold">IA</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Investigation Assistant</h1>
          <p className="text-xs text-blue-200/70">Private case management for authorized teams</p>
        </div>
      </div>
      <div className="text-xs text-blue-200/70">
        Backend URL: <code className="text-blue-300">{import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}</code>
      </div>
    </header>
  )
}
