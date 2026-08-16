"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { use } from "react"

const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
const industries = ["Agriculture","Automotive","Beauty","Building & Construction","Communication & Media","Financial Services","Health Care & Fitness","Manufacturing","Office","Other","Pet Services","Restaurants & Food","Retail","Service","Technology & Website","Transportation & Storage","Travel","Wholesale & Distributors"]

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .single()
      if (data) setForm(data)
      setLoading(false)
    }
    load()
  }, [id])

  const handle = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm((f: any) => ({ ...f, [name]: type === "checkbox" ? checked : value }))
  }

  const save = async () => {
    setSaving(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase
      .from("businesses")
      .update({
        title: form.title,
        description: form.description,
        asking_price: form.asking_price ? Number(String(form.asking_price).replace(/,/g, "")) : null,
        cash_flow: form.cash_flow ? Number(String(form.cash_flow).replace(/,/g, "")) : null,
        annual_revenue: form.annual_revenue ? Number(String(form.annual_revenue).replace(/,/g, "")) : null,
        industry: form.industry,
        city: form.city,
        county: form.county,
        state: form.state,
        phone: form.phone,
        email: form.email,
        website: form.website,
        status: form.status,
        financing_available: form.financing_available,
        training_available: form.training_available,
      })
      .eq("id", id)

    if (error) { setError(error.message); setSaving(false) }
    else router.push("/dashboard")
  }

  const markSold = async () => {
    if (!confirm("Mark this listing as sold?")) return
    const supabase = createClient()
    await supabase.from("businesses").update({ status: "sold" }).eq("id", id)
    router.push("/dashboard")
  }

  const inputClass = "w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2"
  const sectionClass = "bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-6"

  if (loading) return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="text-cyan-400 text-lg font-bold">Loading...</div>
    </main>
  )

  if (!form) return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="text-red-400">Listing not found</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <Link href="/dashboard" className="text-slate-400 text-sm hover:text-white transition">Back to Dashboard</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Edit Listing</h1>
            <p className="text-slate-400 text-sm">Update your business listing details</p>
          </div>
          <button onClick={markSold}
            className="bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition px-4 py-2 rounded-xl text-sm font-bold">
            Mark as Sold
          </button>
        </div>

        {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>)}

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Status</h2>
          <div className="flex gap-3">
            {["active", "pending", "sold"].map(s => (
              <button key={s} type="button" onClick={() => setForm((f: any) => ({ ...f, status: s }))}
                className={"px-4 py-2 rounded-full text-sm font-bold border transition capitalize " + (form.status === s ? "bg-cyan-400 text-[#0a0f1e] border-cyan-400" : "border-[#1e2d45] text-slate-400 hover:border-cyan-400")}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Ad Summary</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Business Title</label>
              <input name="title" value={form.title || ""} onChange={handle} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <select name="industry" value={form.industry || ""} onChange={handle} className={inputClass}>
                <option value="">Select Industry</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Asking Price ($USD)</label>
              <input name="asking_price" value={form.asking_price || ""} onChange={handle} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={form.description || ""} onChange={handle} rows={6} className={inputClass} />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Financial Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Cash Flow ($USD)</label><input name="cash_flow" value={form.cash_flow || ""} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>Gross Revenue ($USD)</label><input name="annual_revenue" value={form.annual_revenue || ""} onChange={handle} className={inputClass} /></div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className={labelClass}>City</label><input name="city" value={form.city || ""} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>County</label><input name="county" value={form.county || ""} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>State</label>
              <select name="state" value={form.state || ""} onChange={handle} className={inputClass}>
                <option value="">Select State</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className={labelClass}>Phone</label><input name="phone" value={form.phone || ""} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>Email</label><input name="email" value={form.email || ""} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>Website</label><input name="website" value={form.website || ""} onChange={handle} className={inputClass} /></div>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={save} disabled={saving}
            className="flex-1 bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-cyan-300 transition disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/dashboard"
            className="px-8 py-4 border border-[#1e2d45] text-slate-400 rounded-2xl font-bold hover:border-cyan-400 hover:text-white transition text-center">
            Cancel
          </Link>
        </div>
      </div>
    </main>
  )
}
