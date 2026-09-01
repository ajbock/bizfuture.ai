"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
const industries = ["Agriculture","Automotive","Beauty","Building & Construction","Communication & Media","Financial Services","Health Care & Fitness","Manufacturing","Office","Other","Pet Services","Restaurants & Food","Retail","Service","Technology & Website","Transportation & Storage","Travel","Wholesale & Distributors"]

export default function BuyerRegistrationPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    budget_min: "", budget_max: "",
    buyer_type: "individual",
    financing_prequalified: false,
    industries: [] as string[],
    preferred_states: [] as string[],
    liquid_assets: "",
    non_liquid_assets: "",
    loan_approved_amount: "",
    seeking_seller_financing: false,
  })

  const handle = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }))
  }

  const toggleIndustry = (industry: string) => {
    setForm(f => ({
      ...f,
      industries: f.industries.includes(industry)
        ? f.industries.filter(i => i !== industry)
        : [...f.industries, industry]
    }))
  }

  const toggleState = (state: string) => {
    setForm(f => ({
      ...f,
      preferred_states: f.preferred_states.includes(state)
        ? f.preferred_states.filter(s => s !== state)
        : [...f.preferred_states, state]
    }))
  }

  const submit = async () => {
    if (!form.name || !form.email) return setError("Name and email are required")
    setLoading(true)
    setError("")
    const { error } = await supabase.from("buyers").insert([{
      name: form.name,
      email: form.email,
      phone: form.phone,
      budget_min: form.budget_min ? Number(form.budget_min.replace(/,/g, "")) : null,
      budget_max: form.budget_max ? Number(form.budget_max.replace(/,/g, "")) : null,
      buyer_type: form.buyer_type,
      financing_prequalified: form.financing_prequalified,
      industries: form.industries,
      preferred_states: form.preferred_states,
      liquid_assets: form.liquid_assets ? Number(form.liquid_assets.replace(/,/g, "")) : null,
      non_liquid_assets: form.non_liquid_assets ? Number(form.non_liquid_assets.replace(/,/g, "")) : null,
      loan_approved_amount: form.loan_approved_amount ? Number(form.loan_approved_amount.replace(/,/g, "")) : null,
      seeking_seller_financing: form.seeking_seller_financing,
    }])
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true); setLoading(false) }
  }

  const inputClass = "w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2"
  const sectionClass = "bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-6"

  if (success) return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-black text-white mb-4">You are registered!</h1>
        <p className="text-slate-400 mb-8">We will notify you when businesses matching your criteria are listed.</p>
        <Link href="/listings" className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">
          Browse Listings Now
        </Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <Link href="/listings" className="text-slate-400 text-sm hover:text-white transition">Browse Listings</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-black text-white mb-2">Register as a Buyer</h1>
        <p className="text-slate-400 text-sm mb-8">Tell us what you are looking for and we will match you with businesses for sale</p>

        {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>)}

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className={labelClass}>Full Name *</label><input name="name" value={form.name} onChange={handle} placeholder="John Smith" className={inputClass} /></div>
            <div><label className={labelClass}>Email *</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="john@email.com" className={inputClass} /></div>
            <div><label className={labelClass}>Phone</label><input name="phone" value={form.phone} onChange={handle} placeholder="555-123-4567" className={inputClass} /></div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Buyer Type</h2>
          <div className="flex gap-3 flex-wrap">
            {["individual","investor","broker","corporation"].map(type => (
              <button key={type} type="button" onClick={() => setForm(f => ({ ...f, buyer_type: type }))}
                className={"px-4 py-2 rounded-full text-sm font-bold border transition capitalize " + (form.buyer_type === type ? "bg-cyan-400 text-[#0a0f1e] border-cyan-400" : "border-[#1e2d45] text-slate-400 hover:border-cyan-400")}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Budget Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Minimum Budget ($USD)</label><input name="budget_min" value={form.budget_min} onChange={handle} placeholder="e.g. 100,000" className={inputClass} /></div>
            <div><label className={labelClass}>Maximum Budget ($USD)</label><input name="budget_max" value={form.budget_max} onChange={handle} placeholder="e.g. 500,000" className={inputClass} /></div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Financial Qualification</h2>
          <p className="text-slate-400 text-xs mb-4">This helps us match you with listings that fit your financial profile. All information is kept private.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Liquid Assets — Cash + Stocks ($USD)</label>
              <input name="liquid_assets" value={form.liquid_assets} onChange={handle} placeholder="e.g. 150,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Non-Liquid Assets — Real Estate ($USD)</label>
              <input name="non_liquid_assets" value={form.non_liquid_assets} onChange={handle} placeholder="e.g. 500,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Business Loan Pre-Approved Amount ($USD)</label>
              <input name="loan_approved_amount" value={form.loan_approved_amount} onChange={handle} placeholder="e.g. 400,000" className={inputClass} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="financing_prequalified" checked={form.financing_prequalified} onChange={handle} className="w-4 h-4 accent-cyan-400" />
              <span className="text-sm text-slate-300">I am pre-qualified for SBA or bank financing</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="seeking_seller_financing" checked={form.seeking_seller_financing} onChange={handle} className="w-4 h-4 accent-cyan-400" />
              <span className="text-sm text-slate-300">I am seeking seller financing</span>
            </label>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Industries of Interest</h2>
          <p className="text-slate-400 text-xs mb-4">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {industries.map(industry => (
              <button key={industry} type="button" onClick={() => toggleIndustry(industry)}
                className={"px-3 py-2 rounded-xl text-xs font-bold border transition " + (form.industries.includes(industry) ? "bg-cyan-400 text-[#0a0f1e] border-cyan-400" : "border-[#1e2d45] text-slate-400 hover:border-cyan-400")}>
                {industry}
              </button>
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Preferred States</h2>
          <p className="text-slate-400 text-xs mb-4">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {states.map(state => (
              <button key={state} type="button" onClick={() => toggleState(state)}
                className={"px-3 py-2 rounded-xl text-xs font-bold border transition " + (form.preferred_states.includes(state) ? "bg-cyan-400 text-[#0a0f1e] border-cyan-400" : "border-[#1e2d45] text-slate-400 hover:border-cyan-400")}>
                {state}
              </button>
            ))}
          </div>
        </div>

        <button onClick={submit} disabled={loading}
          className="w-full bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-cyan-300 transition disabled:opacity-50">
          {loading ? "Registering..." : "Register as Buyer"}
        </button>
      </div>
    </main>
  )
}
