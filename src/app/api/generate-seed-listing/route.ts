import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const cities: any = {
  "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "Fresno", "Oakland", "Santa Ana", "Anaheim"],
  "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso", "Arlington", "Plano"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Tallahassee", "St Petersburg", "Hialeah"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse", "Yonkers", "New Rochelle"],
  "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield", "Elgin"],
  "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton"],
  "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
  "Georgia": ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens", "Sandy Springs"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
  "Michigan": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Lansing"],
  "default": ["Springfield", "Franklin", "Clinton", "Georgetown", "Salem", "Madison", "Chester"]
}

function getCity(state: string): string {
  const stateCities = cities[state] || cities["default"]
  return stateCities[Math.floor(Math.random() * stateCities.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomPrice(industry: string): { asking: number; cashflow: number; revenue: number } {
  const ranges: any = {
    "Restaurants & Food": { asking: [80000, 800000], cashflow: [20000, 200000], revenue: [200000, 2000000] },
    "Retail": { asking: [50000, 500000], cashflow: [15000, 150000], revenue: [150000, 1500000] },
    "Service": { asking: [40000, 400000], cashflow: [20000, 180000], revenue: [100000, 1000000] },
    "Health Care & Fitness": { asking: [100000, 1000000], cashflow: [30000, 300000], revenue: [200000, 2000000] },
    "Automotive": { asking: [80000, 600000], cashflow: [25000, 200000], revenue: [300000, 3000000] },
    "Technology & Website": { asking: [50000, 2000000], cashflow: [20000, 500000], revenue: [100000, 5000000] },
    "Building & Construction": { asking: [100000, 1000000], cashflow: [40000, 400000], revenue: [500000, 5000000] },
    "Manufacturing": { asking: [200000, 2000000], cashflow: [50000, 500000], revenue: [500000, 5000000] },
    "Pet Services": { asking: [30000, 300000], cashflow: [15000, 120000], revenue: [80000, 800000] },
    "Beauty": { asking: [25000, 250000], cashflow: [10000, 100000], revenue: [60000, 600000] },
    "Financial Services": { asking: [100000, 1500000], cashflow: [40000, 400000], revenue: [200000, 2000000] },
    "Transportation & Storage": { asking: [100000, 800000], cashflow: [30000, 250000], revenue: [300000, 3000000] },
    "default": { asking: [50000, 500000], cashflow: [20000, 150000], revenue: [100000, 1000000] }
  }

  const range = ranges[industry] || ranges["default"]
  const asking = randomBetween(range.asking[0], range.asking[1])
  const cashflow = Math.floor(asking * (randomBetween(15, 35) / 100))
  const revenue = Math.floor(asking * (randomBetween(150, 400) / 100))

  return { asking, cashflow, revenue }
}

export async function POST(req: NextRequest) {
  try {
    const { industry, state } = await req.json()
    const city = getCity(state)
    const prices = randomPrice(industry)
    const establishedYear = randomBetween(1990, 2022)
    const employees = randomBetween(1, 25)

    const reasons = ["Retirement", "Moving to other ventures", "Relocating", "Health Reasons", "Other ventures"]
    const reason = reasons[Math.floor(Math.random() * reasons.length)]

    const prompt = `Generate a realistic business for sale listing with these details:
Industry: ${industry}
Location: ${city}, ${state}
Asking Price: $${prices.asking.toLocaleString()}
Annual Cash Flow: $${prices.cashflow.toLocaleString()}
Annual Revenue: $${prices.revenue.toLocaleString()}
Established: ${establishedYear}
Employees: ${employees}
Reason for selling: ${reason}

Generate:
1. A compelling business title (not generic, be specific to the industry and location)
2. A professional 3 paragraph description (150 words)

Respond in JSON format only:
{
  "title": "...",
  "description": "..."
}

No markdown, no backticks, just raw JSON.`

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }]
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const clean = text.trim().replace(/```json/g, "").replace(/```/g, "").trim()
    const parsed = JSON.parse(clean)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )

    const realEstateOptions = ["Own", "Lease", "Included in Price"]
    const realEstate = realEstateOptions[Math.floor(Math.random() * realEstateOptions.length)]

    const { error } = await supabase.from("businesses").insert([{
      title: parsed.title,
      description: parsed.description,
      industry,
      listing_type: "For Sale",
      asking_price: prices.asking,
      cash_flow: prices.cashflow,
      annual_revenue: prices.revenue,
      ebitda: Math.floor(prices.cashflow * 0.8),
      city,
      state,
      established_year: establishedYear,
      employees,
      reason_for_selling: reason,
      real_estate: realEstate,
      financing_available: Math.random() > 0.5,
      training_available: Math.random() > 0.4,
      status: "active",
      ad_package: "free"
    }])

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
