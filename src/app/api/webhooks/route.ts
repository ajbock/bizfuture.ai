import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (err: any) {
    console.error("Webhook signature error:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession
    const plan = session.metadata?.plan
    const email = session.customer_email

    const tierMap: any = {
      basic: "basic",
      premium: "premium",
      broker: "broker"
    }

    const tier = tierMap[plan || ""] || "basic"

    if (email) {
      await supabase
        .from("users")
        .update({
          subscription_tier: tier,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq("email", email)

      console.log(`Upgraded ${email} to ${tier}`)
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    const { data: customer } = await stripe.customers.retrieve(customerId) as any

    if (customer?.email) {
      await supabase
        .from("users")
        .update({ subscription_tier: "free" })
        .eq("email", customer.email)

      console.log(`Downgraded ${customer.email} to free`)
    }
  }

  return NextResponse.json({ received: true })
}
