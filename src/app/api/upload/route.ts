import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.]/g, "-")

    const { data, error } = await supabase.storage
      .from("listing-images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from("listing-images")
      .getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
