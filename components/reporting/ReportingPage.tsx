import {
  ArrowDownTrayIcon,
  BellAlertIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";

const reportTypes = [
  { icon: ClockIcon, title: "Live site status", body: "A current view of monitored zones, recent PM1 and PM2.5 readings and system status." },
  { icon: ClipboardDocumentListIcon, title: "Daily monitoring summary", body: "A concise summary of daily conditions, configured alerts and project notes." },
  { icon: ChartBarIcon, title: "Weekly or monthly trend report", body: "Review fine-particle trends and changes across a selected reporting period." },
  { icon: BellAlertIcon, title: "Alert-event report", body: "Document configured alert events, timing, zone context and response notes." },
  { icon: CpuChipIcon, title: "Device-health report", body: "Review device, local buffering and connectivity status across monitoring points." },
  { icon: MapIcon, title: "Site and zone comparison", body: "Compare selected zones, boundaries and occupied interfaces in one view." },
  { icon: ArrowDownTrayIcon, title: "Incident-review export", body: "Export selected records to support investigation, review and stakeholder communication." },
  { icon: DocumentChartBarIcon, title: "Project reporting pack", body: "Bring summaries, trends, alerts and project notes together for stakeholders." },
];

const contents = [
  "Project, site and reporting-period details",
  "Monitored zones and device status",
  "PM1 and PM2.5 trends",
  "Configured alert settings and alert history",
  "Known data gaps or connectivity interruptions",
  "Project notes and relevant work activities",
  "Report-generation date and authorised recipients",
];

const demoZones = [
  { zone: "Work boundary", pm1: "7", pm25: "12", status: "Normal", tone: "green" },
  { zone: "Occupied corridor", pm1: "11", pm25: "18", status: "Review", tone: "amber" },
  { zone: "External boundary", pm1: "6", pm25: "9", status: "Normal", tone: "green" },
];

export function ReportingPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Reporting
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Clear monitoring records for project teams and stakeholders.
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              VerifAir organises PM1 and PM2.5 trends, alerts, system status and
              project information into practical, reviewable reports that can be
              accessed by authorised teams from anywhere.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
              <Link
                href="/contact#project-enquiry"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                Request a sample report
              </Link>
              <Link
                href="/technology"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 font-bold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                Explore the technology
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-xl sm:p-6">
              <div className="rounded-xl bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      Demonstration data
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      Daily monitoring summary
                    </h2>
                  </div>
                  <p className="text-sm text-slate-500">Generated 08:30 AEST</p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Active zones</p>
                    <p className="mt-1 text-3xl font-bold text-slate-950">3</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Alerts today</p>
                    <p className="mt-1 text-3xl font-bold text-slate-950">1</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Data availability</p>
                    <p className="mt-1 text-3xl font-bold text-slate-950">99.4%</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Report types
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              Reporting for daily operations, review and escalation.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportTypes.map(({ icon: Icon, title, body }) => (
              <article key={title} className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Report contents
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              Enough context to make the record useful.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <ul className="mt-7 grid gap-3">
              {contents.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-7 text-slate-700">
                  <CheckCircleIcon className="mt-1 size-5 shrink-0 text-blue-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <header className="border-b border-slate-200 bg-slate-950 p-5 text-white sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-300">
                      Demonstration data
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">North Wing refurbishment</h3>
                    <p className="mt-1 text-sm text-slate-300">Daily monitoring summary · 14 August 2026</p>
                  </div>
                  <span className="inline-flex w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-300">
                    System online
                  </span>
                </div>
              </header>

              <div className="grid gap-5 p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {demoZones.map((zone) => (
                    <div key={zone.zone} className="rounded-xl border border-slate-200 p-4">
                      <p className="font-bold text-slate-950">{zone.zone}</p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500">PM1</p>
                          <p className="mt-1 text-2xl font-bold text-slate-950">{zone.pm1}<span className="ml-1 text-xs font-medium text-slate-500">µg/m³</span></p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">PM2.5</p>
                          <p className="mt-1 text-2xl font-bold text-slate-950">{zone.pm25}<span className="ml-1 text-xs font-medium text-slate-500">µg/m³</span></p>
                        </div>
                      </div>
                      <p className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${zone.tone === "amber" ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>
                        {zone.status}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-950">PM2.5 trend</p>
                      <p className="mt-1 text-sm text-slate-500">08:00–17:00 · Occupied corridor</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">Live view</span>
                  </div>
                  <svg viewBox="0 0 600 170" role="img" aria-label="Demonstration PM2.5 trend chart" className="mt-5 h-auto w-full">
                    <defs>
                      <linearGradient id="reportArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M20 140 L20 112 L85 105 L150 118 L215 82 L280 92 L345 54 L410 72 L475 46 L540 62 L580 40 L580 140 Z" fill="url(#reportArea)" />
                    <polyline points="20,112 85,105 150,118 215,82 280,92 345,54 410,72 475,46 540,62 580,40" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="140" x2="580" y2="140" stroke="#cbd5e1" strokeWidth="1" />
                  </svg>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <ExclamationTriangleIcon className="size-6 shrink-0 text-amber-700" aria-hidden="true" />
                      <div>
                        <p className="font-bold text-amber-950">Alert event · 11:42</p>
                        <p className="mt-2 text-sm leading-6 text-amber-900">
                          Occupied corridor reached the configured review level.
                          Site contact notified; barrier and work activity reviewed.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-bold text-slate-950">Data quality</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Three monitoring zones online. One 7-minute connectivity
                      interruption buffered locally and synchronised.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="bg-blue-50/70 py-16 sm:py-20">
        <div className="container">
          <Reveal>
            <div className="rounded-2xl border border-blue-200 bg-white p-7 shadow-sm sm:p-9">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                Reporting limitations
              </p>
              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-700 sm:text-lg">
                VerifAir reports can support project reviews,
                environmental-management processes, due-diligence records and
                stakeholder communication. They do not independently establish
                legal compliance, personal exposure or the composition of
                airborne material.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
