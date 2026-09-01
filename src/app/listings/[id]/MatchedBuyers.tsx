"use client"
// Broker only feature

import { useState } from "react"

export default function MatchedBuyers({ businessId }: { businessId: string }) {
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<any[]>([])
  const [count, setCount] = useState<number | null>(null)

  const findMatches = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/match-buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: businessId })
      })
      const data = await res.json()
      setMatches(data.matches || [])
      setCount(data.count)
    } catch {
      setCount(0)
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#111827] border border-purple-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Matched Buyers</h2>
        <button
          onClick={findMatches}
          disabled={loading}
          className="bg-purple-500/20 border border-purple-500/40 text-purple-400 hover:bg-purple-500/30 transition px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide disabled:opacity-50"
        >
          {loading ? "Searching..." : "Find Matching Buyers"}
        </button>
      </div>

      {count === null && (
        <p className="text-slate-500 text-sm">Click to find registered buyers matching this listing.</p>
      )}

      {count === 0 && (
        <p className="text-slate-500 text-sm">No matching buyers found yet. Share this listing to attract buyers!</p>
      )}

      {count !== null && count > 0 && (
        <div>
          <p className="text-green-400 text-sm font-bold mb-4">{count} matched buyer{count !== 1 ? "s" : ""} found!</p>
          <div className="flex flex-col gap-3">
            {matches.map((buyer, i) => (
              <div key={i} className="bg-[#0a0f1e] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">{buyer.name}</div>
                  <div className="text-slate-400 text-xs">{buyer.email}</div>
                </div>
                <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1 rounded-full capitalize">
                  {buyer.buyer_type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
