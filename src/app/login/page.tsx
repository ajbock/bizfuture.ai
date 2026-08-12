"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  const handle = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const submit = async () => {
    if (!form.email || !form.password) return setError("Email and password required")
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) { setError(error.message); setLoading(false) }
    else router.push("/dashboard")
  }

  const inputClass = "w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2"

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-white">
            Biz<span className="text-cyan-400">Future</span>.ai
          </Link>
          <h1 className="text-xl font-bold text-white mt-4 mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8">
          {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>)}

          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="john@email.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Your password" className={inputClass} />
            </div>

            <button onClick={submit} disabled={loading}
              className="w-full bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-xl text-sm uppercase tracking-wide hover:bg-cyan-300 transition disabled:opacity-50 mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            No account yet?{" "}
            <Link href="/signup" className="text-cyan-400 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
