import {
  ArrowDownTrayIcon,
  BellAlertIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";

const reportTypes = [
  { icon: ClockIcon, title: "Live site status", body: "A current view of monitored zones, recent readings and system status." },
  { icon: ClipboardDocumentListIcon, title: "Daily monitoring summary", body: "A concise summary of daily conditions, alerts and project notes." },
  { icon: ChartBarIcon, title: "Weekly or monthly trend report", body: "Review trends and changes across a selected reporting period." },
  { icon: BellAlertIcon, title: "Alert-event report", body: "Document configured alert events, timing and relevant monitoring context." },
  { icon: CpuChipIcon, title: "Device-health report", body: "Review device and connectivity status across selected monitoring points." },
  { icon: MapIcon, title: "Site and zone comparison", body: "Compare monitoring information across project zones and locations." },
  { icon: ArrowDownTrayIcon, title: "Incident-review export", body: "Export selected monitoring records to support an incident or project review." },
  { icon: DocumentChartBarIcon, title: "Project reporting pack", body: "Bring selected summaries, trends and records together for stakeholders." },
];

const contents = [
  "Project and site details",
  "Reporting period",
  "Monitored zones",
  "PM1, PM2.5 and PM2.5 trends",
  "Configured alerts",
  "Alert history",
  "Device status",
  "Data gaps",
  "Project notes",
  "Report-generation date",
];

const demoRows = [
  ["Zone A — Work boundary", "PM2.5", "42 µg/m³", "Within configured range"],
  ["Zone B — Occupied corridor", "PM2.5", "11 µg/m³", "Within configured range"],
  ["Zone C — External boundary", "PM1", "7 µg/m³", "Review trend"],
];

export function ReportingPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Reporting
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Clear monitoring records for project teams and stakeholders.
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              VerifAir organises monitoring trends, alerts, system status and
              project information into practical, reviewable reports.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact#project-enquiry"
                className="inline-flex min-h-14 items-center justify-center rounded-xl bg-blue-600 px-7 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                Request a sample report
              </Link>
              <Link
                href="/technology"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 font-bold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                Explore the technology
              </Link>
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
              Practical outputs for day-to-day review and project communication.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportTypes.map(({ icon: Icon, title, body }, index) => (
              <Reveal key={title} delay={index * 0.03}>
                <article className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              What each VerifAir report includes
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              Structured information that is easier to review.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {contents.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-slate-800 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
                  Demonstration report preview
                </p>
                <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.45rem]">
                  A clear project summary without unnecessary complexity.
                </h2>
              </div>
              <span className="w-fit rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-200">
                Demonstration data
              </span>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white text-slate-950 shadow-2xl">
              <div className="grid gap-4 border-b border-slate-200 bg-slate-50 p-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Project</p>
                  <p className="mt-1 font-bold">Demonstration refurbishment</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Reporting period</p>
                  <p className="mt-1 font-bold">1–7 August 2026</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Generated</p>
                  <p className="mt-1 font-bold">8 August 2026</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[44rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                      <th className="p-5 font-bold">Monitoring zone</th>
                      <th className="p-5 font-bold">Metric</th>
                      <th className="p-5 font-bold">Example reading</th>
                      <th className="p-5 font-bold">Status note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoRows.map((row) => (
                      <tr key={row[0]} className="border-b border-slate-100 last:border-0">
                        {row.map((cell) => (
                          <td key={cell} className="p-5 text-sm text-slate-700">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 border-t border-slate-200 p-6 sm:grid-cols-3">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Alerts</p>
                  <p className="mt-2 text-2xl font-bold">2</p>
                  <p className="mt-1 text-sm text-slate-600">Configured events for review</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Data completeness</p>
                  <p className="mt-2 text-2xl font-bold">Demonstration only</p>
                  <p className="mt-1 text-sm text-slate-600">Not a production deployment metric</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Project note</p>
                  <p className="mt-2 font-bold">Review activity around Zone C</p>
                  <p className="mt-1 text-sm text-slate-600">Example note for stakeholder follow-up</p>
                </div>
              </div>
            </div>
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
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
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
