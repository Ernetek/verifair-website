"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const industries = [
  {
    title: "Healthcare",
    href: "/healthcare",
    image: "/assets/healthcare_construction.webp",
    imageAlt: "Construction workers operating inside a hospital beside an occupied clinical corridor",
    copy: "Support refurbishment and construction beside live clinical environments. Compare particulate conditions across work areas, interfaces and occupied spaces so project and facility teams can coordinate a shared response.",
  },
  {
    title: "Construction",
    href: "/construction",
    image: "/assets/industry-construction-environment.webp",
    imageAlt: "Active construction work front on a project site",
    copy: "Maintain a shared view across active work fronts, boundaries and changing site conditions. Monitoring locations can move with the project while retaining connected readings and operational records.",
  },
  {
    title: "Infrastructure",
    href: "/infrastructure",
    image: "/assets/industry-infrastructure-environment.webp",
    imageAlt: "Infrastructure and civil works construction environment",
    copy: "Coordinate particulate visibility across dispersed civil works, public interfaces and multiple project zones. Teams can review current conditions without relying on a single inspection point.",
  },
  {
    title: "Government",
    href: "/government",
    image: "/assets/industry-government-environment.webp",
    imageAlt: "Government or public-sector project environment",
    copy: "Provide project stakeholders with a consistent operational view across public-sector works. Connected records support review, communication and regulator-specific reporting workflows.",
  },
  {
    title: "Schools",
    href: "/schools",
    image: "/assets/industry-education-environment.webp",
    imageAlt: "Students walking through an occupied school corridor beside external works",
    copy: "Monitor construction beside occupied classrooms, corridors and campus boundaries. Shared visibility helps project and facility teams recognise changing conditions around normal school operations.",
  },
  {
    title: "Commercial Buildings",
    href: "/commercial-buildings",
    image: "/assets/industry-commercial-environment.webp",
    imageAlt: "Commercial building refurbishment continuing beside an occupied office area",
    copy: "Keep refurbishment teams and building operators aligned while offices and shared facilities remain in use. Compare monitoring locations and retain the context behind operational responses.",
  },
] as const;

export function IndustriesSection() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const selected = industries[activeIndustry];

  return (
    <section id="industries" className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Industries</p>
        <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
          Built for construction where normal operations continue.
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Monitoring locations and workflows are configured around each project, its occupied environments and the teams responsible for what happens next.
        </p>

        <div className="mt-10 grid overflow-hidden border-y border-slate-200 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)]">
          <div className="divide-y divide-slate-200" aria-label="Industries VerifAir serves">
            {industries.map((industry, index) => {
              const expanded = activeIndustry === index;
              const panelId = `industry-panel-${index}`;
              return (
                <article key={industry.title} className={expanded ? "bg-slate-50" : "bg-white"}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setActiveIndustry(index)}
                      className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left font-black text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 sm:px-6"
                    >
                      <span><span className="mr-3 font-mono text-[10px] text-slate-400">{String(index + 1).padStart(2, "0")}</span>{industry.title}</span>
                      <ChevronDownIcon className={`size-5 shrink-0 transition-transform ${expanded ? "rotate-180 text-blue-700" : "text-slate-400"}`} aria-hidden="true" />
                    </button>
                  </h3>
                  {expanded && (
                    <div id={panelId} role="region" aria-label={`${industry.title} industry details`} className="px-5 pb-6 sm:px-6">
                      <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{industry.copy}</p>
                      <Link href={industry.href} className="mt-4 inline-flex min-h-10 items-center font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                        Explore {industry.title} →
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="relative min-h-72 bg-slate-100 sm:min-h-96 lg:min-h-[34rem]">
            <Image key={selected.image} src={selected.image} alt={selected.imageAlt} fill sizes="(min-width: 1024px) 58vw, 100vw" quality={92} className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-slate-950/85 px-5 py-4 text-white sm:px-6">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-300">Selected industry</p>
              <p className="mt-1 text-lg font-black">{selected.title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}