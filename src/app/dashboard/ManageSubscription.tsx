"use client"

import { useState } from "react"

export default function ManageSubscription() {
  const [loading, setLoading] = useState(false)

  const openPortal = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: "auto" })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert("Unable to open billing portal. Please contact info@bizfuture.ai")
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold mb-1">Manage Subscription</h3>
          <p className="text-slate-400 text-sm">Update payment method, view invoices or cancel</p>
        </div>
        <button onClick={openPortal} disabled={loading}
          className="bg-[#0a0f1e] border border-[#1e2d45] text-slate-300 font-bold px-6 py-3 rounded-full text-sm hover:border-cyan-400 hover:text-white transition disabled:opacity-50">
          {loading ? "Loading..." : "Manage Billing"}
        </button>
      </div>
    </div>
  )
}
