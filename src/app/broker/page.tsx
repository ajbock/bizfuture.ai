"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function BrokerSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    license_number: "", states_licensed: [] as string[],
    website: "", bio: ""
  })

  const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]

  const handle = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const toggleState = (state: string) => {
    setForm(f => ({
      ...f,
      states_licensed: f.states_licensed.includes(state)
        ? f.states_licensed.filter(s => s !== state)
        : [...f.states_licensed, state]
    }))
  }

  const submit = async () => {
    if (!form.name || !form.email || !form.company) return setError("Name, email and company are required")
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.from("brokers").insert([{
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      license_number: form.license_number,
      states_licensed: form.states_licensed,
      website: form.website,
      bio: form.bio,
      status: "pending"
    }])

    if (error) {
      if (error.message.includes("does not exist")) {
        setError("Broker table not set up yet. Please run the SQL setup first.")
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      router.push("/broker/success")
    }
  }

  const inputClass = "w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2"
  const sectionClass = "bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-6"

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <Link href="/listings" className="text-slate-400 text-sm hover:text-white transition">Browse Listings</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
            <span className="text-purple-400 text-sm font-bold uppercase tracking-wide">Broker Program</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Join As A Broker</h1>
          <p className="text-slate-400 max-w-lg mx-auto">List unlimited businesses, reach AI-powered buyers and grow your practice with BizFuture.ai</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Up to 20 listings", icon: "📋" },
            { label: "AI buyer matching", icon: "🤖" },
            { label: "4 Months Free", icon: "💰" },
          ].map(({ label, icon }) => (
            <div key={label} className="bg-[#111827] border border-purple-500/20 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-white text-sm font-bold">{label}</div>
            </div>
          ))}
        </div>

        {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>)}

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Full Name *</label><input name="name" value={form.name} onChange={handle} placeholder="John Smith" className={inputClass} /></div>
            <div><label className={labelClass}>Email *</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="john@brokerage.com" className={inputClass} /></div>
            <div><label className={labelClass}>Phone</label><input name="phone" value={form.phone} onChange={handle} placeholder="555-123-4567" className={inputClass} /></div>
            <div><label className={labelClass}>Website</label><input name="website" value={form.website} onChange={handle} placeholder="www.yourbrokerage.com" className={inputClass} /></div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Brokerage Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Company Name *</label><input name="company" value={form.company} onChange={handle} placeholder="Smith Business Brokers" className={inputClass} /></div>
            <div><label className={labelClass}>License Number</label><input name="license_number" value={form.license_number} onChange={handle} placeholder="BRK-12345" className={inputClass} /></div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handle} rows={3}
              placeholder="Tell buyers about your experience and specialties..."
              className={inputClass} />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">States Licensed In</h2>
          <p className="text-slate-400 text-xs mb-4">Select all states where you are licensed to broker businesses</p>
          <div className="flex flex-wrap gap-2">
            {states.map(state => (
              <button key={state} type="button" onClick={() => toggleState(state)}
                className={"px-3 py-2 rounded-xl text-xs font-bold border transition " + (form.states_licensed.includes(state) ? "bg-purple-400 text-white border-purple-400" : "border-[#1e2d45] text-slate-400 hover:border-purple-400")}>
                {state}
              </button>
            ))}
          </div>
        </div>

        <button onClick={submit} disabled={loading}
          className="w-full bg-purple-500 text-white font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-purple-400 transition disabled:opacity-50">
          {loading ? "Submitting..." : "Apply to Broker Program"}
        </button>

        <p className="text-center text-slate-500 text-xs mt-4">
          After approval you will be contacted to set up your Free for 4 months subscription
        </p>
      </div>
    </main>
  )
}
