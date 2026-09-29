import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase-server"

// SERVER ONLY. Uses the service-role key, which bypasses RLS. Never import this
// from a "use client" file and never prefix the env var with NEXT_PUBLIC_.
export function getAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// The logged-in user from the request cookies, or null.
export async function getSessionUser() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isAdminUser() {
  const user = await getSessionUser()
  const admin = (process.env.ADMIN_EMAIL || "").toLowerCase()
  return !!user && !!admin && (user.email || "").toLowerCase() === admin
}
