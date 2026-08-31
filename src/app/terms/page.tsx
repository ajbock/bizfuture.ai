import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <Link href="/" className="text-slate-400 text-sm hover:text-white transition">Back to Home</Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: August 2026 | Velocifuture LLC dba BizFuture.ai</p>

        <div className="flex flex-col gap-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using BizFuture.ai, operated by Velocifuture LLC ("Company," "we," "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our platform. We reserve the right to update these terms at any time with notice posted on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Platform Description</h2>
            <p>BizFuture.ai is an AI-powered online marketplace that connects buyers and sellers of businesses. We provide listing creation tools, AI-assisted descriptions, buyer matching, and communication facilitation. We are not brokers, agents, or parties to any transaction between buyers and sellers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must be at least 18 years old to use this platform</li>
              <li>One person or entity may not maintain multiple accounts</li>
              <li>We reserve the right to suspend accounts that violate these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Listing Rules</h2>
            <p className="mb-3">Users posting business listings agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Provide accurate and truthful information about the business</li>
              <li>Have legal authority to sell or represent the business being listed</li>
              <li>Not post fraudulent, misleading, or illegal listings</li>
              <li>Not post listings for businesses involved in illegal activities</li>
              <li>Update listings promptly when information changes or business is sold</li>
              <li>Respond to buyer inquiries in good faith and in a timely manner</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. AI-Generated Content</h2>
            <p>Our platform uses Anthropic Claude AI to assist with listing description generation. AI-generated content is provided as a starting point and may not be perfectly accurate. Sellers are responsible for reviewing and verifying all AI-generated content before publishing. BizFuture.ai is not liable for errors in AI-generated descriptions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Payments and Subscriptions</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Subscription fees are billed monthly through Stripe</li>
              <li>All fees are in US Dollars and non-refundable unless required by law</li>
              <li>You may cancel your subscription at any time through your dashboard</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Disclaimers</h2>
            <p className="mb-3">BizFuture.ai is a listing platform only. We do not:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Verify the accuracy of listing information provided by sellers</li>
              <li>Guarantee the financial performance of any listed business</li>
              <li>Provide legal, financial, or investment advice</li>
              <li>Guarantee the completion of any transaction</li>
              <li>Act as an escrow or intermediary in transactions</li>
            </ul>
            <p className="mt-3">All buyers should conduct independent due diligence before purchasing any business. We strongly recommend working with licensed brokers, attorneys, and accountants.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by California law, Velocifuture LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of BizFuture.ai. Our total liability to you for any claims shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Intellectual Property</h2>
            <p>The BizFuture.ai platform, including its design, code, and AI systems, is owned by Velocifuture LLC. You retain ownership of content you post. By posting content, you grant us a non-exclusive license to display, distribute, and promote your listings on our platform and associated social media channels.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of California. If any provision of these Terms is found unenforceable, the remaining provisions continue in full force.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact</h2>
            <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4">
              <p className="text-white font-bold">Velocifuture LLC dba BizFuture.ai</p>
              <p className="text-slate-400">Email: <a href="mailto:info@bizfuture.ai" className="text-cyan-400 hover:underline">info@bizfuture.ai</a></p>
              <p className="text-slate-400">State of Formation: California</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
