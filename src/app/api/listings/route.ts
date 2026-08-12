import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )

    const { searchParams } = new URL(req.url)
    const state = searchParams.get("state")
    const industry = searchParams.get("industry")
    const min_price = searchParams.get("min_price")
    const max_price = searchParams.get("max_price")
    const min_cashflow = searchParams.get("min_cashflow")
    const max_cashflow = searchParams.get("max_cashflow")
    const keyword = searchParams.get("keyword")
    const listing_type = searchParams.get("listing_type")
    const limit = parseInt(searchParams.get("limit") || "20")

    let query = supabase
      .from("businesses")
      .select("id, title, description, listing_type, industry, asking_price, cash_flow, annual_revenue, ebitda, city, county, state, established_year, employees, financing_available, training_available, real_estate, created_at")
      .eq("status", "active")
      .limit(limit)
      .order("created_at", { ascending: false })

    if (state) query = query.eq("state", state)
    if (industry) query = query.eq("industry", industry)
    if (listing_type) query = query.eq("listing_type", listing_type)
    if (keyword) query = query.ilike("title", "%" + keyword + "%")
    if (min_price) query = query.gte("asking_price", Number(min_price))
    if (max_price) query = query.lte("asking_price", Number(max_price))
    if (min_cashflow) query = query.gte("cash_flow", Number(min_cashflow))
    if (max_cashflow) query = query.lte("cash_flow", Number(max_cashflow))

    const { data: listings, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      source: "BizFuture.ai",
      description: "AI-native business for sale marketplace. Query available businesses using filters.",
      total: listings?.length ?? 0,
      filters_used: { state, industry, min_price, max_price, min_cashflow, max_cashflow, keyword, listing_type },
      available_filters: {
        state: "US state name e.g. California",
        industry: "e.g. Restaurants & Food, Automotive, Technology & Website",
        min_price: "minimum asking price in USD",
        max_price: "maximum asking price in USD",
        min_cashflow: "minimum annual cash flow in USD",
        max_cashflow: "maximum annual cash flow in USD",
        keyword: "search in business title",
        listing_type: "For Sale, Wanted to Buy, or Franchise",
        limit: "number of results (default 20, max 100)"
      },
      listings: listings?.map(biz => ({
        id: biz.id,
        title: biz.title,
        description: biz.description,
        listing_type: biz.listing_type,
        industry: biz.industry,
        location: {
          city: biz.city,
          county: biz.county,
          state: biz.state,
        },
        financials: {
          asking_price_usd: biz.asking_price,
          cash_flow_usd: biz.cash_flow,
          annual_revenue_usd: biz.annual_revenue,
          ebitda_usd: biz.ebitda,
        },
        details: {
          established_year: biz.established_year,
          employees: biz.employees,
          real_estate: biz.real_estate,
          financing_available: biz.financing_available,
          training_available: biz.training_available,
        },
        url: "https://bizfuture.ai/listings/" + biz.id,
        listed_at: biz.created_at
      }))
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json",
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
