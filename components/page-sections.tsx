import Image from "next/image";
import Link from "next/link";
import {
  ArrowsRightLeftIcon,
  BellAlertIcon,
  EyeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import type { MarketingPage } from "@/lib/content";

const zoneLabels: Record<string, [string, string, string, string]> = {
  healthcare: ["Work Zone", "Boundary / Interface", "Corridor / Transition Area", "Occupied Clinical Area"],
  construction: ["Work Zone", "Site Boundary", "Site Access / Compound", "Neighbouring Receptor"],
  infrastructure: ["Work Zone", "Public Interface", "Compound / Site Office", "Nearby Sensitive Receptor"],
  government: ["Contractor Work Area", "Public Interface", "Circulation / Access Point", "Occupied Public Area"],
  schools: ["Work Zone", "Boundary / Interface", "Circulation Area", "Occupied Teaching Area"],
  "commercial-buildings": ["Work Zone", "Boundary / Interface", "Shared Circulation", "Occupied Workspace"],
};

const zoneDescriptions = [
  "Where work is changing conditions",
  "Where the work meets a site boundary or public interface",
  "Where people move between areas",
  "Where people occupy the space day to day",
];

const zoneIcons = [MapPinIcon, EyeIcon, ArrowsRightLeftIcon, BellAlertIcon];

export function PageHero({ page }: { page: MarketingPage }) {
  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-12 lg:gap-y-8 lg:items-center">
        <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">{page.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">{page.heading}</h1>
        </div>
        {page.image ? (
          <Image
            src={page.image}
            alt={`${page.title} environment`}
            width={1000}
            height={720}
            quality={92}
            className="order-1 h-auto max-h-[16rem] w-full object-cover sm:max-h-none lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-h-none"
            priority
          />
        ) : null}
        <p className="order-3 max-w-2xl text-lg leading-8 text-slate-600 lg:order-none lg:col-start-1 lg:row-start-2">
          {page.intro}
        </p>
      </div>
    </section>
  );
}

export function ContentSections({ page }: { page: MarketingPage }) {
  const zones = zoneLabels[page.slug] ?? ["Work Zone", "Boundary / Interface", "Circulation Area", "Occupied Area"];

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="container grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Illustrative site / floor plan</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-950">{page.title} four-location monitoring layout</h2>
          </div>
          <div className="relative overflow-hidden border border-slate-300 bg-slate-950 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.16)] sm:p-7">
            <div className="absolute inset-x-0 top-0 h-1 bg-blue-400" />
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/15 pb-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">A connected project view</p>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">4 monitoring locations</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:gap-0 lg:grid-cols-4">
              {zones.map((zone, index) => {
                const Icon = zoneIcons[index];
                return (
                  <div key={zone} className="relative flex gap-4 border border-white/15 bg-white/[0.06] p-4 lg:mx-2 lg:min-h-48 lg:flex-col lg:justify-between lg:gap-5 first:lg:ml-0 last:lg:mr-0">
                    {index < zones.length - 1 ? <span className="absolute -bottom-4 left-1/2 z-10 hidden h-4 w-px bg-blue-300 lg:block lg:bottom-auto lg:left-auto lg:right-[-1px] lg:top-1/2 lg:h-px lg:w-2" aria-hidden="true" /> : null}
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center border border-blue-300/40 bg-blue-400/10 text-blue-200"><Icon className="size-5" aria-hidden="true" /></span>
                      <span className="font-mono text-xs text-slate-400">0{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{zone}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{zoneDescriptions[index]}</p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-blue-300">◈ Dustlight monitoring location</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center gap-3 border-t border-white/15 pt-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-300">
              <span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Assess conditions · Act on change · Report the response
            </div>
          </div>
        </div>
        <div className="container mt-4">
          <p className="max-w-3xl text-xs leading-5 text-slate-500">
            Illustrative four-location monitoring layout. Actual monitoring locations are configured for the project environment and
            monitoring objectives.
          </p>
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
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
              Project discussion
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold text-white sm:text-4xl">
              Discuss a monitoring approach for your project.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="cta-primary inline-flex min-h-14 items-center justify-center rounded-lg px-6 font-bold focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Contact VerifAir
            </Link>
            <a
              href="mailto:verifair@ernelifting.com"
              className="inline-flex min-h-14 items-center justify-center rounded-lg border border-white/30 !bg-transparent px-6 font-bold !text-white transition hover:!bg-white/10 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Email sales
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export function PageDisclaimerSection() {
  return null;
}
