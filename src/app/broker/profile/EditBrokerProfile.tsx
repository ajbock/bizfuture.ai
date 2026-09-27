"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CA_COUNTIES, BROKER_LANGUAGES, slugify } from "@/lib/constants/broker-options"

const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]

export default function EditBrokerProfile({ broker }: { broker: any }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [photoUploading, setPhotoUploading] = useState(false)
  const [form, setForm] = useState({
    name: broker.name || "", phone: broker.phone || "", company: broker.company || "",
    license_number: broker.license_number || "", states_licensed: broker.states_licensed || [],
    website: broker.website || "", bio: broker.bio || "",
    credentials: broker.credentials || "", tagline: broker.tagline || "",
    profile_photo_url: broker.profile_photo_url || "",
    languages: broker.languages || [], areas_served: broker.areas_served || []
  })

  const handle = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const toggleState = (state: string) => {
    setForm(f => ({
      ...f,
      states_licensed: f.states_licensed.includes(state)
        ? f.states_licensed.filter((s: string) => s !== state)
        : [...f.states_licensed, state]
    }))
  }

  const toggleLanguage = (lang: string) => {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter((l: string) => l !== lang)
        : [...f.languages, lang]
    }))
  }

  const toggleArea = (county: string) => {
    setForm(f => ({
      ...f,
      areas_served: f.areas_served.includes(county)
        ? f.areas_served.filter((c: string) => c !== county)
        : [...f.areas_served, county]
    }))
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
      if (data.url) setForm(f => ({ ...f, profile_photo_url: data.url }))
      else setError(data.error || "Photo upload failed")
    } catch {
      setError("Photo upload failed")
    }
    setPhotoUploading(false)
  }

  const save = async () => {
    if (!form.name || !form.company) return setError("Name and company are required")
    setSaving(true)
    setError("")
    setSaved(false)

    const supabase = createClient()
    const profile_slug = slugify(form.name, form.company)
    const { error } = await supabase
      .from("brokers")
      .update({
        name: form.name,
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
        profile_slug
      })
      .eq("id", broker.id)

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
    }
    setSaving(false)
  }

  const inputClass = "w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2"
  const sectionClass = "bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-6"

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 text-sm hover:text-white transition">My Dashboard</Link>
            <Link href="/auth/signout" className="text-slate-400 text-sm hover:text-white transition">Sign Out</Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Edit Your Broker Profile</h1>
            <p className="text-slate-400 text-sm">
              {broker.profile_slug && (
                <>Public at <Link href={`/brokers/${broker.profile_slug}`} target="_blank" className="text-cyan-400 hover:underline">bizfuture.ai/brokers/{broker.profile_slug}</Link></>
              )}
            </p>
          </div>
          <Link href="/listings/new" className="bg-cyan-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition whitespace-nowrap">+ Add Listing</Link>
        </div>

        {error && (<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>)}
        {saved && (<div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-6 text-sm">Profile updated.</div>)}

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Full Name *</label><input name="name" value={form.name} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>Phone</label><input name="phone" value={form.phone} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>Website</label><input name="website" value={form.website} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>Credentials</label><input name="credentials" value={form.credentials} onChange={handle} placeholder="CBI, CBB" className={inputClass} /></div>
            <div>
              <label className={labelClass}>Profile Photo</label>
              <div className="flex items-center gap-3">
                {form.profile_photo_url && (
                  <img src={form.profile_photo_url} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-[#1e2d45]" />
                )}
                <label className="cursor-pointer bg-[#1e2d45] hover:bg-[#28405f] text-white text-sm font-bold px-4 py-3 rounded-xl transition">
                  {photoUploading ? "Uploading..." : "Change Photo"}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={photoUploading} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Brokerage Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Company Name *</label><input name="company" value={form.company} onChange={handle} className={inputClass} /></div>
            <div><label className={labelClass}>License Number</label><input name="license_number" value={form.license_number} onChange={handle} className={inputClass} /></div>
          </div>
          <div className="mt-4"><label className={labelClass}>Tagline</label><input name="tagline" value={form.tagline} onChange={handle} className={inputClass} /></div>
          <div className="mt-4"><label className={labelClass}>Bio</label><textarea name="bio" value={form.bio} onChange={handle} rows={3} className={inputClass} /></div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">States Licensed In</h2>
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
          <div className="flex flex-wrap gap-2">
            {CA_COUNTIES.map(county => (
              <button key={county} type="button" onClick={() => toggleArea(county)}
                className={"px-3 py-2 rounded-xl text-xs font-bold border transition " + (form.areas_served.includes(county) ? "bg-orange-400 text-black border-orange-400" : "border-[#1e2d45] text-slate-400 hover:border-orange-400")}>
                {county}
              </button>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving}
          className="w-full bg-purple-500 text-white font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-purple-400 transition disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </main>
  )
}