'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const states = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado',
  'Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho',
  'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana',
  'Maine','Maryland','Massachusetts','Michigan','Minnesota',
  'Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York',
  'North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
  'Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington',
  'West Virginia','Wisconsin','Wyoming'
]

const industries = [
  'Agriculture','Automotive','Beauty','Building & Construction',
  'Communication & Media','Financial Services','Health Care & Fitness',
  'Manufacturing','Office','Other','Pet Services','Restaurants & Food',
  'Retail','Service','Technology & Website','Transportation & Storage',
  'Travel','Wholesale & Distributors'
]

const years = Array.from({length: 86}, (_, i) => 2035 - i)

const reasonsForSelling = [
  'Retirement','Moving to other ventures','Health Reasons',
  'Financial Issues / Bankruptcy','Relocating',
  'Lease Ending / Location Issue','Other'
]

export default function NewListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    listing_type: 'For Sale',
    industry: '',
    asking_price: '',
    cash_flow: '',
    annual_revenue: '',
    ebitda: '',
    inventory_value: '',
    established_year: '',
    employees: '',
    real_estate: '',
    reason_for_selling: '',
    financing_available: false,
    training_available: false,
    city: '',
    county: '',
    state: '',
    phone: '',
    email: '',
    website: '',
  })

  const handle = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async () => {
    if (!form.title) return setError('Business title is required')
    setLoading(true)
    setError('')

    const { error } = await supabase.from('businesses').insert([{
      ...form,
      asking_price: form.asking_price ? Number(form.asking_price.replace(/,/g, '')) : null,
      cash_flow: form.cash_flow ? Number(form.cash_flow.replace(/,/g, '')) : null,
      annual_revenue: form.annual_revenue ? Number(form.annual_revenue.replace(/,/g, '')) : null,
      ebitda: form.ebitda ? Number(form.ebitda.replace(/,/g, '')) : null,
      inventory_value: form.inventory_value ? Number(form.inventory_value.replace(/,/g, '')) : null,
      employees: form.employees ? Number(form.employees) : null,
      established_year: form.established_year ? Number(form.established_year) : null,
    }])

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/listings')
    }
  }

  const inputClass = "w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2"
  const sectionClass = "bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-6"

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {/* Header */}
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Biz<span className="text-cyan-400">Future</span>.ai
          </Link>
          <Link href="/listings" className="text-slate-400 text-sm hover:text-white transition">
            ← Back to Listings
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-black text-white mb-2">Create Listing</h1>
        <p className="text-slate-400 text-sm mb-8">Fill in your business details below</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Listing Type */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Listing Type</h2>
          <div className="flex gap-3">
            {['For Sale', 'Wanted to Buy', 'Franchise'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm(f => ({ ...f, listing_type: type }))}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                  form.listing_type === type
                    ? 'bg-cyan-400 text-[#0a0f1e] border-cyan-400'
                    : 'border-[#1e2d45] text-slate-400 hover:border-cyan-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Ad Summary */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Ad Summary</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Business Title *</label>
              <input name="title" value={form.title} onChange={handle} placeholder="e.g. Profitable Restaurant in Downtown Chicago" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={form.description} onChange={handle} placeholder="Describe your business, its history, and why it's a great opportunity..." rows={5} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <select name="industry" value={form.industry} onChange={handle} className={inputClass}>
                <option value="">Select Industry</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Asking Price ($USD)</label>
              <input name="asking_price" value={form.asking_price} onChange={handle} placeholder="e.g. 500,000" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Financial Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cash Flow ($USD)</label>
              <input name="cash_flow" value={form.cash_flow} onChange={handle} placeholder="e.g. 120,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gross Revenue ($USD)</label>
              <input name="annual_revenue" value={form.annual_revenue} onChange={handle} placeholder="e.g. 800,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>EBITDA ($USD)</label>
              <input name="ebitda" value={form.ebitda} onChange={handle} placeholder="e.g. 150,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Inventory Value ($USD)</label>
              <input name="inventory_value" value={form.inventory_value} onChange={handle} placeholder="e.g. 50,000" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Listing Details */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Listing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Established Year</label>
              <select name="established_year" value={form.established_year} onChange={handle} className={inputClass}>
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Number of Employees</label>
              <input name="employees" value={form.employees} onChange={handle} placeholder="e.g. 12" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Real Estate</label>
              <select name="real_estate" value={form.real_estate} onChange={handle} className={inputClass}>
                <option value="">Select option</option>
                <option>Own</option>
                <option>Lease</option>
                <option>Included in Price</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Reason for Selling</label>
              <select name="reason_for_selling" value={form.reason_for_selling} onChange={handle} className={inputClass}>
                <option value="">Select reason</option>
                {reasonsForSelling.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="financing_available" checked={form.financing_available} onChange={handle} className="w-4 h-4 accent-cyan-400" />
              <span className="text-sm text-slate-300">Financing Available</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="training_available" checked={form.training_available} onChange={handle} className="w-4 h-4 accent-cyan-400" />
              <span className="text-sm text-slate-300">Training Available</span>
            </label>
          </div>
        </div>

        {/* Location */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input name="city" value={form.city} onChange={handle} placeholder="e.g. Chicago" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>County</label>
              <input name="county" value={form.county} onChange={handle} placeholder="e.g. Cook County" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select name="state" value={form.state} onChange={handle} className={inputClass}>
                <option value="">Select State</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input name="phone" value={form.phone} onChange={handle} placeholder="e.g. 555-123-4567" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" value={form.email} onChange={handle} placeholder="e.g. owner@business.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input name="website" value={form.website} onChange={handle} placeholder="e.g. www.mybusiness.com" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-2xl text-lg uppercase tracking-wide hover:bg-cyan-300 transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Listing'}
        </button>

      </div>
    </main>
  )
}