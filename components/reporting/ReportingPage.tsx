"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { ControlCentreReports } from "@/components/home/ControlCentreReports";
import { HeroOperationalFlow } from "@/components/shared/HeroOperationalFlow";
import { OPERATIONAL_TIMELINE } from "@/lib/demonstration/operational-timeline";
import { DEMONSTRATION_METRICS, publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";
import { PARTICULATE_UNIT } from "@/lib/metrics";

const EVENT_OFFSET_MS = 240_000;
const INCIDENT_ID = "VA-INC-2026-0042";
const eventMonitor = publicDemonstrationScenario.monitors[0];
const displayOrder = ["RESPIRABLE_DUST", "PM1", "PM2_5", "PM10"] as const;

function valueAt(metricId: (typeof DEMONSTRATION_METRICS)[number]["id"]) {
  const readings = publicDemonstrationScenario.observations.filter(
    (observation) =>
      observation.monitorId === eventMonitor.id && observation.metricId === metricId && observation.offsetMs <= EVENT_OFFSET_MS
  );
  const observation = readings[readings.length - 1];
  return observation?.reading.status === "available" ? observation.reading.value : 0;
}

const recordObservations = displayOrder.map((metricId) => {
  const metric = DEMONSTRATION_METRICS.find((item) => item.id === metricId) ?? DEMONSTRATION_METRICS[0];
  return { ...metric, value: valueAt(metric.id) };
});

function StatePill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "red" | "green" }) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    red: "border-red-200 bg-red-50 text-red-900",
    green: "border-emerald-200 bg-emerald-50 text-emerald-900"
  };
  return (
    <span className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-black uppercase tracking-[0.08em] ${tones[tone]}`}>
      <span aria-hidden="true" className="size-2 rounded-full bg-current" />
      {children}
    </span>
  );
}

function ObservationSummary() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {recordObservations.map((observation, index) => (
        <div key={observation.id} className={`border p-3 ${index === 0 ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
            {observation.label === "Respirable Dust" ? "Respirable" : observation.label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">{observation.value}</p>
          <p className="text-[10px] font-bold text-slate-500">{PARTICULATE_UNIT}</p>
        </div>
      ))}
    </div>
  );
}

function RecordTimeline() {
  return (
    <ol className="border-l-2 border-slate-200 pl-5 sm:pl-7">
      {OPERATIONAL_TIMELINE.map(([actor, time, title, description]) => (
        <li key={`${time}-${title}`} className="relative pb-5 last:pb-0">
          <span
            className={`absolute -left-[1.65rem] top-0 flex size-5 items-center justify-center rounded-full border-2 border-white text-[9px] font-black text-white sm:-left-[2.35rem] ${actor === "SYSTEM" ? "bg-blue-700" : "bg-slate-700"}`}
            aria-hidden="true"
          >
            {actor === "SYSTEM" ? "S" : "U"}
          </span>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              {actor === "SYSTEM" ? "System" : "User"}
            </span>
            <time className="font-mono text-xs font-bold text-blue-700">{time}</time>
          </div>
          <h3 className="mt-1 text-sm font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
        </li>
      ))}
    </ol>
  );
}

function RecordDetail() {
  return (
    <section className="border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-950 p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-300">Operational Record</p>
            <h2 className="mt-2 text-2xl font-black">Sydney Hospital Project</h2>
            <p className="mt-1 text-xs text-slate-300">Work Zone · Work Zone A · {INCIDENT_ID}</p>
          </div>
          <StatePill tone="green">Resolved</StatePill>
        </div>
        <dl className="mt-5 grid gap-3 text-xs sm:grid-cols-4">
          <div>
            <dt className="text-slate-400">Created</dt>
            <dd className="mt-1 font-black">Scenario offset 00:02</dd>
          </div>
          <div>
            <dt className="text-slate-400">Resolved</dt>
            <dd className="mt-1 font-black">Scenario offset 00:12</dd>
          </div>
          <div>
            <dt className="text-slate-400">Operational state</dt>
            <dd className="mt-1 font-black text-red-300">ACTION</dd>
          </div>
          <div>
            <dt className="text-slate-400">Report status</dt>
            <dd className="mt-1 font-black text-emerald-300">AVAILABLE</dd>
          </div>
        </dl>
      </div>
      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Observations</p>
          <div className="mt-3">
            <ObservationSummary />
          </div>
          <dl className="mt-5 grid gap-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Observation freshness</dt>
              <dd className="font-black text-emerald-800">CURRENT</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">System / data health</dt>
              <dd className="font-black text-emerald-800">HEALTHY</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Acknowledged by</dt>
              <dd className="font-black">Site Manager</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Assigned to</dt>
              <dd className="font-black">Site Supervisor</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Reviewed by</dt>
              <dd className="font-black">Project Manager</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Resolved by</dt>
              <dd className="font-black">Project Manager</dd>
            </div>
          </dl>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Connected event history</p>
              <p className="mt-1 text-sm font-bold text-slate-900">Time-stamped operational record</p>
            </div>
            <StatePill>Traceable history</StatePill>
          </div>
          <div className="mt-4">
            <RecordTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendPanel() {
  const [metricId, setMetricId] = useState<(typeof DEMONSTRATION_METRICS)[number]["id"]>("RESPIRABLE_DUST");
  const metric = DEMONSTRATION_METRICS.find((item) => item.id === metricId) ?? DEMONSTRATION_METRICS[0];
  const history = publicDemonstrationScenario.observations.filter(
    (observation) =>
      observation.monitorId === eventMonitor.id && observation.metricId === metric.id && observation.reading.status === "available"
  );
  const readings = history.flatMap((observation) =>
    observation.reading.status === "available" ? [observation.reading.value] : [],
  );
  const chartLeft = 35;
  const chartRight = 615;
  const chartTop = 24;
  const chartBottom = 178;
  const minimum = Math.min(...readings, 0);
  const maximum = Math.max(...readings, 1);
  const scaleX = (index: number) =>
    readings.length <= 1
      ? chartRight
      : chartLeft + (index / (readings.length - 1)) * (chartRight - chartLeft);
  const scaleY = (value: number) =>
    chartBottom - ((value - minimum) / (maximum - minimum || 1)) * (chartBottom - chartTop);
  const trendPath = readings
    .map((value, index) => `${index === 0 ? "M" : "L"}${scaleX(index).toFixed(1)} ${scaleY(value).toFixed(1)}`)
    .join(" ");
  const latestValue = readings.at(-1) ?? 0;
  return (
    <section className="border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Historical observations</p>
          <h2 className="mt-2 text-2xl font-black">One selected trend, four available channels.</h2>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Report trend metric">
          {displayOrder.map((id) => {
            const item = DEMONSTRATION_METRICS.find((candidate) => candidate.id === id) ?? DEMONSTRATION_METRICS[0];
            return (
              <button
                key={id}
                type="button"
                aria-pressed={metricId === id}
                onClick={() => setMetricId(id)}
                className="min-h-10 border border-slate-300 px-3 text-xs font-black text-slate-700 aria-pressed:border-blue-700 aria-pressed:bg-blue-700 aria-pressed:text-white"
              >
                {item.label === "Respirable Dust" ? "Respirable" : item.label}
              </button>
            );
          })}
        </div>
      </div>
      <svg
        className="mt-5 h-60 w-full border border-slate-200 bg-slate-50"
        viewBox="0 0 640 220"
        role="img"
        aria-label={`${metric.label} historical trend for Work Zone`}
      >
        {[40, 85, 130, 175].map((y) => (
          <line key={y} x1="35" y1={y} x2="615" y2={y} stroke="#cbd5e1" strokeWidth="1" />
        ))}
        <path d={trendPath} fill="none" stroke="#0369a1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={scaleX(Math.max(readings.length - 1, 0))} cy={scaleY(latestValue)} r="6" fill="#0369a1" />
        <text x="42" y="207" fill="#64748b" fontSize="11">
          Earlier
        </text>
        <text x="570" y="207" fill="#64748b" fontSize="11">
          Current
        </text>
      </svg>
      <p className="mt-3 text-xs font-bold text-slate-600">
        {metric.label} · {history.length} observations
      </p>
    </section>
  );
}

function EventRegister() {
  return (
    <section className="border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Record Register</p>
          <h2 className="mt-2 text-2xl font-black">Find a historical event quickly.</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex min-h-10 items-center gap-2 border border-slate-300 px-3 text-xs font-bold text-slate-600">
            <MagnifyingGlassIcon className="size-4" aria-hidden="true" />
            <span className="sr-only">Search records</span>
            <input className="w-40 border-0 p-0 text-xs font-mono outline-none" value={INCIDENT_ID} readOnly aria-label="Search records" />
          </label>
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 border border-slate-300 px-3 text-xs font-black text-slate-700"
          >
            <FunnelIcon className="size-4" aria-hidden="true" />
            Filters
          </button>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-y border-slate-200 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
              {[
                "Date",
                "Incident / event ID",
                "Site",
                "Zone",
                "Monitoring location",
                "Operational state",
                "Event status",
                "Assigned to",
                "Report"
              ].map((heading) => (
                <th key={heading} className="px-3 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="px-3 py-4 font-mono">00:02</td>
              <td className="px-3 py-4 font-mono font-bold">{INCIDENT_ID}</td>
              <td className="px-3 py-4 font-bold">Sydney Hospital Project</td>
              <td className="px-3 py-4">Work Zone</td>
              <td className="px-3 py-4 font-bold">Work Zone A</td>
              <td className="px-3 py-4">
                <StatePill tone="red">Action</StatePill>
              </td>
              <td className="px-3 py-4">
                <StatePill tone="green">Resolved</StatePill>
              </td>
              <td className="px-3 py-4">Site Supervisor</td>
              <td className="px-3 py-4 font-black text-blue-700">Available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReportPreview() {
  return (
    <section className="border border-slate-300 bg-white shadow-sm">
      <div className="border-b-4 border-blue-700 p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xl font-black tracking-[0.12em] text-blue-900">VERIFAIR</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Particulate Monitoring · Operational Event Report
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Generated report</p>
            <p className="mt-1 font-mono font-bold">Scenario record</p>
          </div>
        </div>
        <h2 className="mt-8 text-3xl font-black">Sydney Hospital Project</h2>
        <p className="mt-1 text-sm font-bold text-slate-600">Work Zone · Work Zone A · {INCIDENT_ID}</p>
      </div>
      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Event summary</p>
          <dl className="mt-3 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt>Operational state</dt>
              <dd className="font-black text-red-800">ACTION</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt>Event status</dt>
              <dd className="font-black text-emerald-800">RESOLVED</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt>Created</dt>
              <dd className="font-mono font-bold">00:02</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt>Resolved</dt>
              <dd className="font-mono font-bold">00:12</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Observation summary</p>
          <div className="mt-3">
            <ObservationSummary />
          </div>
        </div>
      </div>
      <div className="grid gap-6 border-t border-slate-200 p-5 sm:p-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Operational history</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              "Configured trigger and alert",
              "Notifications and acknowledgement",
              "Assignment and investigation",
              "Recorded action and comments",
              "Subsequent observations",
              "Review and resolution"
            ].map((item) => (
              <p key={item} className="border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Review / resolution</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Operational event closed after review. This report is an operational record, not a regulatory, occupational hygiene or personal
            exposure assessment.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ReportingPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="border-b border-slate-800 bg-slate-950 py-20 text-white sm:py-28">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">VERIFAIR REPORTING</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl">
              Turn operational activity into a connected record.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              VerifAir brings observations, alerts, response activity and recorded actions together into a clear operational history for
              review and reporting.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#record-centre" className="cta-primary inline-flex min-h-12 items-center justify-center px-6 font-black">
                Explore the Record
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center border border-white/50 px-6 font-black text-white hover:bg-white/10"
              >
                Discuss Your Requirements
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/assets/reports-evidence-review.png"
              alt="VerifAir REPORT operational review"
              width={1536}
              height={1024}
              className="h-full max-h-[34rem] w-full object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-x-2 bottom-2 sm:inset-x-4 sm:bottom-4">
              <HeroOperationalFlow active="report" />
            </div>
          </div>
        </div>
      </section>
      <section id="record-centre" className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
        <div className="container">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">REPORT · Operational history</p>
          <div className="mt-5">
            <RecordDetail />
          </div>
          <div className="mt-8">
            <ControlCentreReports />
          </div>
        </div>
      </section>
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <span className="border border-slate-300 bg-white px-5 py-3 text-sm font-black">
              MONITORING
              <br />
              <span className="text-xs text-slate-500">Condition observed</span>
            </span>
            <ArrowRightIcon className="size-5 text-blue-700" aria-hidden="true" />
            <span className="border border-slate-300 bg-white px-5 py-3 text-sm font-black">
              WORKFLOW
              <br />
              <span className="text-xs text-slate-500">Response coordinated</span>
            </span>
            <ArrowRightIcon className="size-5 text-blue-700" aria-hidden="true" />
            <span className="border-2 border-blue-700 bg-blue-50 px-7 py-4 text-base font-black text-blue-950">
              REPORTING
              <br />
              <span className="text-xs text-blue-700">Connected record retained</span>
            </span>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-slate-600">
            The generated report is an output of the connected operational record, not the record itself.
          </p>
        </div>
      </section>
      <section className="border-b border-slate-200 py-14 sm:py-20">
        <div className="container">
          <EventRegister />
        </div>
      </section>
      <section className="border-b border-slate-200 py-14 sm:py-20">
        <div className="container">
          <TrendPanel />
        </div>
      </section>
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
        <div className="container">
          <ReportPreview />
        </div>
      </section>
      <section className="border-b border-slate-200 py-14 sm:py-20">
        <div className="container grid gap-6 md:grid-cols-3">
          <article className="border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">Generate report</p>
            <h2 className="mt-3 text-xl font-black">Reporting configured to project requirements.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Custom reporting configurations can organise event details, observations, timestamps, response activity and review information
              for operational needs.
            </p>
          </article>
          <article className="border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">Retention</p>
            <h2 className="mt-3 text-xl font-black">Keep the history available.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Records and reports remain available according to configured retention requirements.
            </p>
          </article>
          <article className="border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">Traceability</p>
            <h2 className="mt-3 text-xl font-black">Find the relevant history quickly.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Time-stamped operational records, recorded user actions and event chronology support practical review.
            </p>
          </article>
        </div>
      </section>
      <section className="border-b border-slate-200 py-12">
        <div className="container">
          <p className="max-w-3xl text-sm leading-6 text-slate-500">
            VerifAir reporting supports operational review. It does not replace occupational hygiene assessment, personal exposure
            monitoring, applicable regulatory obligations or professional interpretation where required.
          </p>
        </div>
      </section>
      <section className="bg-blue-700 py-16 text-white sm:py-20">
        <div className="container flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">Continue to the next capability</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-4xl">Keep the operational history connected.</h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/contact" className="cta-primary-inverse inline-flex min-h-12 items-center justify-center px-6 font-black">
              Discuss Your Requirements
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex min-h-12 items-center justify-center border border-white/60 px-6 font-black text-white hover:bg-white/10"
            >
              Explore How It Works
            </Link>
          </div>
        </div>
      </section>
      <p className="container py-4 text-xs text-slate-500">Demonstration only. Sites, events, people and readings shown are fictional and are used to demonstrate VerifAir functionality.</p>
    </main>
  );
}
