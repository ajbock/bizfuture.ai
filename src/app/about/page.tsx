import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "About BizFuture.ai" }

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="bg-[#111827] border-b border-[#1e2d45] px-6 py-4 mb-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Biz<span className="text-cyan-400">Future</span>.ai</Link>
          <Link href="/" className="text-slate-400 text-sm hover:text-white transition">Back to Home</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">

        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-white mb-4">About BizFuture.ai</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">The AI-native marketplace for buying and selling businesses. Built for how the future searches — not how the past did.</p>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-white mb-4">What We Are</h2>
          <div className="text-slate-300 leading-relaxed flex flex-col gap-4">
            <p>BizFuture.ai is a modern business marketplace that connects buyers, sellers, and brokers across the United States. Unlike legacy platforms built for the Google search era, BizFuture.ai is designed from the ground up for the AI search era — where buyers discover opportunities through ChatGPT, Perplexity, Grok, and other AI platforms.</p>
            <p>We built the infrastructure that makes business listings discoverable by every AI platform on earth, while giving sellers and brokers the tools they need to reach qualified buyers faster.</p>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-white mb-6">What Makes Us Different</h2>
          <div className="flex flex-col gap-4">
            {[
              { icon: "AI", title: "AI Listing Assistant", desc: "AI writes your listing description instantly from your business details." },
              { icon: "M", title: "Intelligent Buyer Matching", desc: "Smart matching by budget, industry and location connects the right buyers to the right listings." },
              { icon: "API", title: "AI Search Ready", desc: "Clean API designed for AI Search such as ChatGPT, Grok and Perplexity." },
              { icon: "X", title: "Social Media Auto-Posting", desc: "Auto-posts Premium listings to Social Media such as X and LinkedIn automatically." },
              { icon: "$", title: "Deal Analysis Calculator", desc: "Built-in deal analyzer on every listing so buyers can evaluate any acquisition instantly." },
              { icon: "27", title: "Built for 2027", desc: "Designed for how the world searches today — not how it searched a decade ago." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-400/10 border border-cyan-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 font-black text-xs">{icon}</span>
                </div>
                <div>
                  <div className="text-white font-bold mb-1">{title}</div>
                  <div className="text-slate-400 text-sm leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-white mb-6">Who We Serve</h2>
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-cyan-400 font-bold mb-2">Business Sellers</div>
              <p className="text-slate-400 text-sm leading-relaxed">Individual owners ready to exit, retire, or move on to their next venture.</p>
            </div>
            <div className="border-t border-[#1e2d45] pt-6">
              <div className="text-cyan-400 font-bold mb-2">Business Buyers</div>
              <p className="text-slate-400 text-sm leading-relaxed">Individual buyers, investors, and corporations looking for profitable businesses to acquire.</p>
            </div>
            <div className="border-t border-[#1e2d45] pt-6">
              <div className="text-cyan-400 font-bold mb-2">Business Brokers</div>
              <p className="text-slate-400 text-sm leading-relaxed">Licensed brokers who want to reach more qualified buyers with AI-powered tools and automatic social media exposure.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">To become the most intelligent marketplace for buying and selling businesses in the world — where AI matches the right buyer to the right business faster than any human process could, and where every listing is discoverable by every AI platform on earth.</p>
        </div>

        <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-4">Get In Touch</h2>
          <p className="text-slate-400 mb-6">Questions, broker partnerships, or press inquiries.</p>
          <a href="mailto:info@bizfuture.ai" className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition inline-block">
            info@bizfuture.ai
          </a>
        </div>

      </div>
    </main>
  )
}