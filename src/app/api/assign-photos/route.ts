import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const industrySearchTerms: any = {
  "Restaurants & Food": ["restaurant interior", "cafe business", "food restaurant", "dining restaurant", "kitchen restaurant"],
  "Retail": ["retail store interior", "shop boutique", "retail business store", "clothing store", "gift shop"],
  "Service": ["professional office", "business service", "consulting office", "service business", "office workspace"],
  "Health Care & Fitness": ["gym fitness center", "health clinic", "medical office", "fitness studio", "wellness center"],
  "Automotive": ["auto repair shop", "car dealership", "automotive service", "car wash business", "auto parts store"],
  "Technology & Website": ["tech office startup", "computer business", "software office", "tech company", "digital agency"],
  "Building & Construction": ["construction site", "building contractor", "home renovation", "construction company", "contractor business"],
  "Manufacturing": ["manufacturing facility", "factory production", "industrial manufacturing", "warehouse production", "assembly line"],
  "Pet Services": ["pet grooming salon", "veterinary clinic", "pet store", "dog grooming", "animal care"],
  "Beauty": ["hair salon interior", "beauty salon", "nail salon", "spa salon", "barbershop interior"],
  "Financial Services": ["financial advisor office", "bank office", "accounting firm", "insurance office", "wealth management"],
  "Transportation & Storage": ["trucking logistics", "warehouse storage", "delivery service", "moving company", "freight transport"],
  "Wholesale & Distributors": ["warehouse distribution", "wholesale business", "distribution center", "logistics warehouse", "supply chain"],
  "Agriculture": ["farm agriculture", "greenhouse farming", "agricultural business", "farm equipment", "organic farm"],
  "Other": ["small business", "entrepreneur office", "business storefront", "commercial property", "business opportunity"],
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )

    const { industry, limit = 50 } = await req.json()

    const { data: listings } = await supabase
      .from("businesses")
      .select("id, industry, title")
      .eq("industry", industry)
      .or("images.is.null,images.eq.{}")
      .limit(limit)

    if (!listings || listings.length === 0) {
      return NextResponse.json({ success: true, updated: 0, message: "No listings need photos" })
    }

    const searchTerms = industrySearchTerms[industry] || ["small business storefront"]
    let updated = 0
    console.log("Processing", listings.length, "listings for", industry)

    for (const listing of listings) {
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]
      const page = Math.floor(Math.random() * 10) + 1

      try {
        console.log("Fetching Unsplash for:", randomTerm)
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(randomTerm)}&page=${page}&per_page=1&orientation=landscape`,
          { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
        )
        const data = await res.json()
          console.log("Unsplash response status:", res.status, "results:", data.results?.length)

        if (data.results && data.results.length > 0) {
          const photo = data.results[0]
          const imageUrl = photo.urls.regular

          await supabase
            .from("businesses")
            .update({ images: [imageUrl] })
            .eq("id", listing.id)

          updated++
        }

        await new Promise(r => setTimeout(r, 300))
      } catch (err) {
        console.error("Photo fetch failed for", listing.id)
      }
    }

    return NextResponse.json({ success: true, updated, total: listings.length })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
