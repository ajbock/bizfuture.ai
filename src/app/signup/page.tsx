"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "seller"
  })

  const handle = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const submit = async () => {
    if (!form.email || !form.password || !form.name) return setError("All fields are required")
    if (form.password.length < 6) return setError("Password must be at least 6 characters")
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, role: form.role }
      }
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
          <h1 className="text-xl font-bold text-white mt-4 mb-2">Create Your Account</h1>
          <p className="text-slate-400 text-sm">Join the AI-native business marketplace</p>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8">
          {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>)}

          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="John Smith" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="john@email.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>I am a</label>
              <div className="flex gap-3">
                {["seller", "buyer", "broker"].map(role => (
                  <button key={role} type="button" onClick={() => setForm(f => ({ ...f, role }))}
                    className={"flex-1 py-2 rounded-xl text-sm font-bold border transition capitalize " + (form.role === role ? "bg-cyan-400 text-[#0a0f1e] border-cyan-400" : "border-[#1e2d45] text-slate-400 hover:border-cyan-400")}>
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={submit} disabled={loading}
              className="w-full bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-xl text-sm uppercase tracking-wide hover:bg-cyan-300 transition disabled:opacity-50 mt-2">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
