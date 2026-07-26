import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { state?: string; industry?: string; keyword?: string }
}) {
  const { state, industry, keyword } = searchParams

  let query = supabase
    .from('businesses')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (state) query = query.eq('state', state)
  if (industry) query = query.eq('industry', industry)
  if (keyword) query = query.ilike('title', `%${keyword}%`)

  const { data: businesses, error } = await query

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

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      
      {/* Header */}
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Biz<span className="text-cyan-400">Future</span>.ai
          </Link>
          <Link 
            href="/listings/new"
            className="bg-cyan-400 text-[#0a0f1e] font-bold px-6 py-2 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition"
          >
            Post Ad
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Page Title */}
        <h1 className="text-3xl font-black text-white mb-6">
          Business Listings
        </h1>

        {/* Filters */}
        <form method="GET" className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Keyword */}
            <input
              name="keyword"
              defaultValue={keyword}
              placeholder="Search businesses..."
              className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
            />

            {/* State */}
            <select
              name="state"
              defaultValue={state}
              className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 text-sm"
            >
              <option value="">All States</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Industry */}
            <select
              name="industry"
              defaultValue={industry}
              className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 text-sm"
            >
              <option value="">All Industries</option>
              {industries.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-cyan-400 text-[#0a0f1e] font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-wide hover:bg-cyan-300 transition"
            >
              Search
            </button>

          </div>
        </form>

        {/* Results Count */}
        <p className="text-slate-400 text-sm mb-6">
          {businesses?.length ?? 0} businesses found
        </p>

        {/* Listings */}
        {businesses && businesses.length > 0 ? (
          <div className="flex flex-col gap-4">
            {businesses.map((biz) => (
              <Link
                key={biz.id}
                href={`/listings/${biz.id}`}
                className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 hover:border-cyan-400 transition group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1 rounded-full font-medium">
                        {biz.industry ?? 'Business'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {biz.listing_type ?? 'For Sale'}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition mb-1">
                      {biz.title}
                    </h2>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                      {biz.description}
                    </p>
                    <div className="text-xs text-slate-500">
                      📍 {[biz.city, biz.county, biz.state].filter(Boolean).join(', ')}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-6 md:gap-3 md:text-right shrink-0">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Asking Price</div>
                      <div className="text-xl font-black text-white">
                        {biz.asking_price 
                          ? `$${Number(biz.asking_price).toLocaleString()}`
                          : 'Contact'
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Cash Flow</div>
                      <div className="text-lg font-bold text-cyan-400">
                        {biz.cash_flow
                          ? `$${Number(biz.cash_flow).toLocaleString()}`
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-slate-500">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-xl font-bold text-white mb-2">No listings yet</div>
            <div className="text-sm mb-6">Be the first to post a business for sale</div>
            <Link
              href="/listings/new"
              className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition"
            >
              Post First Listing
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}