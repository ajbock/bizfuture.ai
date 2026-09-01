import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function BrokerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const db = require("@supabase/supabase-js").createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const { data: dbUser } = await db.from("users").select("subscription_tier").eq("email", user.email).single()
  if (dbUser?.subscription_tier !== "broker") redirect("/dashboard")

  const { data: listings } = await db
    .from("businesses")
    .select("*")
    .eq("email", user.email)
    .order("created_at", { ascending: false })

  const { data: inquiries } = await db
    .from("inquiries")
    .select("*, businesses(title)")

  const myListingIds = listings?.map((l: any) => l.id) || []
  const myInquiries = inquiries?.filter((i: any) => myListingIds.includes(i.business_id)) || []
  const name = user.user_metadata?.name || user.email

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">Welcome, {name}</span>
            <span className="bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-bold px-3 py-1 rounded-full">BROKER</span>
            <Link href="/listings/new" className="bg-cyan-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">Post Listing</Link>
            <Link href="/auth/signout" className="text-slate-400 text-sm hover:text-white transition">Sign Out</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-black text-white mb-8">Broker Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#111827] border border-purple-500/30 rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-purple-400">{listings?.length ?? 0}</div>
            <div className="text-slate-400 text-sm mt-1">Total Listings</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-cyan-400">{listings?.filter((l: any) => l.status === "active").length ?? 0}</div>
            <div className="text-slate-400 text-sm mt-1">Active Listings</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-cyan-400">{myInquiries.length}</div>
            <div className="text-slate-400 text-sm mt-1">Total Inquiries</div>
          </div>
          <div className="bg-[#111827] border border-green-500/30 rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-green-400">{listings?.filter((l: any) => l.status === "sold").length ?? 0}</div>
            <div className="text-slate-400 text-sm mt-1">Sold</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">My Listings</h2>
              <Link href="/listings/new" className="text-cyan-400 text-sm hover:underline">+ Add Listing</Link>
            </div>

            {listings && listings.length > 0 ? (
              <div className="flex flex-col gap-3">
                {listings.map((biz: any) => (
                  <div key={biz.id} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-2 py-0.5 rounded-full">{biz.industry}</span>
                        <span className={"text-xs px-2 py-0.5 rounded-full border " + (biz.status === "sold" ? "bg-green-400/10 text-green-400 border-green-400/20" : biz.status === "pending" ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" : "bg-slate-400/10 text-slate-400 border-slate-400/20")}>
                          {biz.status ?? "active"}
                        </span>
                        {myInquiries.filter((i: any) => i.business_id === biz.id).length > 0 && (
                          <span className="text-xs bg-purple-400/10 text-purple-400 border border-purple-400/20 px-2 py-0.5 rounded-full">
                            {myInquiries.filter((i: any) => i.business_id === biz.id).length} inquiries
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-sm">{biz.title}</h3>
                      <p className="text-slate-400 text-xs">{[biz.city, biz.state].filter(Boolean).join(", ")}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-white font-black text-sm">{biz.asking_price ? "$" + Number(biz.asking_price).toLocaleString() : "Contact"}</div>
                      <div className="flex gap-2 mt-1 justify-end">
                        <Link href={"/listings/" + biz.id} className="text-cyan-400 text-xs hover:underline">View</Link>
                        <Link href={"/listings/" + biz.id + "/edit"} className="text-slate-400 text-xs hover:underline">Edit</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-12 text-center">
                <h3 className="text-white font-bold mb-2">No listings yet</h3>
                <p className="text-slate-400 text-sm mb-4">Post your first business listing</p>
                <Link href="/listings/new" className="bg-cyan-400 text-[#0a0f1e] font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">Post First Listing</Link>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Recent Inquiries</h2>
            {myInquiries.length > 0 ? (
              <div className="flex flex-col gap-3">
                {myInquiries.slice(0, 10).map((inq: any) => (
                  <div key={inq.id} className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4">
                    <div className="text-white font-bold text-sm">{inq.name}</div>
                    <div className="text-slate-400 text-xs">{inq.email}</div>
                    <div className="text-slate-500 text-xs mt-1 line-clamp-1">{inq.message}</div>
                    <div className="text-slate-600 text-xs mt-2">{inq.businesses?.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-8 text-center">
                <p className="text-slate-400 text-sm">No inquiries yet</p>
              </div>
            )}

            <div className="mt-6 bg-[#111827] border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Broker Tools</h3>
              <div className="flex flex-col gap-2">
                <Link href="/listings/new" className="text-cyan-400 text-sm hover:underline flex items-center gap-2">
                  <span>→</span> Post New Listing
                </Link>
                <Link href="/listings" className="text-cyan-400 text-sm hover:underline flex items-center gap-2">
                  <span>→</span> Browse All Listings
                </Link>
                <Link href="/buyers" className="text-cyan-400 text-sm hover:underline flex items-center gap-2">
                  <span>→</span> View Buyer Pool
                </Link>
                <Link href="/pricing" className="text-cyan-400 text-sm hover:underline flex items-center gap-2">
                  <span>→</span> Manage Subscription
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
