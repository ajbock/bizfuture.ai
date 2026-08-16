import Link from "next/link"

export default function BrokerSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-black text-white mb-4">Application Submitted!</h1>
        <p className="text-slate-400 mb-4">Thank you for applying to the BizFuture.ai Broker Program.</p>
        <p className="text-slate-400 mb-8">We will review your application and contact you within 24 hours to set up your account.</p>
        <div className="flex flex-col gap-3">
          <Link href="/listings" className="bg-cyan-400 text-[#0a0f1e] font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide hover:bg-cyan-300 transition">
            Browse Listings
          </Link>
          <Link href="/" className="text-slate-400 text-sm hover:text-white transition">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
