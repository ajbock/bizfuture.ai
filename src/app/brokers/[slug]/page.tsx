// app/brokers/[slug]/page.tsx
import { createClient } from "@/lib/supabase-server";
import { CREDENTIAL_INFO } from "@/lib/constants/broker-options";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BrokerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: broker } = await supabase
    .from("brokers")
    .select("*")
    .eq("profile_slug", slug)
    .eq("status", "approved")
    .single();

  if (!broker) return notFound();

  const { data: listings } = await supabase
    .from("businesses")
    .select("id, title, asking_price, city, county, images")
    .eq("email", broker.email)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3);

  const credentialList = broker.credentials
    ? broker.credentials.split(",").map((c: string) => c.trim())
    : [];

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <Link href="/listings" className="text-slate-400 text-sm hover:text-white transition">Browse Listings</Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-16">
        <div className="flex flex-col gap-6 rounded-2xl border border-[#1e2d45] bg-[#111827] p-8 sm:flex-row">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-[#1e2d45]">
            {broker.profile_photo_url ? (
              <Image src={broker.profile_photo_url} alt={broker.name} width={128} height={128} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-black text-slate-500">
                {broker.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">
              {broker.name}
              {credentialList.length > 0 && (
                <span className="ml-2 text-lg font-normal text-slate-400">
                  {credentialList.map((c: string, i: number) => (
                    <span key={c} title={CREDENTIAL_INFO[c] || ""} className="cursor-help underline decoration-dotted decoration-slate-600">
                      {c}{i < credentialList.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              )}
            </h1>
            <p className="mt-1 font-semibold text-cyan-400">{broker.company}</p>
            {broker.tagline && <p className="mt-2 text-slate-300">{broker.tagline}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              {broker.languages?.length > 0 && <Badge>Speaks: {broker.languages.join(", ")}</Badge>}
            </div>

            {broker.license_number && <p className="mt-3 text-sm text-slate-500">License #{broker.license_number}</p>}

            {broker.areas_served?.length > 0 && (
              <p className="mt-1 text-sm text-slate-500">📍 Serving {broker.areas_served.join(", ")}</p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 self-start sm:self-center">
            <a id="contact" href={`mailto:${broker.email}`} className="rounded-xl bg-orange-500 px-6 py-3 text-center font-bold text-white hover:bg-orange-400 transition">Contact Broker</a>
            {broker.website && (
              <a href={broker.website} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#1e2d45] px-6 py-3 text-center font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition">Visit Website</a>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#1e2d45] bg-[#111827] p-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Contact</h3>
            {broker.phone && <p className="text-slate-200">📞 <a href={`tel:${broker.phone}`} className="hover:text-cyan-400 hover:underline">{broker.phone}</a></p>}
            {broker.email && <p className="text-slate-200">✉️ <a href={`mailto:${broker.email}`} className="hover:text-cyan-400 hover:underline">{broker.email}</a></p>}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Social</h3>
            <div className="flex gap-3">
              {Object.entries(broker.social_links || {}).map(([platform, url]) => (
                <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="capitalize text-cyan-400 hover:underline">{platform}</a>
              ))}
              {Object.keys(broker.social_links || {}).length === 0 && <span className="text-sm text-slate-600">Not provided</span>}
            </div>
          </div>
        </div>

        {broker.bio && (
          <div className="mt-6 rounded-2xl border border-[#1e2d45] bg-[#111827] p-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">About</h3>
            <p className="whitespace-pre-line text-slate-200">{broker.bio}</p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-[#1e2d45] bg-[#111827] p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Businesses for Sale</h3>
            <Link href={`/listings?broker=${broker.profile_slug}`} className="text-sm font-bold text-cyan-400 hover:underline">View all →</Link>
          </div>
          {listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {listings.map((l) => (
                <Link key={l.id} href={`/listings/${l.id}`} className="rounded-xl border border-[#1e2d45] bg-[#0a0f1e] p-3 hover:border-cyan-400 transition">
                  <p className="line-clamp-2 font-semibold text-white">{l.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{l.county}</p>
                  <p className="mt-1 text-sm font-bold text-cyan-400">${Number(l.asking_price).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No active listings right now.</p>
          )}
        </div>

        <p className="mt-6 text-xs text-slate-600">This broker has provided the information above. BizFuture.ai has not independently verified these claims.</p>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e2d45] px-3 py-1.5 text-sm text-slate-300">{children}</span>;
}