import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )

    const { business_id, name, email, phone, message } = await req.json()

    if (!business_id || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", business_id)
      .single()

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    await supabase.from("inquiries").insert([{
      business_id,
      name,
      email,
      phone,
      message,
      status: "new"
    }])

    if (business.email) {
      await resend.emails.send({
        from: "BizFuture.ai <onboarding@resend.dev>",
        to: business.email,
        subject: "New Inquiry: " + business.title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0a0f1e; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">BizFuture.ai</h1>
            </div>
            <div style="background: #111827; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #1e2d45;">
              <h2 style="color: #ffffff; margin-top: 0;">New Buyer Inquiry!</h2>
              <p style="color: #6b7fa3;">Someone is interested in your listing:</p>
              <div style="background: #0a0f1e; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="color: #00d4ff; font-weight: bold; margin: 0;">${business.title}</p>
              </div>
              <h3 style="color: #ffffff;">Buyer Details:</h3>
              <p style="color: #6b7fa3; margin: 4px 0;"><strong style="color: #ffffff;">Name:</strong> ${name}</p>
              <p style="color: #6b7fa3; margin: 4px 0;"><strong style="color: #ffffff;">Email:</strong> ${email}</p>
              ${phone ? `<p style="color: #6b7fa3; margin: 4px 0;"><strong style="color: #ffffff;">Phone:</strong> ${phone}</p>` : ""}
              ${message ? `
              <h3 style="color: #ffffff;">Message:</h3>
              <div style="background: #0a0f1e; border-radius: 8px; padding: 16px;">
                <p style="color: #6b7fa3; margin: 0;">${message}</p>
              </div>` : ""}
              <div style="margin-top: 24px;">
                <a href="https://bizfuture.ai/dashboard" 
                   style="background: #00d4ff; color: #0a0f1e; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
                  View Dashboard
                </a>
              </div>
            </div>
          </div>
        `
      })
    }

    await resend.emails.send({
	from: "BizFuture.ai <onboarding@resend.dev>",
      to: email,
      subject: "Your inquiry has been sent - " + business.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a0f1e; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">BizFuture.ai</h1>
          </div>
          <div style="background: #111827; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #1e2d45;">
            <h2 style="color: #ffffff; margin-top: 0;">Inquiry Sent!</h2>
            <p style="color: #6b7fa3;">Hi ${name}, your inquiry has been sent to the seller of:</p>
            <div style="background: #0a0f1e; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #00d4ff; font-weight: bold; margin: 0;">${business.title}</p>
            </div>
            <p style="color: #6b7fa3;">The seller will contact you directly at ${email}.</p>
            <p style="color: #6b7fa3;">While you wait, browse more businesses for sale:</p>
            <div style="margin-top: 24px;">
              <a href="https://bizfuture.ai/listings"
                 style="background: #00d4ff; color: #0a0f1e; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
                Browse More Listings
              </a>
            </div>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Email error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
