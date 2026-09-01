import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BizFuture.ai - Businesses For Sale | AI-Powered Marketplace",
  description: "Browse 500+ businesses for sale across the USA. AI-powered buyer matching and listing creation.",
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: featured } = await supabase
    .from("businesses")
    .select("id, title, industry, asking_price, cash_flow, city, state, images")
    .eq("status", "active")
    .not("asking_price", "is", null)
    .order("asking_price", { ascending: false })
    .limit(6)

  const { count } = await supabase
    .from("businesses")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const industries = ["Restaurants & Food","Retail","Service","Health Care & Fitness","Automotive","Technology & Website","Building & Construction","Manufacturing","Pet Services","Beauty","Financial Services","Transportation & Storage"]
  const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <nav className="px-4 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <span className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</span>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/listings" className="text-slate-400 text-sm hover:text-white transition">Browse</Link>
          <Link href="/broker" className="text-slate-400 text-sm hover:text-white transition">Brokers</Link>
          <Link href="/pricing" className="text-slate-400 text-sm hover:text-white transition">Pricing</Link>
          <Link href="/about" className="text-slate-400 text-sm hover:text-white transition">About</Link>
          {user ? (
            <Link href="/dashboard" className="bg-cyan-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-slate-400 text-sm hover:text-white transition">Sign In</Link>
              <Link href="/signup" className="bg-cyan-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">Sign Up</Link>
            </>
          )}
        </div>
        <Link href="/listings" className="md:hidden bg-cyan-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wide">Browse</Link>
</nav>

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-full mb-6">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">AI-Powered Business Marketplace</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">Find Your Next<br /><span className="text-cyan-400">Business</span></h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">Browse {count?.toLocaleString()}+ businesses for sale across the USA. AI-powered matching finds the right buyer for every listing.</p>

        <form action="/listings" method="GET" className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 max-w-4xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input name="keyword" placeholder="Search businesses..." className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm" />
            <select name="state" className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 text-sm">
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="industry" className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 text-sm">
              <option value="">All Industries</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <button type="submit" className="bg-cyan-400 text-[#0a0f1e] font-black px-6 py-3 rounded-xl text-sm uppercase tracking-wide hover:bg-cyan-300 transition">Search</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select name="max_price" className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-2 text-slate-400 focus:outline-none focus:border-cyan-400 text-xs">
              <option value="">Max Price</option>
              <option value="100000">Under $100K</option>
              <option value="250000">Under $250K</option>
              <option value="500000">Under $500K</option>
              <option value="1000000">Under $1M</option>
              <option value="5000000">Under $5M</option>
            </select>
            <select name="min_cashflow" className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-2 text-slate-400 focus:outline-none focus:border-cyan-400 text-xs">
              <option value="">Min Cash Flow</option>
              <option value="25000">$25K+</option>
              <option value="50000">$50K+</option>
              <option value="100000">$100K+</option>
              <option value="250000">$250K+</option>
            </select>
            <select name="financing" className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-2 text-slate-400 focus:outline-none focus:border-cyan-400 text-xs">
              <option value="">Financing</option>
              <option value="true">Owner Financing</option>
            </select>
            <select name="sort" className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-2 text-slate-400 focus:outline-none focus:border-cyan-400 text-xs">
              <option value="">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="cashflow_desc">Cash Flow: High to Low</option>
            </select>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {industries.slice(0, 8).map(ind => (
            <Link key={ind} href={"/listings?industry=" + encodeURIComponent(ind)} className="bg-[#111827] border border-[#1e2d45] text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition px-4 py-2 rounded-full text-xs font-medium">
              {ind}
            </Link>
          ))}
        </div>
      </div>

      {featured && featured.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">Featured Listings</h2>
            <Link href="/listings" className="text-cyan-400 text-sm hover:underline">View all {count?.toLocaleString()} listings</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(biz => (
              <Link key={biz.id} href={"/listings/" + biz.id} className="bg-[#111827] border border-[#1e2d45] rounded-2xl overflow-hidden hover:border-cyan-400 transition group">
                {biz.images && biz.images.length > 0 ? (
                  <img src={biz.images[0]} alt={biz.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-[#0a0f1e] flex items-center justify-center">
                    <span className="text-slate-600 text-sm">{biz.industry ?? "Business"}</span>
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1 rounded-full">{biz.industry ?? "Business"}</span>
                  <h3 className="text-white font-bold mt-3 mb-1 group-hover:text-cyan-400 transition line-clamp-1">{biz.title}</h3>
                  <p className="text-slate-500 text-xs mb-3">{[biz.city, biz.state].filter(Boolean).join(", ")}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Asking Price</div>
                      <div className="text-white font-black">{biz.asking_price ? "$" + Number(biz.asking_price).toLocaleString() : "Contact"}</div>
                    </div>
                    {biz.cash_flow && (
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Cash Flow</div>
                        <div className="text-cyan-400 font-bold">${Number(biz.cash_flow).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#111827] border-t border-[#1e2d45] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
            <div><div className="text-3xl font-black text-cyan-400">{count?.toLocaleString()}+</div><div className="text-slate-500 text-sm mt-1">Active Listings</div></div>
            <div><div className="text-3xl font-black text-cyan-400">50</div><div className="text-slate-500 text-sm mt-1">US States</div></div>
            <div><div className="text-3xl font-black text-cyan-400">AI</div><div className="text-slate-500 text-sm mt-1">Powered Matching</div></div>
            <div><div className="text-3xl font-black text-cyan-400">2027</div><div className="text-slate-500 text-sm mt-1">Built For</div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#0a0f1e] border border-[#1e2d45] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/20 rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-cyan-400 font-black">AI</span></div>
              <h3 className="text-white font-bold mb-2">AI Listing Assistant</h3>
              <p className="text-slate-400 text-sm">Claude AI writes your listing description automatically from your business details.</p>
            </div>
            <div className="bg-[#0a0f1e] border border-[#1e2d45] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/20 rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-cyan-400 font-black">M</span></div>
              <h3 className="text-white font-bold mb-2">Buyer Matching</h3>
              <p className="text-slate-400 text-sm">AI matches your listing to qualified buyers by budget, industry and location.</p>
            </div>
            <div className="bg-[#0a0f1e] border border-[#1e2d45] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/20 rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-cyan-400 font-black">X</span></div>
              <h3 className="text-white font-bold mb-2">Social Auto-Posting</h3>
              <p className="text-slate-400 text-sm">Premium listings auto-posted to X and LinkedIn to reach more buyers.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <Link href="/listings" className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition text-center">Browse Businesses For Sale</Link>
            <Link href="/listings/new" className="border border-cyan-400 text-cyan-400 font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-400 hover:text-[#0a0f1e] transition text-center">List Your Business</Link>
            <Link href="/broker" className="border border-slate-500 text-slate-300 font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:border-cyan-400 hover:text-cyan-400 transition text-center">Join as Broker</Link>
          </div>

          <div className="border-t border-[#1e2d45] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-slate-600 text-sm">2027 BizFuture.ai - Velocifuture LLC</span>
            <div className="flex gap-6">
              <Link href="/about" className="text-slate-500 text-sm hover:text-white transition">About</Link>
              <Link href="/pricing" className="text-slate-500 text-sm hover:text-white transition">Pricing</Link>
              <Link href="/broker" className="text-slate-500 text-sm hover:text-white transition">Brokers</Link>
              <Link href="/privacy" className="text-slate-500 text-sm hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="text-slate-500 text-sm hover:text-white transition">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}