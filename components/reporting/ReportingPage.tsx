"use client";

import { useState } from "react";

import { PageDisclaimer } from "@/components/legal/PageDisclaimer";
import { PARTICULATE_UNIT } from "@/lib/metrics";

const reportTypes = ["Operational snapshot", "Trend and event review", "Project-period report"];

export function ReportingPage() {
  const [active, setActive] = useState(0);

  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Reporting</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Monitoring information organised for operational review.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Explore a demonstration report using neutral sample data, dates and
            project labels.
          </p>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.28fr_0.72fr]">
            <div role="tablist" aria-label="Report type" className="border-y border-slate-300">
              {reportTypes.map((type, index) => (
                <button key={type} role="tab" aria-selected={active === index} onClick={() => setActive(index)} className="block w-full border-b border-slate-300 py-5 text-left font-bold text-slate-600 last:border-b-0 aria-selected:text-blue-600">
                  {type}
                </button>
              ))}
            </div>

            <div role="tabpanel" className="border border-slate-300 bg-slate-50 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-300 pb-5">
                <div><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Demonstration data</p><h2 className="mt-2 text-2xl font-bold text-slate-950">{reportTypes[active]}</h2></div>
                <p className="text-sm text-slate-500">Sample project · 1–30 June 2026</p>
              </div>
              <div className="mt-8 grid gap-8 sm:grid-cols-[0.7fr_1.3fr]">
                <div><p className="text-sm text-slate-500">PM2.5 current sample</p><p className="mt-2 text-4xl font-bold">18 <span className="text-base font-normal text-slate-500">{PARTICULATE_UNIT}</span></p></div>
                <svg viewBox="0 0 520 210" role="img" aria-label="Demonstration particulate trend"><title>Demonstration particulate trend</title><path d="M0 170 C70 160 100 80 165 120 C220 155 250 50 320 80 C390 110 430 65 520 75" fill="none" stroke="#2563eb" strokeWidth="6"/><line x1="0" x2="520" y1="120" y2="120" stroke="#d97706" strokeDasharray="10 10"/></svg>
              </div>
              <div className="mt-8 border-y border-slate-300">
                {["10:42 · Event recorded", "10:44 · Notification acknowledged", "10:51 · Response note added", "11:20 · Review completed"].map((item) => <p key={item} className="border-b border-slate-300 py-4 last:border-b-0">{item}</p>)}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-slate-950">From response to report</h2>
            <ol className="mt-8 grid border-y border-slate-300 sm:grid-cols-4">
              {["Event context", "Response record", "Review notes", "Export generated"].map((item, index) => (
                <li key={item} className="border-b border-slate-300 py-6 sm:border-b-0 sm:border-r sm:px-6 last:border-r-0">
                  <span className="font-mono text-sm text-blue-600">0{index + 1}</span>
                  <p className="mt-3 font-bold text-slate-950">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <PageDisclaimer />
    </>
  );
}
