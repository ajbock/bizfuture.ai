"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import BrokerCard from "@/components/brokers/BrokerCard"
import BrokerFilterBar, { BrokerFilters } from "@/components/brokers/BrokerFilterBar"
import { createClient } from "@/lib/supabase-browser"

export default function BrokersDirectoryPage() {
  const [brokers, setBrokers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async (f: BrokerFilters) => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from("brokers").select("*").eq("status", "approved")

    if (f.keyword) {
      const kw = f.keyword.replace(/[%,]/g, "")
      query = query.or(`name.ilike.%${kw}%,company.ilike.%${kw}%,tagline.ilike.%${kw}%`)
    }
    if (f.county) query = query.contains("areas_served", [f.county])
    if (f.language) query = query.contains("languages", [f.language])

    query = query.order("created_at", { ascending: false })

    const { data } = await query
    setBrokers(data || [])
    setLoading(false)
  }

  useEffect(() => { load({}) }, [])

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <div className="flex items-center gap-4">
            <Link href="/listings" className="text-slate-400 text-sm hover:text-white transition">Browse Listings</Link>
            <Link href="/broker" className="bg-cyan-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">Join as a Broker</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-black text-white mb-2">Broker Directory</h1>
        <p className="text-slate-400 text-sm mb-8">Find a business broker to help you buy or sell</p>

        <BrokerFilterBar onChange={load} />

        {loading ? (
          <p className="text-slate-400 text-sm">Loading brokers...</p>
        ) : brokers.length === 0 ? (
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-12 text-center">
            <h3 className="text-white font-bold mb-2">No brokers match your filters</h3>
            <p className="text-slate-400 text-sm">Try clearing a filter, or check back soon as more brokers join.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {brokers.map(b => <BrokerCard key={b.id} broker={b} />)}
          </div>
        )}
      </div>
    </main>
  )
}