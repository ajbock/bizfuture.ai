import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <Link href="/" className="text-slate-400 text-sm hover:text-white transition">Back to Home</Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: August 2026 | Velocifuture LLC dba BizFuture.ai</p>

        <div className="flex flex-col gap-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>Velocifuture LLC, operating as BizFuture.ai ("we," "our," or "us"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform at bizfuture.ai. Please read this policy carefully. By using our platform you agree to the practices described herein.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Account registration information (name, email, password)</li>
              <li>Business listing information (title, description, financials, location, contact details)</li>
              <li>Buyer profile information (budget, industry preferences, location preferences)</li>
              <li>Broker profile information (company, license number, states licensed)</li>
              <li>Payment information (processed securely by Stripe — we do not store card details)</li>
              <li>Communications between buyers and sellers through our inquiry system</li>
              <li>Photos and images uploaded to listings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use collected information to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Provide, operate, and maintain the BizFuture.ai marketplace</li>
              <li>Match buyers with relevant business listings using AI algorithms</li>
              <li>Process payments and manage subscriptions through Stripe</li>
              <li>Send transactional emails including inquiry notifications and confirmations</li>
              <li>Auto-post Premium listings to social media platforms (X, LinkedIn) on your behalf</li>
              <li>Improve our AI listing assistant and buyer matching algorithms</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Information Sharing</h2>
            <p className="mb-3">We do not sell your personal information. We share information only in these circumstances:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li><strong className="text-white">Listing visibility:</strong> Business listing details you post are publicly visible to all users</li>
              <li><strong className="text-white">Buyer-seller contact:</strong> When a buyer submits an inquiry, their name, email and message are shared with the seller</li>
              <li><strong className="text-white">Service providers:</strong> Supabase (database), Stripe (payments), Resend (email), Anthropic (AI), Vercel (hosting)</li>
              <li><strong className="text-white">Legal requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. California Privacy Rights (CCPA)</h2>
            <p className="mb-3">As a California-based company, we comply with the California Consumer Privacy Act (CCPA). California residents have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Know what personal information we collect and how it is used</li>
              <li>Delete personal information we have collected</li>
              <li>Opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:info@bizfuture.ai" className="text-cyan-400 hover:underline">info@bizfuture.ai</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Security</h2>
            <p>We implement industry-standard security measures including SSL/TLS encryption, secure password hashing via Supabase Auth, and PCI-compliant payment processing via Stripe. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies and Tracking</h2>
            <p>We use essential cookies for authentication and session management. We do not use third-party advertising cookies or sell data to advertisers. Our AI-powered buyer matching uses only data you explicitly provide in your profile.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Data Retention</h2>
            <p>We retain your account information for as long as your account is active. Business listings are retained for 30 days after expiration then deleted. You may request deletion of your account and associated data at any time by contacting info@bizfuture.ai.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Third Party Services</h2>
            <p>Our platform integrates with third-party services including Stripe (payments), Supabase (database), Anthropic Claude (AI), Resend (email), and Vercel (hosting). Each service has its own privacy policy governing their data practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
            <p>For privacy questions or to exercise your rights under CCPA, contact:</p>
            <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-4 mt-3">
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
