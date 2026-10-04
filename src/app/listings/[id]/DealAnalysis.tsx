"use client"

import { useState } from "react"

interface DealAnalysisProps {
  askingPrice: number
  cashFlow?: number
  defaultCashFlow?: number
  annualRevenue?: number
}

export default function DealAnalysis({ askingPrice, cashFlow = 0, annualRevenue }: DealAnalysisProps) {
  const [downPct, setDownPct] = useState(10)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(10)
  const [ownerSalary, setOwnerSalary] = useState(60000)

  const downPayment = Math.round(askingPrice * (downPct / 100))
  const loanAmount = askingPrice - downPayment
  const monthlyRate = rate / 100 / 12
  const numPayments = years * 12
  // Guard the edge cases the sliders allow: no loan (100% down), 0-year term, 0% interest
  const monthlyPayment =
    loanAmount <= 0 || numPayments <= 0
      ? 0
      : monthlyRate === 0
        ? loanAmount / numPayments
        : loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  const annualDebtService = monthlyPayment * 12
  const cashFlowAfterDebt = cashFlow - annualDebtService - ownerSalary
  const dscr = annualDebtService > 0 ? cashFlow / annualDebtService : null
  const roi = downPayment > 0 ? (cashFlowAfterDebt / downPayment) * 100 : null
  const priceToSDE = askingPrice / cashFlow
  const priceToRevenue = annualRevenue ? askingPrice / annualRevenue : null

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString()
  const good = (n: number) => n > 0 ? "text-green-400" : "text-red-400"

  return (
    <div className="bg-[#111827] border border-purple-500/30 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-white mb-2">Deal Analysis</h2>
      <p className="text-slate-500 text-xs mb-6">Estimated figures for analysis purposes only. Consult a financial advisor.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#0a0f1e] rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-1">Price/SDE Multiple</div>
          <div className="text-lg font-black text-purple-400">{priceToSDE.toFixed(1)}x</div>
        </div>
        {priceToRevenue && (
          <div className="bg-[#0a0f1e] rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Price/Revenue</div>
            <div className="text-lg font-black text-purple-400">{priceToRevenue.toFixed(1)}x</div>
          </div>
        )}
        <div className="bg-[#0a0f1e] rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-1">DSCR (Debt Service Coverage Ratio)</div>
          <div className={"text-lg font-black " + (dscr === null ? "text-slate-400" : dscr >= 1.25 ? "text-green-400" : "text-red-400")}>{dscr === null ? "N/A" : dscr.toFixed(2)}</div>
        </div>
        <div className="bg-[#0a0f1e] rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-1">Cash on Cash ROI</div>
          <div className={"text-lg font-black " + (roi === null ? "text-slate-400" : good(roi))}>{roi === null ? "N/A" : roi.toFixed(1) + "%"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Down Payment: {downPct}% ({fmt(downPayment)})</label>
          <input type="range" min="0" max="100" value={downPct} onChange={e => setDownPct(Number(e.target.value))}
            className="w-full accent-purple-400" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Interest Rate: {rate}%</label>
          <input type="range" min="0" max="18" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))}
            className="w-full accent-purple-400" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Loan Term: {years} years</label>
          <input type="range" min="0" max="30" value={years} onChange={e => setYears(Number(e.target.value))}
            className="w-full accent-purple-400" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Owner Salary: {fmt(ownerSalary)}</label>
          <input type="range" min="0" max="750000" step="5000" value={ownerSalary} onChange={e => setOwnerSalary(Number(e.target.value))}
            className="w-full accent-purple-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {[
          { label: "Down Payment (SBA 10%)", value: fmt(downPayment), color: "text-white" },
          { label: "Loan Amount", value: fmt(loanAmount), color: "text-white" },
          { label: "Monthly Payment", value: fmt(monthlyPayment) + "/mo", color: "text-white" },
          { label: "Annual Debt Service", value: fmt(annualDebtService), color: "text-red-400" },
          { label: "Owner Salary", value: fmt(ownerSalary), color: "text-red-400" },
          { label: "Cash Flow After Debt + Salary", value: fmt(cashFlowAfterDebt), color: cashFlowAfterDebt > 0 ? "text-green-400" : "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-[#1e2d45] last:border-0">
            <span className="text-slate-400 text-sm">{label}</span>
            <span className={"font-bold text-sm " + color}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
