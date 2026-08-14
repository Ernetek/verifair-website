"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import { PageDisclaimer } from "@/components/legal/PageDisclaimer";
import { PARTICULATE_UNIT } from "@/lib/metrics";
import {
  DemonstrationSession,
  getSharedDemonstrationSession,
} from "@/lib/demonstration/session";

type ReportType =
  | "Executive summary"
  | "Particulate trends"
  | "Alert and response register"
  | "Data quality and availability"
  | "Project-period evidence pack";

type Period =
  | "Last 24 hours"
  | "Last 7 days"
  | "Last 30 days"
  | "Project to date";

const reportDescriptions: Record<ReportType, string> = {
  "Executive summary":
    "Current project position, zone status, alert workload and monitoring coverage.",
  "Particulate trends":
    "Time-series analysis by zone and metric with configured review and action references.",
  "Alert and response register":
    "A complete chronology of acknowledgements, assignments, status updates, escalation and closure.",
  "Data quality and availability":
    "Device connectivity, monitoring coverage, data gaps and recorded downtime.",
  "Project-period evidence pack":
    "A structured management record combining project context, trends, events, responses and review notes.",
};

const zones = [
  "All locations",
  "Construction Site Entry Door",
  "Construction Site Exit Door",
  "Shared Corridor",
  "General Entry Door",
] as const;

const reports = Object.keys(reportDescriptions) as ReportType[];

function TrendChart({ metric }: { readonly metric: string }) {
  return (
    <div className="border border-slate-300 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            Project trend
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-950">
            {metric} across monitored locations
          </h3>
        </div>
        <div className="flex gap-4 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-2">
            <i className="h-0.5 w-5 bg-amber-500" />
            Review reference
          </span>
          <span className="flex items-center gap-2">
            <i className="h-0.5 w-5 bg-red-600" />
            Action reference
          </span>
        </div>
      </div>
      <svg
        viewBox="0 0 900 320"
        className="mt-5 w-full"
        role="img"
        aria-label={`${metric} demonstration trend by location`}
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[45, 105, 165, 225, 285].map((y, i) => (
          <g key={y}>
            <line x1="55" y1={y} x2="875" y2={y} stroke="#e2e8f0" />
            <text x="12" y={y + 5} fill="#64748b" fontSize="12">
              {40 - i * 10}
            </text>
          </g>
        ))}
        <line x1="55" y1="165" x2="875" y2="165" stroke="#d97706" strokeWidth="2" strokeDasharray="8 7" />
        <line x1="55" y1="105" x2="875" y2="105" stroke="#dc2626" strokeWidth="2" strokeDasharray="8 7" />
        <path d="M55 258 C120 251 165 242 230 246 C300 250 338 202 405 211 C470 220 515 116 575 130 C640 145 675 193 735 178 C790 164 830 218 875 205 L875 285 L55 285Z" fill="url(#trend-fill)" />
        <path d="M55 258 C120 251 165 242 230 246 C300 250 338 202 405 211 C470 220 515 116 575 130 C640 145 675 193 735 178 C790 164 830 218 875 205" fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
        <circle cx="575" cy="130" r="8" fill="#fff" stroke="#dc2626" strokeWidth="4" />
        {[[55, "06:00"], [230, "09:00"], [405, "12:00"], [575, "15:00"], [735, "18:00"], [875, "21:00"]].map(([x, label]) => (
          <text key={label} x={x as number} y="310" textAnchor="middle" fill="#64748b" fontSize="12">
            {label}
          </text>
        ))}
      </svg>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Simulated readings. Reference lines demonstrate configured project settings and are not workplace exposure limits.
      </p>
    </div>
  );
}

function ExecutiveReport({ metric }: { readonly metric: string }) {
  const cards = [
    ["Locations online", "4 / 4", "100% coverage", "good"],
    ["Open alerts", "1", "1 action · 0 overdue", "alert"],
    ["Acknowledgement", "2 min", "Median response time", "good"],
    ["Data availability", "99.9%", "3 min recorded gap", "good"],
  ] as const;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, detail, tone]) => (
          <article
            key={label}
            className={`border-t-4 bg-white p-5 shadow-sm ${
              tone === "alert" ? "border-red-600" : "border-emerald-600"
            }`}
          >
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm text-slate-600">{detail}</p>
          </article>
        ))}
      </div>
      <TrendChart metric={metric} />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="border border-slate-300 bg-white p-5">
          <h3 className="font-black text-slate-950">Zone status</h3>
          {[
            ["Construction Site Entry Door", "Review", "18"],
            ["Construction Site Exit Door", "Normal", "7"],
            ["Shared Corridor", "Normal", "5"],
            ["General Entry Door", "Action", "29"],
          ].map(([name, status, value]) => (
            <div
              key={name}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-slate-200 py-3 last:border-0"
            >
              <span className="text-sm font-semibold">{name}</span>
              <span className="text-sm font-black">
                {value} {PARTICULATE_UNIT}
              </span>
              <span
                className={`px-2 py-1 text-xs font-black uppercase ${
                  status === "Action"
                    ? "bg-red-100 text-red-800"
                    : status === "Review"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="border border-slate-300 bg-white p-5">
          <h3 className="font-black text-slate-950">Management attention</h3>
          <ol className="mt-4 space-y-4">
            <li>
              <strong>1 action alert</strong>
              <p className="text-sm text-slate-600">
                Assigned to Jordan Lee; investigation in progress.
              </p>
            </li>
            <li>
              <strong>1 review condition</strong>
              <p className="text-sm text-slate-600">
                Acknowledged; monitoring continues.
              </p>
            </li>
            <li>
              <strong>No overdue responses</strong>
              <p className="text-sm text-slate-600">
                All demonstrated response targets remain within range.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function RegisterReport({ session }: { readonly session: DemonstrationSession }) {
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );
  const { incidentState } = snapshot;

  const rows = [
    [
      incidentState.incidentId,
      "General Entry Door",
      incidentState.triggerCondition,
      incidentState.assignedTo ?? "Jordan Lee",
      incidentState.progressStatus,
      "15 Aug · 10:44",
    ],
    ["INC-0041", "Construction Site Entry Door", "Review condition", "Maria Chen", "Closed", "15 Aug · 09:18"],
    ["INC-0040", "Shared Corridor", "Review condition", "Jordan Lee", "Closed", "14 Aug · 16:07"],
  ];

  return (
    <div className="overflow-x-auto border border-slate-300 bg-white">
      <table className="w-full min-w-[58rem] text-left text-sm">
        <thead className="bg-slate-950 text-xs uppercase tracking-wide text-white">
          <tr>
            {["Incident", "Location", "Trigger", "Assigned to", "Status", "Latest activity"].map((h) => (
              <th key={h} className="px-4 py-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-slate-200">
              {row.map((cell, i) => (
                <td key={cell} className={`px-4 py-4 ${i === 0 ? "font-mono font-bold text-blue-700" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-slate-300 bg-slate-50 p-5">
        <h3 className="text-xl font-black text-slate-950">Selected incident evidence</h3>
        <ol className="mt-3 grid gap-3 md:grid-cols-4">
          {incidentState.events.length === 0 ? (
            <li className="border-l-4 border-blue-600 bg-white p-3 text-sm font-semibold">
              10:42 Alert opened
            </li>
          ) : (
            incidentState.events.map((ev, i) => (
              <li key={`${ev.type}-${i}`} className="border-l-4 border-blue-600 bg-white p-3 text-sm font-semibold">
                {ev.type}
              </li>
            ))
          )}
        </ol>
      </div>
    </div>
  );
}

function AvailabilityReport() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
      <div className="border border-slate-300 bg-slate-950 p-6 text-white">
        <p className="text-xs font-black uppercase tracking-wide text-sky-300">
          Overall availability
        </p>
        <p className="mt-4 text-6xl font-black">99.9%</p>
        <p className="mt-3 text-slate-300">Across four configured demonstration locations.</p>
      </div>
      <div className="border border-slate-300 bg-white p-5">
        <h3 className="font-black">Location coverage and device health</h3>
        {[
          ["Construction Site Entry Door", "100%", "Online"],
          ["Construction Site Exit Door", "99.8%", "Online"],
          ["Shared Corridor", "100%", "Online"],
          ["General Entry Door", "99.9%", "Online"],
        ].map((r) => (
          <div key={r[0]} className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-slate-200 py-4 last:border-0">
            <span className="font-semibold">{r[0]}</span>
            <span className="font-black">{r[1]}</span>
            <span className="text-emerald-700">● {r[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidencePack() {
  return (
    <div className="border border-slate-300 bg-white">
      <div className="bg-slate-950 p-6 text-white">
        <p className="text-xs font-black uppercase tracking-wide text-sky-300">
          Controlled demonstration report
        </p>
        <h3 className="mt-2 text-3xl font-black">
          Project-period monitoring evidence pack
        </h3>
        <p className="mt-3 text-slate-300">
          Prepared for authorised management review · Version DEMO-1
        </p>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        {[
          ["1. Project and monitoring scope", "Locations, selected metrics, reporting period and configured project settings."],
          ["2. Data completeness statement", "Availability, device status, gaps and limitations for the reporting period."],
          ["3. Trend and event analysis", "Time-series charts, review/action references and event annotations."],
          ["4. Response evidence", "Acknowledgement, assignment, escalation, status notes and closure record."],
          ["5. Review and approvals", "Reviewer comments, exceptions, issue owners and controlled sign-off."],
          ["6. Appendices", "Detailed readings, event register and generated-report metadata."],
        ].map(([h, p]) => (
          <section key={h} className="border-b border-r border-slate-200 p-5">
            <h4 className="font-black">{h}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export function ReportingPage({
  session: sessionProp,
}: {
  readonly session?: DemonstrationSession;
}) {
  const session = sessionProp ?? getSharedDemonstrationSession();
  const [report, setReport] = useState<ReportType>("Executive summary");
  const [period, setPeriod] = useState<Period>("Last 7 days");
  const [zone, setZone] = useState<(typeof zones)[number]>("All locations");
  const [metric, setMetric] = useState("PM2.5");
  const [uploadedEvidence, setUploadedEvidence] = useState<{
    name: string;
    dataUrl: string;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("verifair-demo-photo-evidence");
      if (saved) setUploadedEvidence(JSON.parse(saved));
    } catch {}
  }, []);

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-100 py-10 sm:py-14">
        <div className="container">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            Reporting portal · demonstration data
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Detailed monitoring reports built for action and review.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Select a report, period, location and metric. Every view retains the operational context and evidence needed to understand what happened next.
              </p>
            </div>
            <Link
              href="/downloads/verifair-demonstration-report.pdf"
              className="inline-flex min-h-12 items-center bg-slate-950 px-5 font-black text-white"
            >
              Download evidence pack ↓
            </Link>
          </div>

          <div className="mt-8 grid gap-4 border border-slate-300 bg-white p-5 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Report type
              <select
                aria-label="Report type"
                value={report}
                onChange={(e) => setReport(e.target.value as ReportType)}
                className="mt-2 block min-h-12 w-full border border-blue-400 bg-blue-50 px-3 text-sm font-bold normal-case text-slate-950"
              >
                {reports.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Reporting period
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="mt-2 block min-h-12 w-full border border-slate-300 bg-white px-3 text-sm font-bold normal-case"
              >
                {["Last 24 hours", "Last 7 days", "Last 30 days", "Project to date"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Location
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as typeof zone)}
                className="mt-2 block min-h-12 w-full border border-slate-300 bg-white px-3 text-sm font-bold normal-case"
              >
                {zones.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Metric
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="mt-2 block min-h-12 w-full border border-slate-300 bg-white px-3 text-sm font-bold normal-case"
              >
                {["PM1", "PM2.5", "Respirable dust", "PM10"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 border-b border-slate-300 pb-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-blue-700">
                  {report}
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {zone} · {period}
                </h2>
              </div>
              <p className="max-w-xl text-sm text-slate-600">
                {reportDescriptions[report]}
              </p>
            </div>
          </div>

          <div className="mt-6">
            {report === "Executive summary" ? (
              <ExecutiveReport metric={metric} />
            ) : report === "Particulate trends" ? (
              <TrendChart metric={metric} />
            ) : report === "Alert and response register" ? (
              <RegisterReport session={session} />
            ) : report === "Data quality and availability" ? (
              <AvailabilityReport />
            ) : (
              <EvidencePack />
            )}
          </div>

          {report === "Alert and response register" ||
          report === "Project-period evidence pack" ? (
            <section className="mt-6 border border-slate-300 bg-white p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-blue-700">
                    Incident photo evidence
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    Evidence attached to INC-0042
                  </h3>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Available for authorised viewing and download
                </p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <article className="border border-slate-200 p-3">
                  <Image
                    src="/assets/workflow-site-investigation.webp"
                    alt="Preloaded demonstration evidence showing a site investigation"
                    width={900}
                    height={600}
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <p className="mt-3 font-bold">
                    Site investigation · preloaded evidence
                  </p>
                  <a
                    href="/assets/workflow-site-investigation.webp"
                    download
                    className="mt-2 inline-flex text-sm font-black text-blue-700"
                  >
                    Download evidence
                  </a>
                </article>
                {uploadedEvidence ? (
                  <article className="border border-blue-300 bg-blue-50 p-3">
                    <Image
                      src={uploadedEvidence.dataUrl}
                      alt="Uploaded incident photo evidence"
                      width={900}
                      height={600}
                      unoptimized
                      className="aspect-[3/2] w-full object-cover"
                    />
                    <p className="mt-3 font-bold">{uploadedEvidence.name}</p>
                    <a
                      href={uploadedEvidence.dataUrl}
                      download={uploadedEvidence.name}
                      className="mt-2 inline-flex text-sm font-black text-blue-700"
                    >
                      Download uploaded evidence
                    </a>
                  </article>
                ) : (
                  <article className="grid min-h-52 place-items-center border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600">
                    Upload photo evidence from the workflow to add it to this incident report.
                  </article>
                )}
              </div>
            </section>
          ) : null}

          <p className="mt-6 text-xs font-semibold text-slate-500">
            Generated from frozen, fictional demonstration records. Report settings and reference lines are illustrative and require project-specific competent review.
          </p>
        </div>
      </section>
      <PageDisclaimer />
    </>
  );
}
