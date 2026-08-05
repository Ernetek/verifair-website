import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";
import { verifAirResources } from "@/lib/resources";

const categories = [
  { icon: BookOpenIcon, title: "Monitoring guides", body: "Practical guidance for planning monitoring around active work and sensitive environments." },
  { icon: WrenchScrewdriverIcon, title: "Dustlight and platform explainers", body: "Plain-language information about Dustlight devices, VerifAir connectivity and monitoring boundaries." },
  { icon: ClipboardDocumentCheckIcon, title: "Project checklists", body: "Structured prompts for locations, alerts, responsibilities and project reviews." },
  { icon: DocumentChartBarIcon, title: "Reporting guidance", body: "Information to help teams create clear, reviewable monitoring records." },
  { icon: ScaleIcon, title: "Australian legislation and policy", body: "Current official regulator information and the 1 December 2026 transition to workplace exposure limits." },
];

const officialResources = [
  {
    publisher: "Safe Work Australia",
    jurisdiction: "Australia — model WHS framework",
    title: "Workplace exposure limits — airborne contaminants",
    summary:
      "Official national information about the transition from workplace exposure standards to workplace exposure limits from 1 December 2026.",
    href: "https://www.safeworkaustralia.gov.au/safety-topic/managing-health-and-safety/workplace-exposure-limits-airborne-contaminants",
  },
  {
    publisher: "SafeWork NSW",
    jurisdiction: "New South Wales",
    title: "Workplace exposure standards",
    summary:
      "NSW guidance explaining current duties and the national transition to workplace exposure limits.",
    href: "https://www.safework.nsw.gov.au/resource-library/hazardous-chemicals/workplace-exposure-standards",
  },
  {
    publisher: "Workplace Health and Safety Queensland",
    jurisdiction: "Queensland",
    title: "New workplace exposure limits",
    summary:
      "Queensland guidance about the 1 December 2026 change and the need to review existing controls.",
    href: "https://www.worksafe.qld.gov.au/news-and-events/newsletters/esafe-newsletters/esafe-editions/esafe/december-2025/new-workplace-exposure-limits",
  },
  {
    publisher: "WorkSafe Victoria",
    jurisdiction: "Victoria",
    title: "Workplace exposure standards and limits",
    summary:
      "Victorian information about the current standards and the incoming national workplace exposure limits.",
    href: "https://www.worksafe.vic.gov.au/workplace-exposure-standards-and-limits",
  },
];

export function ResourcesPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Resources
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Practical resources for fine-particle monitoring and project planning.
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Access Dustlight explainers, deployment guides, monitoring
              checklists, reporting information and current Australian work
              health and safety sources.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl">
              <Image
                src="/assets/dustlight.webp"
                alt="Approved Dustlight particulate monitor"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-6"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-blue-200 bg-blue-50 py-12 sm:py-14">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Policy transition · 1 December 2026
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Review monitoring and control arrangements before the new workplace exposure limits take effect.
              </h2>
              <p className="mt-3 max-w-4xl text-base leading-7 text-slate-700">
                Australia will replace workplace exposure standards with
                workplace exposure limits for airborne contaminants. Requirements
                vary by jurisdiction, so confirm current obligations with the
                relevant regulator.
              </p>
            </div>
            <a
              href="https://www.safeworkaustralia.gov.au/safety-topic/managing-health-and-safety/workplace-exposure-limits-airborne-contaminants"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              Official guidance
              <ArrowTopRightOnSquareIcon className="size-5" aria-hidden="true" />
            </a>
          </div>
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
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              Guides, explainers and downloadable project material.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <a
            href="/downloads/verifair-system-overview.pdf"
            download
            className="mt-10 grid overflow-hidden rounded-2xl border border-blue-200 bg-blue-50 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div className="relative min-h-64 bg-slate-950">
              <Image
                src="/assets/platform-dashboard.webp"
                alt="VerifAir demonstration dashboard preview"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-9">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                Downloadable system overview
              </p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                VerifAir system flyer
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
                A concise two-page overview of the monitoring workflow, Dustlight
                integration, local resilience, dashboard access and typical
                project outcomes.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600">
                Download PDF
                <ArrowDownTrayIcon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </a>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {verifAirResources.map((resource) => (
              <Link
                key={resource.slug}
                href={`/resources/${resource.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                <div className="relative aspect-[16/9] bg-slate-100">
                  <Image
                    src={resource.image}
                    alt={resource.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {resource.category}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-slate-950">
                    {resource.title}
                  </h3>
                  <p className="mt-3 flex-1 leading-7 text-slate-600">
                    {resource.summary}
                  </p>
                  <span className="mt-6 font-bold text-blue-600 group-hover:underline">
                    Read resource
                  </span>
                </div>
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
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
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
                <h3 className="mt-4 text-lg font-bold text-slate-950">{resource.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{resource.summary}</p>
                <p className="mt-5 text-xs font-semibold text-slate-500">
                  Last verified: 5 August 2026
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
