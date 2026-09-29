import { NextRequest, NextResponse } from "next/server"
import { getAdminClient, getSessionUser } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminClient()

    // Buyer contact details are for paid brokers only
    const user = await getSessionUser()
    if (!user?.email) return NextResponse.json({ error: "Not logged in" }, { status: 401 })
    const { data: dbUser } = await supabase
      .from("users").select("subscription_tier").ilike("email", user.email).maybeSingle()
    if (dbUser?.subscription_tier !== "broker") {
      return NextResponse.json({ error: "Broker plan required" }, { status: 403 })
    }

    const { business_id } = await req.json()

    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", business_id)
      .single()

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const { data: buyers } = await supabase
      .from("buyers")
      .select("*")

    if (!buyers || buyers.length === 0) {
      return NextResponse.json({ matches: [], count: 0 })
    }

    const matches = buyers.filter(buyer => {
      const budgetMatch = (
        (!buyer.budget_min || !business.asking_price || buyer.budget_min <= business.asking_price) &&
        (!buyer.budget_max || !business.asking_price || buyer.budget_max >= business.asking_price)
      )

      const industryMatch = (
        !buyer.industries ||
        buyer.industries.length === 0 ||
        !business.industry ||
        buyer.industries.includes(business.industry)
      )

      const stateMatch = (
        !buyer.preferred_states ||
        buyer.preferred_states.length === 0 ||
        !business.state ||
        buyer.preferred_states.includes(business.state)
      )

      return budgetMatch && industryMatch && stateMatch
    })

    return NextResponse.json({
      matches: matches.map(b => ({ name: b.name, email: b.email, buyer_type: b.buyer_type })),
      count: matches.length,
      business_title: business.title
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
