"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"

export default function AdminBrokersClient() {
  const [brokers, setBrokers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from("brokers")
      .select("*")
      .order("created_at", { ascending: false })
    setBrokers(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const setStatus = async (id: string, status: string) => {
    setBusyId(id)
    const supabase = createClient()
    await supabase.from("brokers").update({ status }).eq("id", id)
    setBrokers(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    setBusyId(null)
  }

  const remove = async (id: string) => {
    if (!confirm("Permanently delete this broker profile? This cannot be undone.")) return
    setBusyId(id)
    const supabase = createClient()
    await supabase.from("brokers").delete().eq("id", id)
    setBrokers(prev => prev.filter(b => b.id !== id))
    setBusyId(null)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Broker Directory Moderation</h1>
            <p className="text-slate-400 text-sm">Broker profiles publish instantly on signup — review and remove bad actors here</p>
          </div>
          <Link href="/dashboard" className="text-slate-400 text-sm hover:text-white">Dashboard</Link>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading brokers...</p>
        ) : brokers.length === 0 ? (
          <p className="text-slate-400 text-sm">No brokers yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {brokers.map(b => (
              <div key={b.id} className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {b.profile_photo_url ? (
                    <img src={b.profile_photo_url} alt={b.name} className="h-12 w-12 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-[#1e2d45] flex items-center justify-center text-slate-400 font-bold shrink-0">
                      {b.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-white font-bold text-sm truncate">
                      {b.name}
                      {b.credentials && <span className="text-slate-400 font-normal">, {b.credentials}</span>}
                    </div>
                    <div className="text-slate-500 text-xs truncate">{b.company}</div>
                    <div className="text-slate-500 text-xs truncate">{b.email} {b.phone ? "· " + b.phone : ""}</div>
                    {b.areas_served?.length > 0 && (
                      <div className="text-slate-600 text-xs truncate">📍 {b.areas_served.join(", ")}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={"px-3 py-1 rounded-full text-xs font-bold " +
                    (b.status === "approved" ? "bg-green-500/10 text-green-400" :
                     b.status === "suspended" ? "bg-red-500/10 text-red-400" :
                     "bg-slate-500/10 text-slate-400")}>
                    {b.status}
                  </span>
                  {b.profile_slug && (
                    <Link href={`/brokers/${b.profile_slug}`} target="_blank"
                      className="bg-[#0a0f1e] border border-[#1e2d45] text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition px-3 py-2 rounded-xl text-xs font-bold">
                      View
                    </Link>
                  )}
                  {b.status !== "suspended" ? (
                    <button onClick={() => setStatus(b.id, "suspended")} disabled={busyId === b.id}
                      className="bg-[#0a0f1e] border border-[#1e2d45] text-red-400 hover:border-red-400 transition px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
                      Suspend
                    </button>
                  ) : (
                    <button onClick={() => setStatus(b.id, "approved")} disabled={busyId === b.id}
                      className="bg-[#0a0f1e] border border-[#1e2d45] text-green-400 hover:border-green-400 transition px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
                      Reinstate
                    </button>
                  )}
                  <button onClick={() => remove(b.id)} disabled={busyId === b.id}
                    className="bg-[#0a0f1e] border border-[#1e2d45] text-slate-500 hover:border-red-500 hover:text-red-500 transition px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}