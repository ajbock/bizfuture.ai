// app/api/brokers/autofill/route.ts
// Best-effort extraction only. Always returned to the user as a *draft* for review.

import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const SOCIAL_DOMAINS: Record<string, string> = {
  "facebook.com": "facebook",
  "linkedin.com": "linkedin",
  "instagram.com": "instagram",
  "x.com": "x",
  "twitter.com": "x",
  "youtube.com": "youtube",
  "tiktok.com": "tiktok",
};

const PHONE_REGEX = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Provide a valid http(s) URL." }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (BizFutureAI profile importer)" },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch that page (status ${res.status}). You can enter details manually instead.` },
        { status: 200 }
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const bodyText = $("body").text().replace(/\s+/g, " ");

    // --- JSON-LD structured data (best signal when present) ---
    let ld: any = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      if (ld) return;
      try {
        const parsed = JSON.parse($(el).contents().text());
        const candidates = Array.isArray(parsed) ? parsed : [parsed];
        ld = candidates.find((c) => c["@type"] === "Person" || c["@type"] === "Organization") || null;
      } catch {
        /* ignore malformed JSON-LD */
      }
    });

    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDesc = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");
    const pageTitle = $("title").text();

    const name = ld?.name || ogTitle || pageTitle || "";
    const about = ld?.description || ogDesc || "";
    const profile_photo_url = ld?.image?.url || ld?.image || ogImage || "";

    const phone = ld?.telephone || bodyText.match(PHONE_REGEX)?.[0] || "";
    const public_email =
      ld?.email ||
      $('a[href^="mailto:"]').attr("href")?.replace("mailto:", "") ||
      bodyText.match(EMAIL_REGEX)?.[0] ||
      "";

    // --- Social links: scan all <a href> for known domains ---
    const social_links: Record<string, string> = {};
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      for (const domain of Object.keys(SOCIAL_DOMAINS)) {
        if (href.includes(domain) && !social_links[SOCIAL_DOMAINS[domain]]) {
          social_links[SOCIAL_DOMAINS[domain]] = href;
        }
      }
    });

    return NextResponse.json({
      draft: {
        name: name.trim(),
        about: about.trim(),
        profile_photo_url,
        phone: phone.trim(),
        public_email: public_email.trim(),
        social_links,
        source_profile_url: url,
      },
      note: "This is a best-effort draft pulled from the page. Please review and correct every field before publishing.",
    });
  } catch (err) {
    console.error("Broker autofill error:", err);
    return NextResponse.json(
      { error: "Couldn't read that page automatically. You can enter your details manually instead." },
      { status: 200 }
    );
  }
}