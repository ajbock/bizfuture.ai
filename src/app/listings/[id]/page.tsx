import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import MatchedBuyers from "./MatchedBuyers"
import DealAnalysis from "./DealAnalysis"
import InquiryForm from "./InquiryForm"

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const { data: biz, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single()

  if (!biz || error) return notFound()

  const fmt = (n: any) => n ? "$" + Number(n).toLocaleString() : "N/A"

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <Link href="/listings" className="text-slate-400 text-sm hover:text-white transition">Back to Listings</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">

        {biz.images && biz.images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {biz.images.map((url: string, i: number) => (
                <img key={i} src={url} alt={"Photo " + (i + 1)}
                  className={"object-cover rounded-2xl border border-[#1e2d45] " + (i === 0 ? "md:col-span-2 h-64" : "h-40")} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">

            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1 rounded-full font-medium">{biz.industry ?? "Business"}</span>
                <span className="text-xs text-slate-500">{biz.listing_type ?? "For Sale"}</span>
              </div>
              <h1 className="text-2xl font-black text-white mb-2">{biz.title}</h1>
              <p className="text-slate-400 text-sm">{[biz.city, biz.county, biz.state].filter(Boolean).join(", ")}</p>
            </div>

            {biz.description && (
              <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-3">About This Business</h2>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{biz.description}</p>
              </div>
            )}

            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Financial Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Asking Price", value: fmt(biz.asking_price) },
                  { label: "Cash Flow", value: fmt(biz.cash_flow) },
                  { label: "Gross Revenue", value: fmt(biz.annual_revenue) },
                  { label: "EBITDA", value: fmt(biz.ebitda) },
                  { label: "Inventory", value: fmt(biz.inventory_value) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#0a0f1e] rounded-xl p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</div>
                    <div className="text-lg font-black text-cyan-400">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Business Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {biz.established_year && (<div><div className="text-slate-500 mb-1">Established</div><div className="text-white font-semibold">{biz.established_year}</div></div>)}
                {biz.employees && (<div><div className="text-slate-500 mb-1">Employees</div><div className="text-white font-semibold">{biz.employees}</div></div>)}
                {biz.real_estate && (<div><div className="text-slate-500 mb-1">Real Estate</div><div className="text-white font-semibold">{biz.real_estate}</div></div>)}
                {biz.reason_for_selling && (<div><div className="text-slate-500 mb-1">Reason for Selling</div><div className="text-white font-semibold">{biz.reason_for_selling}</div></div>)}
                <div><div className="text-slate-500 mb-1">Financing</div><div className="text-white font-semibold">{biz.financing_available ? "Yes" : "No"}</div></div>
                <div><div className="text-slate-500 mb-1">Training</div><div className="text-white font-semibold">{biz.training_available ? "Yes" : "No"}</div></div>
              </div>
            </div>

            <MatchedBuyers businessId={biz.id} />
            {biz.asking_price && (
              <DealAnalysis askingPrice={Number(biz.asking_price)} cashFlow={Number(biz.cash_flow)} annualRevenue={biz.annual_revenue ? Number(biz.annual_revenue) : undefined} />
            )}

          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-2xl p-6 text-center">
              <div className="text-xs text-cyan-400 uppercase tracking-wide mb-1">Asking Price</div>
              <div className="text-3xl font-black text-white">{fmt(biz.asking_price)}</div>
              {biz.cash_flow && (<div className="text-sm text-slate-400 mt-2">Cash Flow: <span className="text-cyan-400 font-bold">{fmt(biz.cash_flow)}</span></div>)}
            </div>

            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Contact</h2>
              <div className="flex flex-col gap-3 text-sm">
                {biz.phone && (<a href={"tel:" + biz.phone} className="text-slate-300 hover:text-cyan-400 transition">Phone: {biz.phone}</a>)}
                {biz.email && (<a href={"mailto:" + biz.email} className="text-slate-300 hover:text-cyan-400 transition">Email: {biz.email}</a>)}
                {biz.website && (<a href={biz.website} target="_blank" className="text-slate-300 hover:text-cyan-400 transition">Web: {biz.website}</a>)}
              </div>
            </div>

            <InquiryForm businessId={biz.id} />

          </div>
        </div>
      </div>
    </main>
  )
}
