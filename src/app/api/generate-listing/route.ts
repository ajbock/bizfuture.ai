import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { title, industry, asking_price, cash_flow, annual_revenue, city, state, established_year, employees, reason_for_selling } = await req.json()

    const prompt = `You are a professional business broker writing a compelling listing description for a business for sale. Write a 3-4 paragraph professional listing description based on these details:

Business Name/Title: ${title}
Industry: ${industry}
Location: ${city}, ${state}
Asking Price: ${asking_price ? "$" + Number(asking_price).toLocaleString() : "Not specified"}
Annual Cash Flow: ${cash_flow ? "$" + Number(cash_flow).toLocaleString() : "Not specified"}
Annual Revenue: ${annual_revenue ? "$" + Number(annual_revenue).toLocaleString() : "Not specified"}
Year Established: ${established_year || "Not specified"}
Number of Employees: ${employees || "Not specified"}
Reason for Selling: ${reason_for_selling || "Not specified"}

Write a compelling, professional description that:
- Highlights the business opportunity and key financial metrics
- Mentions the location and market opportunity
- Describes what makes this business attractive to buyers
- Ends with a call to action to inquire
- Sounds natural and professional, not like a template
- Is 150-200 words

Write only the description, no headers or labels.`

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }]
    })

    const description = message.content[0].type === "text" ? message.content[0].text : ""

    return NextResponse.json({ description })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
