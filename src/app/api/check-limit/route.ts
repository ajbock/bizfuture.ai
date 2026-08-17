import { NextRequest, NextResponse } from "next/server"
import { checkListingLimit } from "@/lib/subscription"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })
    const result = await checkListingLimit(email)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
