"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    if (!email) return setError("Email is required")
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://bizfuture.ai/update-password"
    })
    if (error) { setError(error.message); setLoading(false) }
    else setSent(true)
  }

  const inputClass = "w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"

  if (sent) return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">📧</div>
        <h1 className="text-2xl font-black text-white mb-4">Check Your Email</h1>
        <p className="text-slate-400 mb-6">We sent a password reset link to {email}</p>
        <Link href="/login" className="text-cyan-400 hover:underline text-sm">Back to Sign In</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-white">
            Biz<span className="text-cyan-400">Future</span>.ai
          </Link>
          <h1 className="text-xl font-bold text-white mt-4 mb-2">Reset Password</h1>
          <p className="text-slate-400 text-sm">Enter your email and we will send a reset link</p>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8">
          {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>)}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" className={inputClass} />
            </div>
            <button onClick={submit} disabled={loading}
              className="w-full bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-xl text-sm uppercase tracking-wide hover:bg-cyan-300 transition disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            Remember it? <Link href="/login" className="text-cyan-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
