import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function Home() {
  const { data } = await supabase.from("businesses").select("*").limit(1)

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-cyan-400 text-sm font-bold uppercase tracking-widest">
          AI-Powered Business Marketplace
        </span>
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
        Biz<span className="text-cyan-400">Future</span>.ai
      </h1>

      <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
        The AI-native marketplace for buying and selling businesses.
        Built for how the future searches - not how the past did.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link href="/listings" className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">
          Browse Businesses For Sale
        </Link>
        <Link href="/listings/new" className="border border-cyan-400 text-cyan-400 font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-400 hover:text-[#0a0f1e] transition">
          List Your Business
        </Link>
        <Link href="/buyers" className="border border-slate-500 text-slate-300 font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:border-cyan-400 hover:text-cyan-400 transition">
          Register as Buyer
        </Link>
      </div>

      <div className="flex gap-12 text-center mb-16">
        <div>
          <div className="text-3xl font-black text-cyan-400">AI</div>
          <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Powered</div>
        </div>
        <div>
          <div className="text-3xl font-black text-cyan-400">USA</div>
          <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Market</div>
        </div>
        <div>
          <div className="text-3xl font-black text-cyan-400">2027</div>
          <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Built For</div>
        </div>
      </div>
    </main>
  )
}
