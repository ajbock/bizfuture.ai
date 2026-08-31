"use client"

import { useState } from "react"
import Link from "next/link"

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    period: "limited time offer",
    description: "Free for a limited time",
    features: [
      "Up to 3 listings per month",
      "Standard search placement",
      "Buyer inquiry form",
      "Email notifications",
      "30 day listing duration",
    ],
    color: "border-[#1e2d45]",
    buttonColor: "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0a0f1e]",
    badge: "Free Now"
  },
  {
    id: "premium",
    name: "Premium",
    price: "$29.99",
    period: "per month",
    description: "For serious sellers",
    features: [
      "Up to 10 listings per month",
      "AI listing description",
      "Featured search placement",
      "Buyer matching alerts",
      "Analytics dashboard",
      "Priority support",
    ],
    color: "border-cyan-400",
    buttonColor: "bg-cyan-400 text-[#0a0f1e] hover:bg-cyan-300",
    badge: "Most Popular"
  },
  {
    id: "broker",
    name: "Broker",
    price: "Free",
    period: "first 4 months",
    description: "Then $99.99/month",
    features: [
      "Unlimited listings",
      "All Premium features",
      "Dedicated broker profile",
      "Lead generation reports",
      "API access",
      "Priority support",
      "Broker badge on listings",
    ],
    color: "border-purple-500/50",
    buttonColor: "border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white",
    badge: "4 Months Free"
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: string) => {
    if (planId === "basic") {
      window.location.href = "/signup"
      return
    }
    if (planId === "broker") {
      window.location.href = "/broker"
      return
    }
    setLoading(planId)
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert("Something went wrong. Please try again.")
    } catch {
      alert("Payment failed. Please try again.")
    }
    setLoading(null)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-16">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <div className="flex items-center gap-4">
            <Link href="/listings" className="text-slate-400 text-sm hover:text-white transition">Browse Listings</Link>
            <Link href="/dashboard" className="text-slate-400 text-sm hover:text-white transition">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-white mb-4">Simple Pricing</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">List your business and reach qualified buyers powered by AI. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div key={plan.id} className={"bg-[#111827] border-2 rounded-2xl p-8 flex flex-col relative " + plan.color}>
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={"text-xs font-black px-4 py-2 rounded-full uppercase tracking-wide " + (plan.badge === "Free Now" ? "bg-green-400 text-[#0a0f1e]" : plan.badge === "4 Months Free" ? "bg-purple-400 text-white" : "bg-cyan-400 text-[#0a0f1e]")}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-black text-white mb-1">{plan.name}</h2>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm ml-2">{plan.period}</span>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="text-cyan-400 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={"w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide transition disabled:opacity-50 " + plan.buttonColor}
              >
                {loading === plan.id ? "Loading..." : plan.id === "basic" ? "Get Started Free" : plan.id === "broker" ? "Apply Free" : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-slate-500 text-sm">
          <p>All plans include SSL security and 24/7 uptime. Cancel anytime.</p>
          <p className="mt-2">Questions? <a href="mailto:info@bizfuture.ai" className="text-cyan-400 hover:underline">info@bizfuture.ai</a></p>
        </div>
      </div>
    </main>
  )
}
