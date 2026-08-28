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
  { name: "Other", count: 20 },
]

const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]

export default function AdminPage() {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const addLog = (msg: string) => setLog(prev => [...prev, msg])

  const generate = async () => {
    setGenerating(true)
    setProgress(0)
    setLog([])
    setDone(false)

    let generated = 0
    const totalTarget = industries.reduce((sum, i) => sum + i.count, 0)
    setTotal(totalTarget)

    for (const industry of industries) {
      addLog(`Generating ${industry.count} ${industry.name} listings...`)

      for (let i = 0; i < industry.count; i++) {
        const state = states[Math.floor(Math.random() * states.length)]

        try {
          const res = await fetch("/api/generate-seed-listing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ industry: industry.name, state })
          })

          const data = await res.json()
          if (data.success) {
            generated++
            setProgress(generated)
          } else {
            addLog(`Error: ${data.error}`)
          }
        } catch (err) {
          addLog(`Failed for ${industry.name} in ${state}`)
        }

        await new Promise(r => setTimeout(r, 500))
      }

      addLog(`✅ Completed ${industry.name}`)
    }

    addLog(`🎉 Done! Generated ${generated} listings`)
    setDone(true)
    setGenerating(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Seed Listing Generator</h1>
            <p className="text-slate-400 text-sm">Generate 500 realistic business listings across all industries and states</p>
          </div>
          <Link href="/dashboard" className="text-slate-400 text-sm hover:text-white">Dashboard</Link>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Generation Plan</h2>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {industries.map(ind => (
              <div key={ind.name} className="flex items-center justify-between bg-[#0a0f1e] rounded-xl px-4 py-2">
                <span className="text-slate-300 text-sm">{ind.name}</span>
                <span className="text-cyan-400 font-bold text-sm">{ind.count}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm border-t border-[#1e2d45] pt-4">
            <span className="text-slate-400">Total listings to generate</span>
            <span className="text-cyan-400 font-black text-xl">{industries.reduce((s, i) => s + i.count, 0)}</span>
          </div>
        </div>

        {generating && (
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">Progress</h2>
              <span className="text-cyan-400 font-bold">{progress}/{total}</span>
            </div>
            <div className="w-full bg-[#0a0f1e] rounded-full h-3 mb-4">
              <div
                className="bg-cyan-400 h-3 rounded-full transition-all duration-300"
                style={{ width: total > 0 ? (progress / total * 100) + "%" : "0%" }}
              />
            </div>
            <div className="bg-[#0a0f1e] rounded-xl p-4 max-h-48 overflow-y-auto">
              {log.map((line, i) => (
                <div key={i} className="text-slate-400 text-xs py-1 border-b border-[#1e2d45] last:border-0">{line}</div>
              ))}
            </div>
          </div>
        )}

        {done && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-white font-bold mb-2">Generation Complete!</h3>
            <p className="text-slate-400 text-sm mb-4">500 listings have been added to BizFuture.ai</p>
            <Link href="/listings" className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">
              View Listings
            </Link>
          </div>
        )}

        {!generating && !done && (
          <button
            onClick={generate}
            className="w-full bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-cyan-300 transition"
          >
            Generate 500 Listings
          </button>
        )}

        {done && (
          <button
            onClick={generate}
            className="w-full border border-cyan-400 text-cyan-400 font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-cyan-400 hover:text-[#0a0f1e] transition mt-4"
          >
            Generate More
          </button>
        )}
      </div>
    </main>
  )
}
