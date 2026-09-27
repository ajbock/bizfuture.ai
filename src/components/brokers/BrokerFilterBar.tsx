"use client";

import { useState } from "react";
import { CA_COUNTIES, BROKER_LANGUAGES } from "@/lib/constants/broker-options";

const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

export type BrokerFilters = {
  keyword?: string;
  state?: string;
  county?: string;
  language?: string;
};

export default function BrokerFilterBar({
  onChange,
}: {
  onChange: (filters: BrokerFilters) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [language, setLanguage] = useState("");

  const runSearch = () => {
    onChange({
      keyword: keyword || undefined,
      state: state || undefined,
      county: state === "California" ? (county || undefined) : undefined,
      language: language || undefined,
    });
  };

  const inputClass = "bg-[#0a0f1e] border border-[#1e2d45] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm";

  return (
    <div className="mb-6 bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 flex flex-wrap gap-3 items-center">
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && runSearch()}
        placeholder="Search brokers by name or brokerage..."
        className={inputClass + " flex-1 min-w-[200px]"}
      />

      <select
        className={inputClass}
        value={state}
        onChange={(e) => {
          setState(e.target.value);
          if (e.target.value !== "California") setCounty("");
        }}
      >
        <option value="">All States</option>
        {STATES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {state === "California" && (
        <select
          className={inputClass}
          value={county}
          onChange={(e) => setCounty(e.target.value)}
        >
          <option value="">All CA Counties</option>
          {CA_COUNTIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}

      <select
        className={inputClass}
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="">Any Language</option>
        {BROKER_LANGUAGES.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={runSearch}
        className="bg-cyan-400 text-[#0a0f1e] font-black px-6 py-3 rounded-xl text-sm uppercase tracking-wide hover:bg-cyan-300 transition"
      >
        Search
      </button>
    </div>
  );
}