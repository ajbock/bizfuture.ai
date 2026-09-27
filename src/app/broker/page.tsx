"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CA_COUNTIES, BROKER_LANGUAGES, slugify } from "@/lib/constants/broker-options"

export default function BrokerSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [autofillUrl, setAutofillUrl] = useState("")
  const [autofillLoading, setAutofillLoading] = useState(false)
  const [autofillNote, setAutofillNote] = useState("")
  const [photoUploading, setPhotoUploading] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", company: "",
    license_number: "", states_licensed: [] as string[],
    website: "", bio: "",
    credentials: "", tagline: "", profile_photo_url: "",
    languages: [] as string[], areas_served: [] as string[]
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

  const toggleLanguage = (lang: string) => {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter(l => l !== lang)
        : [...f.languages, lang]
    }))
  }

  const toggleArea = (county: string) => {
    setForm(f => ({
      ...f,
      areas_served: f.areas_served.includes(county)
        ? f.areas_served.filter(c => c !== county)
        : [...f.areas_served, county]
    }))
  }

  const runAutofill = async () => {
    if (!autofillUrl) return
    setAutofillLoading(true)
    setAutofillNote("")
    try {
      const res = await fetch("/api/brokers/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: autofillUrl })
      })
      const data = await res.json()
      if (data.error) {
        setAutofillNote(data.error)
      } else if (data.draft) {
        setForm(f => ({
          ...f,
          name: data.draft.name || f.name,
          phone: data.draft.phone || f.phone,
          bio: data.draft.about || f.bio,
          profile_photo_url: data.draft.profile_photo_url || f.profile_photo_url
        }))
        setAutofillNote(data.note || "Draft loaded — please review every field below before submitting.")
      }
    } catch (err) {
      setAutofillNote("Couldn't read that page automatically. Enter your details manually below.")
    }
    setAutofillLoading(false)
  }

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url) {
        setForm(f => ({ ...f, profile_photo_url: data.url }))
      } else {
        setError(data.error || "Photo upload failed")
      }
    } catch (err) {
      setError("Photo upload failed")
    }
    setPhotoUploading(false)
  }

  const submit = async () => {
    if (!form.name || !form.email || !form.company) return setError("Name, email and company are required")
    if (!form.password || form.password.length < 6) return setError("Please choose a password (min 6 characters) so you can log back in later")
    setLoading(true)
    setError("")

    const supabase = createClient()

    // Always start from a clean slate — if a different account was still
    // logged in from a previous session/test, sign it out first so the
    // new broker's data never gets attached to the wrong account.
    await supabase.auth.signOut()

    // Create a real login account for this broker
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, role: "broker" }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!authData.session) {
      setError("Account created! Please check your email (" + form.email + ") for a confirmation link before logging in to add your listing.")
      setLoading(false)
      return
    }

    // Give them the free, unlimited-listing "directory" tier — separate from the paid "broker" tier
    const { error: userError } = await supabase
      .from("users")
      .upsert({ email: form.email, subscription_tier: "directory" }, { onConflict: "email" })

    if (userError) {
      console.error("Failed to set directory tier:", userError.message)
    }

    // Create their public directory profile
    const profile_slug = slugify(form.name, form.company)
    const { error: brokerError } = await supabase.from("brokers").insert([{
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      license_number: form.license_number,
      states_licensed: form.states_licensed,
      website: form.website,
      bio: form.bio,
      credentials: form.credentials,
      tagline: form.tagline,
      profile_photo_url: form.profile_photo_url,
      languages: form.languages,
      areas_served: form.areas_served,
      profile_slug,
      status: "approved"
    }])

    if (brokerError) {
      if (brokerError.message.includes("does not exist")) {
        setError("Broker table not set up yet. Please run the SQL setup first.")
      } else {
        setError(brokerError.message)
      }
      setLoading(false)
    } else {
      router.push("/listings/new")
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
            <span className="text-purple-400 text-sm font-bold uppercase tracking-wide">Broker Program – AI Enabled</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Join our New Broker Directory</h1>
          <p className="text-slate-400 max-w-lg mx-auto">List unlimited business, reach AI-powered buyers &amp; sellers, gain visibility through AI LLM search and grow your practice through Bizfuture.ai</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Unlimited business for sale listings", icon: "📋" },
            { label: "AI buyer matching", icon: "🤖" },
            { label: "Optimized for AI LLM Search visibility", icon: "🔍" },
            { label: "Free!", icon: "🎉" },
          ].map(({ label, icon }) => (
            <div key={label} className="bg-[#111827] border border-purple-500/20 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-white text-sm font-bold">{label}</div>
            </div>
          ))}
        </div>

        {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>)}

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-2">Already Have a Broker Profile Online?</h2>
          <p className="text-slate-400 text-xs mb-4">Paste a link to your existing profile (brokerage site, LinkedIn, etc.) and we'll try to pre-fill the fields below. Always review before submitting.</p>
          <div className="flex gap-2">
            <input value={autofillUrl} onChange={(e) => setAutofillUrl(e.target.value)} placeholder="https://..." className={inputClass} />
            <button type="button" onClick={runAutofill} disabled={autofillLoading}
              className="shrink-0 whitespace-nowrap bg-cyan-500 text-black font-bold px-5 rounded-xl hover:bg-cyan-400 transition disabled:opacity-50">
              {autofillLoading ? "Loading..." : "Autofill"}
            </button>
          </div>
          {autofillNote && <p className="text-xs text-cyan-400 mt-3">{autofillNote}</p>}
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Full Name *</label><input name="name" value={form.name} onChange={handle} placeholder="John Smith" className={inputClass} /></div>
            <div><label className={labelClass}>Business Email *</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="john@brokerage.com" className={inputClass} /></div>
            <div><label className={labelClass}>Password *</label><input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" className={inputClass} /></div>
            <div><label className={labelClass}>Phone</label><input name="phone" value={form.phone} onChange={handle} placeholder="555-123-4567" className={inputClass} /></div>
            <div><label className={labelClass}>Website</label><input name="website" value={form.website} onChange={handle} placeholder="www.yourbrokerage.com" className={inputClass} /></div>
            <div><label className={labelClass}>Credentials</label><input name="credentials" value={form.credentials} onChange={handle} placeholder="CBI, CBB" className={inputClass} /></div>
            <div>
              <label className={labelClass}>Profile Photo — optional</label>
              <div className="flex items-center gap-3">
                {form.profile_photo_url && (
                  <img src={form.profile_photo_url} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-[#1e2d45]" />
                )}
                <label className="cursor-pointer bg-[#1e2d45] hover:bg-[#28405f] text-white text-sm font-bold px-4 py-3 rounded-xl transition">
                  {photoUploading ? "Uploading..." : (form.profile_photo_url ? "Change Photo" : "Upload Photo")}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={photoUploading} />
                </label>
              </div>
              <p className="text-slate-500 text-xs mt-2">You can add this later.</p>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Brokerage Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Company Name *</label><input name="company" value={form.company} onChange={handle} placeholder="Smith Business Brokers" className={inputClass} /></div>
            <div><label className={labelClass}>License Number</label><input name="license_number" value={form.license_number} onChange={handle} placeholder="BRK-12345" className={inputClass} /></div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Tagline</label>
            <input name="tagline" value={form.tagline} onChange={handle} placeholder="Sell with strategy. Exit with confidence." className={inputClass} />
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

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Languages You Speak</h2>
          <p className="text-slate-400 text-xs mb-4">Shown on your public profile and searchable by buyers</p>
          <div className="flex flex-wrap gap-2">
            {BROKER_LANGUAGES.map(lang => (
              <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                className={"px-3 py-2 rounded-xl text-xs font-bold border transition " + (form.languages.includes(lang) ? "bg-cyan-400 text-black border-cyan-400" : "border-[#1e2d45] text-slate-400 hover:border-cyan-400")}>
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Areas you serve (California Only)</h2>
          <p className="text-slate-400 text-xs mb-4">Select the CA counties where you actively broker deals</p>
          <div className="flex flex-wrap gap-2">
            {CA_COUNTIES.map(county => (
              <button key={county} type="button" onClick={() => toggleArea(county)}
                className={"px-3 py-2 rounded-xl text-xs font-bold border transition " + (form.areas_served.includes(county) ? "bg-orange-400 text-black border-orange-400" : "border-[#1e2d45] text-slate-400 hover:border-orange-400")}>
                {county}
              </button>
            ))}
          </div>
        </div>

        <button onClick={submit} disabled={loading}
          className="w-full bg-purple-500 text-white font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-purple-400 transition disabled:opacity-50">
          {loading ? "Creating Your Profile..." : "Create My Free Broker Profile"}
        </button>
      </div>
    </main>
  )
}