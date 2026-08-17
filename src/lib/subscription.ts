import { createClient } from "@supabase/supabase-js"

const tierLimits: any = {
  free: 1,
  basic: 3,
  premium: 10,
  broker: 999
}

export async function getListingLimit(email: string): Promise<number> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const { data } = await supabase
    .from("users")
    .select("subscription_tier")
    .eq("email", email)
    .single()

  const tier = data?.subscription_tier || "free"
  return tierLimits[tier] || 1
}

export async function getUserTier(email: string): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const { data } = await supabase
    .from("users")
    .select("subscription_tier")
    .eq("email", email)
    .single()

  return data?.subscription_tier || "free"
}

export async function checkListingLimit(email: string): Promise<{ allowed: boolean; current: number; limit: number; tier: string }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const { data: user } = await supabase
    .from("users")
    .select("subscription_tier")
    .eq("email", email)
    .single()

  const tier = user?.subscription_tier || "free"
  const limit = tierLimits[tier] || 1

  const { count } = await supabase
    .from("businesses")
    .select("*", { count: "exact", head: true })
    .eq("email", email)
    .eq("status", "active")

  const current = count || 0

  return {
    allowed: current < limit,
    current,
    limit,
    tier
  }
}
