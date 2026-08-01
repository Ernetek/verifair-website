import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";
import { verifAirResources } from "@/lib/resources";

const categories = [
  { icon: BookOpenIcon, title: "Monitoring guides", body: "Practical guidance for planning monitoring around active work and sensitive environments." },
  { icon: WrenchScrewdriverIcon, title: "Technical explainers", body: "Plain-language explanations of particulate readings and monitoring limitations." },
  { icon: ClipboardDocumentCheckIcon, title: "Project checklists", body: "Structured prompts for locations, alerts, responsibilities and project reviews." },
  { icon: DocumentChartBarIcon, title: "Reporting guidance", body: "Information to help teams create clear, reviewable monitoring records." },
  { icon: ScaleIcon, title: "Australian legislation and policy", body: "Links to current official regulator information and jurisdiction-specific guidance." },
];

const officialResources = [
  {
    publisher: "Safe Work Australia",
    jurisdiction: "Australia — model WHS framework",
    title: "Workplace exposure limits — airborne contaminants",
    summary:
      "National information about airborne contaminants and the transition to workplace exposure limits.",
    href: "https://www.safeworkaustralia.gov.au/safety-topic/managing-health-and-safety/workplace-exposure-limits-airborne-contaminants",
  },
  {
    publisher: "SafeWork NSW",
    jurisdiction: "New South Wales",
    title: "Crystalline silica",
    summary:
      "Official NSW information about crystalline silica hazards, duties and practical risk controls.",
    href: "https://www.safework.nsw.gov.au/hazards-a-z/hazardous-chemical/priority-chemicals/crystalline-silica",
  },
  {
    publisher: "Workplace Health and Safety Queensland",
    jurisdiction: "Queensland",
    title: "Respirable crystalline silica",
    summary:
      "Queensland guidance about respirable crystalline silica, legal duties and risk management.",
    href: "https://www.worksafe.qld.gov.au/safety-and-prevention/hazards/hazardous-exposures/respirable-crystalline-silica",
  },
  {
    publisher: "WorkSafe Victoria",
    jurisdiction: "Victoria",
    title: "Crystalline silica",
    summary:
      "Victorian guidance covering crystalline silica risks and construction-related controls.",
    href: "https://www.worksafe.vic.gov.au/crystalline-silica",
  },
];

export function ResourcesPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Resources
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Practical resources for dust monitoring and project planning.
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Access monitoring guides, deployment checklists, reporting
              information and links to official Australian work health and
              safety sources.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-lg font-bold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              VerifAir resources
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              Guides and checklists for project teams.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {verifAirResources.map((resource) => (
              <Link
                key={resource.slug}
                href={`/resources/${resource.slug}`}
                className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  {resource.category}
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">
                  {resource.title}
                </h3>
                <p className="mt-3 flex-1 leading-7 text-slate-600">
                  {resource.summary}
                </p>
                <span className="mt-6 font-bold text-blue-600 group-hover:underline">
                  Read resource
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Australian legislation and policy
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              Start with current official regulator guidance.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {officialResources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-blue-600">{resource.publisher}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {resource.jurisdiction}
                    </p>
                  </div>
                  <ArrowTopRightOnSquareIcon className="size-5 shrink-0 text-slate-500" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-950">{resource.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{resource.summary}</p>
                <p className="mt-5 text-xs font-semibold text-slate-500">
                  Last verified: 1 August 2026
                </p>
              </a>
            ))}
          </div>

          <div className="mt-8 rounded-xl border-l-2 border-blue-600 bg-blue-50 p-6">
            <p className="leading-7 text-slate-700">
              Information is provided for general guidance only. Work health and
              safety requirements differ between jurisdictions and may change.
              Confirm current requirements with the relevant regulator and
              obtain competent professional advice where required.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
