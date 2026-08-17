import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"

const tierLimits: any = { free: 1, basic: 3, premium: 10, broker: 999 }
const tierColors: any = {
  free: "text-slate-400",
  basic: "text-cyan-400",
  premium: "text-purple-400",
  broker: "text-yellow-400"
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: dbUser } = await supabase
    .from("users")
    .select("subscription_tier")
    .eq("email", user.email)
    .single()

  const tier = dbUser?.subscription_tier || "free"
  const limit = tierLimits[tier] || 1

  const { data: listings } = await supabase
    .from("businesses")
    .select("*")
    .eq("email", user.email)
    .order("created_at", { ascending: false })

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("business_id")

  const inquiryCount = (bizId: string) =>
    inquiries?.filter(i => i.business_id === bizId).length ?? 0

  const totalInquiries = inquiries?.length ?? 0
  const activeListings = listings?.filter(l => l.status === "active").length ?? 0
  const name = user.user_metadata?.name || user.email
  const atLimit = activeListings >= limit

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">Welcome, {name}</span>
            <Link href="/listings/new" className={atLimit ? "bg-slate-600 text-slate-400 font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wide cursor-not-allowed" : "bg-cyan-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition"}>
              Post Ad
            </Link>
            <Link href="/auth/signout" className="text-slate-400 text-sm hover:text-white transition">Sign Out</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-black text-white mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 text-center">
            <div className={"text-3xl font-black " + tierColors[tier]}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</div>
            <div className="text-slate-400 text-sm mt-1">Current Plan</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-cyan-400">{activeListings}/{limit === 999 ? "∞" : limit}</div>
            <div className="text-slate-400 text-sm mt-1">Listings Used</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-cyan-400">{totalInquiries}</div>
            <div className="text-slate-400 text-sm mt-1">Total Inquiries</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-cyan-400">{listings?.length ?? 0}</div>
            <div className="text-slate-400 text-sm mt-1">Total Listings</div>
          </div>
        </div>

        {atLimit && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-yellow-400 font-bold mb-1">Listing Limit Reached</h3>
              <p className="text-slate-400 text-sm">You have used all {limit} listing{limit !== 1 ? "s" : ""} on your {tier} plan. Upgrade to post more.</p>
            </div>
            <Link href="/pricing" className="bg-yellow-400 text-[#0a0f1e] font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-yellow-300 transition whitespace-nowrap ml-4">
              Upgrade Now
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">My Listings</h2>
          {!atLimit && (
            <Link href="/listings/new" className="text-cyan-400 text-sm hover:underline">+ Post New Listing</Link>
          )}
        </div>

        {listings && listings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {listings.map(biz => (
              <div key={biz.id} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1 rounded-full">{biz.industry ?? "Business"}</span>
                    <span className={"text-xs px-3 py-1 rounded-full border " + (biz.status === "sold" ? "bg-green-400/10 text-green-400 border-green-400/20" : biz.status === "pending" ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" : "bg-slate-400/10 text-slate-400 border-slate-400/20")}>
                      {biz.status ?? "active"}
                    </span>
                    {inquiryCount(biz.id) > 0 && (
                      <span className="text-xs bg-purple-400/10 text-purple-400 border border-purple-400/20 px-3 py-1 rounded-full">
                        {inquiryCount(biz.id)} {inquiryCount(biz.id) === 1 ? "inquiry" : "inquiries"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold">{biz.title}</h3>
                  <p className="text-slate-400 text-sm">{[biz.city, biz.state].filter(Boolean).join(", ")}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-black">{biz.asking_price ? "$" + Number(biz.asking_price).toLocaleString() : "Contact"}</div>
                  <div className="flex gap-3 mt-1 justify-end">
                    <Link href={"/listings/" + biz.id} className="text-cyan-400 text-xs hover:underline">View</Link>
                    <Link href={"/listings/" + biz.id + "/edit"} className="text-slate-400 text-xs hover:underline">Edit</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-white font-bold mb-2">No listings yet</h3>
            <p className="text-slate-400 text-sm mb-6">Post your first business for sale and reach qualified buyers</p>
            <Link href="/listings/new" className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">
              Post First Listing
            </Link>
          </div>
        )}

        {tier === "free" && (
          <div className="mt-10 bg-[#111827] border border-cyan-400/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold mb-1">Upgrade Your Plan</h3>
                <p className="text-slate-400 text-sm">Get more listings, AI optimization, social media posting and buyer matching alerts</p>
              </div>
              <Link href="/pricing" className="bg-cyan-400 text-[#0a0f1e] font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition whitespace-nowrap">
                View Plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
