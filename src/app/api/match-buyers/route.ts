import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )

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
