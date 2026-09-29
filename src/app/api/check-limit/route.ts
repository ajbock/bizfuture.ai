import { NextRequest, NextResponse } from "next/server"
import { checkListingLimit } from "@/lib/subscription"
import { getSessionUser } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user?.email) return NextResponse.json({ error: "Not logged in" }, { status: 401 })
    // Always use the logged-in user's own email, never one supplied by the caller
    const result = await checkListingLimit(user.email)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
