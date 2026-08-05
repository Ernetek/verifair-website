import Image from "next/image";
import Link from "next/link";

import { PageDisclaimer } from "@/components/legal/PageDisclaimer";
import type { MarketingPage } from "@/lib/content";

const zoneLabels: Record<string, [string, string, string]> = {
  healthcare: ["Refurbishment zone", "Clinical interface", "Occupied corridor"],
  construction: ["Active work front", "Site boundary", "Neighbouring receptor"],
  infrastructure: ["Linear work zone", "Public interface", "Compound boundary"],
  government: ["Contractor work area", "Public asset", "Oversight point"],
  schools: ["Construction zone", "Learning space", "Arrival route"],
  "commercial-buildings": ["Refurbishment floor", "Occupied tenancy", "Shared services"],
};

export function PageHero({ page }: { page: MarketingPage }) {
  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">{page.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">{page.heading}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.intro}</p>
        </div>
        {page.image ? <Image src={page.image} alt="" width={1000} height={720} className="h-auto w-full object-cover" priority /> : null}
      </div>
    </section>
  );
}

export function ContentSections({ page }: { page: MarketingPage }) {
  const zones = zoneLabels[page.slug] ?? ["Work activity", "Sensitive interface", "Monitoring point"];

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="container grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Monitoring-zone diagram</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-950">{page.title} project context</h2>
          </div>
          <div className="border border-slate-300 bg-white p-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="border border-slate-300 p-5 text-center font-bold">{zones[0]}</div>
              <div className="h-px w-12 bg-blue-600" />
              <div className="border border-slate-300 p-5 text-center font-bold">{zones[1]}</div>
            </div>
            <div className="mx-auto h-10 w-px bg-blue-600" />
            <div className="mx-auto max-w-xs bg-blue-600 p-4 text-center font-bold text-white">{zones[2]}</div>
          </div>
        </div>
      </section>

      {page.sections.map((section, index) => (
        <section key={section.title} className="border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="container grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
            <div><span className="font-mono text-sm text-blue-600">0{index + 1}</span><h2 className="mt-3 text-3xl font-bold text-slate-950">{section.title}</h2></div>
            <div>
              <p className="text-lg leading-8 text-slate-600">{section.body}</p>
              <ul className="mt-8 border-y border-slate-200">
                {section.points.map((point) => <li key={point} className="border-b border-slate-200 py-4 last:border-b-0">{point}</li>)}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

export function FinalCTA() {
  return (
    <section className="bg-slate-950 py-16 text-white">
      <div className="container flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-sm font-bold uppercase tracking-wide text-blue-300">Project discussion</p><h2 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">Discuss a monitoring approach for your project.</h2></div>
        <div className="flex flex-wrap gap-3"><Link href="/contact" className="rounded-lg bg-white px-6 py-4 font-bold text-slate-950">Contact VerifAir</Link><a href="mailto:verifair@ernelifting.com" className="px-6 py-4 font-bold text-blue-300">Email sales</a></div>
      </div>
    </section>
  );
}

export function PageDisclaimerSection() {
  return <PageDisclaimer />;
}
