import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";
import { verifAirResources } from "@/lib/resources";

const officialResources = [
  {
    publisher: "Safe Work Australia",
    title: "Workplace exposure limits — airborne contaminants",
    summary:
      "Official information about the transition to workplace exposure limits from 1 December 2026.",
    href: "https://www.safeworkaustralia.gov.au/safety-topic/managing-health-and-safety/workplace-exposure-limits-airborne-contaminants",
  },
  {
    publisher: "SafeWork NSW",
    title: "Crystalline silica",
    summary: "Official NSW information about crystalline silica hazards, duties and controls.",
    href: "https://www.safework.nsw.gov.au/hazards-a-z/hazardous-chemical/priority-chemicals/crystalline-silica",
  },
  {
    publisher: "Workplace Health and Safety Queensland",
    title: "Respirable crystalline silica",
    summary: "Queensland guidance about respirable crystalline silica and risk management.",
    href: "https://www.worksafe.qld.gov.au/safety-and-prevention/hazards/hazardous-exposures/respirable-crystalline-silica",
  },
  {
    publisher: "WorkSafe Victoria",
    title: "Crystalline silica",
    summary: "Victorian guidance covering crystalline silica risks and construction controls.",
    href: "https://www.worksafe.vic.gov.au/crystalline-silica",
  },
];

export function ResourcesPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-12 sm:py-16 lg:py-20">
        <div className="container">
          <Reveal>
            <div className="flex flex-col gap-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                  VerifAir system overview
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Download the VerifAir system flyer.
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                  A concise overview of Dustlight monitoring, configured site
                  connectivity, shared dashboards, event workflows and reporting.
                </p>
              </div>
              <a
                href="/downloads/verifair-system-overview.pdf"
                download
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="size-5" aria-hidden="true" />
                Download flyer
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Resource library
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              Device, monitoring, reporting and policy resources.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {verifAirResources.map((resource) => (
              <Link
                key={resource.slug}
                href={`/resources/${resource.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-white">
                  <Image
                    src={resource.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className={resource.slug === "verifair-platform-explainer" ? "object-contain p-8" : "object-cover"}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {resource.category}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-slate-950">
                    {resource.title}
                  </h3>
                  <p className="mt-3 flex-1 text-base leading-7 text-slate-600">
                    {resource.summary}
                  </p>
                  <span className="mt-6 font-bold text-blue-600 group-hover:underline">
                    Read resource →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Official guidance
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              Current Australian regulator information.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {officialResources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-bold text-blue-600">{resource.publisher}</p>
                  <ArrowTopRightOnSquareIcon className="size-5 text-slate-500" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{resource.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{resource.summary}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
