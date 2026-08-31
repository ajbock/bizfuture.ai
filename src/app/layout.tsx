import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "BizFuture.ai — Businesses For Sale | AI-Powered Marketplace",
    template: "%s | BizFuture.ai"
  },
  description: "The AI-native marketplace for buying and selling businesses. Browse 500+ businesses for sale across the USA. AI-powered buyer matching and listing creation.",
  keywords: ["businesses for sale", "buy a business", "sell a business", "business marketplace", "AI business listings"],
  openGraph: {
    title: "BizFuture.ai — Businesses For Sale",
    description: "The AI-native marketplace for buying and selling businesses.",
    url: "https://bizfuture.ai",
    siteName: "BizFuture.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BizFuture.ai — Businesses For Sale",
    description: "The AI-native marketplace for buying and selling businesses.",
  },
  metadataBase: new URL("https://bizfuture.ai"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
