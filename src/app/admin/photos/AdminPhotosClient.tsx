"use client"

import { useState } from "react"
import Link from "next/link"

const industries = [
  { name: "Restaurants & Food", count: 80 },
  { name: "Retail", count: 60 },
  { name: "Service", count: 70 },
  { name: "Health Care & Fitness", count: 40 },
  { name: "Automotive", count: 40 },
  { name: "Technology & Website", count: 30 },
  { name: "Building & Construction", count: 30 },
  { name: "Manufacturing", count: 30 },
  { name: "Pet Services", count: 20 },
  { name: "Beauty", count: 20 },
  { name: "Financial Services", count: 20 },
  { name: "Transportation & Storage", count: 20 },
  { name: "Wholesale & Distributors", count: 20 },
  { name: "Agriculture", count: 20 },
  { name: "Other", count: 20 },
]

export default function AdminPhotosClient() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [allRunning, setAllRunning] = useState(false)

  const assignPhotos = async (industry: string) => {
    setLoading(industry)
    try {
      const res = await fetch("/api/assign-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, limit: 100 })
      })
      const data = await res.json()
      setResults(prev => [...prev, { industry, ...data }])
    } catch {
      setResults(prev => [...prev, { industry, error: "Failed" }])
    }
    setLoading(null)
  }

  const assignAll = async () => {
    setAllRunning(true)
    setResults([])
    for (const ind of industries) {
      await assignPhotos(ind.name)
      await new Promise(r => setTimeout(r, 1000))
    }
    setAllRunning(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Photo Assignment</h1>
            <p className="text-slate-400 text-sm">Assign relevant Unsplash photos to listings by industry</p>
          </div>
          <Link href="/dashboard" className="text-slate-400 text-sm hover:text-white">Dashboard</Link>
        </div>

        <button onClick={assignAll} disabled={allRunning}
          className="w-full bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-cyan-300 transition disabled:opacity-50 mb-8">
          {allRunning ? "Assigning Photos..." : "Assign Photos To All Industries"}
        </button>

        <div className="flex flex-col gap-3 mb-8">
          {industries.map(ind => {
            const result = results.find(r => r.industry === ind.name)
            return (
              <div key={ind.name} className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-sm">{ind.name}</div>
                  <div className="text-slate-500 text-xs">{ind.count} listings</div>
                </div>
                <div className="flex items-center gap-3">
                  {result && (
                    <span className="text-green-400 text-xs font-bold">{result.updated} updated</span>
                  )}
                  <button onClick={() => assignPhotos(ind.name)} disabled={loading === ind.name || allRunning}
                    className="bg-[#0a0f1e] border border-[#1e2d45] text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
                    {loading === ind.name ? "Working..." : "Assign Photos"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {results.length > 0 && (
          <div className="bg-[#111827] border border-green-500/30 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-3">Results</h2>
            {results.map((r, i) => (
              <div key={i} className="text-sm text-slate-400 py-1 border-b border-[#1e2d45] last:border-0">
                {r.industry}: <span className="text-green-400 font-bold">{r.updated} photos assigned</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}