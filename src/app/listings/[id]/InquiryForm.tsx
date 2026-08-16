"use client"

import { useState } from "react"

export default function InquiryForm({ businessId }: { businessId: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })

  const handle = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const submit = async () => {
    if (!form.name || !form.email) return setError("Name and email are required")
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: businessId, ...form })
      })
      const data = await res.json()
      if (data.success) setSuccess(true)
      else setError(data.error || "Failed to send inquiry")
    } catch {
      setError("Failed to send inquiry. Please try again.")
    }
    setLoading(false)
  }

  if (success) return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
      <div className="text-3xl mb-3"></div>
      <h3 className="text-white font-bold mb-2">Inquiry Sent!</h3>
      <p className="text-slate-400 text-sm">The seller will contact you at {form.email}</p>
    </div>
  )

  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">Send Inquiry</h2>
      {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>)}
      <div className="flex flex-col gap-3">
        <input name="name" value={form.name} onChange={handle} placeholder="Your Name"
          className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm" />
        <input name="email" type="email" value={form.email} onChange={handle} placeholder="Your Email"
          className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm" />
        <input name="phone" value={form.phone} onChange={handle} placeholder="Your Phone"
          className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm" />
        <textarea name="message" value={form.message} onChange={handle}
          placeholder="I am interested in this business..." rows={4}
          className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm" />
        <button onClick={submit} disabled={loading}
          className="bg-cyan-400 text-[#0a0f1e] font-black py-3 rounded-xl text-sm uppercase tracking-wide hover:bg-cyan-300 transition disabled:opacity-50">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  )
}
