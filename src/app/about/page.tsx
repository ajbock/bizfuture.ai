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
          <p className="text-slate-400 text-lg max-w-xl mx-auto">The AI-native marketplace for buying and selling businesses. Built for how the future searches — not how the past did.</p>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-white mb-4">Our Story</h2>
          <div className="text-slate-300 leading-relaxed flex flex-col gap-4">
            <p>BizFuture.ai was founded by AJ Bock, a data analytics professional and Purdue University engineer who spent his career solving problems that large teams could not — including building a $50 prototype tool that replaced a $2 million engineering project, and delivering the first monetized EV charging network subscription platform when four program managers had failed.</p>
            <p>The idea for BizFuture.ai came from a simple observation: the business-for-sale marketplace is dominated by legacy platforms built for the Google search era. As AI search platforms like ChatGPT, Perplexity, and Grok become how people discover opportunities, nobody had built a marketplace designed for this new reality.</p>
            <p>BizFuture.ai was built from scratch in weeks — deployed from Brazil on a corporate laptop, fighting SSL blockers and corporate firewalls — as a direct competitor to platforms that have had decades to adapt but haven't.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">What Makes Us Different</h3>
            <ul className="flex flex-col gap-3 text-slate-400 text-sm">
              <li className="flex gap-2"><span className="text-cyan-400">→</span>AI writes listing descriptions instantly</li>
              <li className="flex gap-2"><span className="text-cyan-400">→</span>Clean API designed for ChatGPT and AI search</li>
              <li className="flex gap-2"><span className="text-cyan-400">→</span>Intelligent buyer-seller matching by budget and industry</li>
              <li className="flex gap-2"><span className="text-cyan-400">→</span>Auto-posts to X and LinkedIn for Premium listings</li>
              <li className="flex gap-2"><span className="text-cyan-400">→</span>Deal analysis calculator on every listing</li>
              <li className="flex gap-2"><span className="text-cyan-400">→</span>Built for 2027 — not 2007</li>
            </ul>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Our Mission</h3>
            <p className="text-slate-400 text-sm leading-relaxed">To become the world's most intelligent marketplace for buying and selling businesses — where AI matches the right buyer to the right business faster than any human broker could, and where every listing is discoverable by every AI platform on earth.</p>
            <div className="mt-4 pt-4 border-t border-[#1e2d45]">
              <p className="text-slate-500 text-xs">Operated by Velocifuture LLC</p>
              <p className="text-slate-500 text-xs">State of California</p>
            </div>
          </div>
        </div>

        <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-4">Get In Touch</h2>
          <p className="text-slate-400 mb-6">Questions, partnerships, press inquiries, or broker program information.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="mailto:info@bizfuture.ai" className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">
              info@bizfuture.ai
            </a>
            <a href="mailto:aj.bock@bizfuture.ai" className="border border-cyan-400 text-cyan-400 font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-400 hover:text-[#0a0f1e] transition">
              aj.bock@bizfuture.ai
            </a>
          </div>
        </div>

      </div>
    </main>
  )
}
