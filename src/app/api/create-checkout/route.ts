import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-05-28.basil"
})

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json()

    const plans: any = {
      basic: {
        name: "Basic Listing",
        price: 999,
        description: "1 listing for 30 days"
      },
      premium: {
        name: "Premium Listing",
        price: 2999,
        description: "Featured listing + AI optimization for 30 days"
      },
      broker: {
        name: "Broker Monthly",
        price: 9999,
        description: "Up to 20 listings per month"
      }
    }

    const selected = plans[plan]
    if (!selected) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selected.name,
              description: selected.description,
            },
            unit_amount: selected.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/listings?payment=success`,
      cancel_url: `${req.headers.get("origin")}/pricing?payment=cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
