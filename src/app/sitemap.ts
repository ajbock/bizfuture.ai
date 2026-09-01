import { createClient } from "@supabase/supabase-js"

export default async function sitemap() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const { data: listings } = await supabase
    .from("businesses")
    .select("id, updated_at")
    .eq("status", "active")
    .limit(500)

  const listingUrls = listings?.map(listing => ({
    url: `https://bizfuture.ai/listings/${listing.id}`,
    lastModified: listing.updated_at || new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  })) || []

  return [
    { url: "https://bizfuture.ai", lastModified: new Date().toISOString(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: "https://bizfuture.ai/listings", lastModified: new Date().toISOString(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: "https://bizfuture.ai/pricing", lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "https://bizfuture.ai/broker", lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "https://bizfuture.ai/about", lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "https://bizfuture.ai/privacy", lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: "https://bizfuture.ai/terms", lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.3 },
    ...listingUrls,
  ]
}
