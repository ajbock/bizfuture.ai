import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json()

    const priceIds: any = {
      basic: process.env.STRIPE_BASIC_PRICE_ID,
      premium: process.env.STRIPE_PREMIUM_PRICE_ID,
      broker: process.env.STRIPE_BROKER_PRICE_ID,
    }

    const priceId = priceIds[plan]
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?subscription=success`,
      cancel_url: `${req.headers.get("origin")}/pricing?cancelled=true`,
      customer_email: email || undefined,
      metadata: { plan }
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
