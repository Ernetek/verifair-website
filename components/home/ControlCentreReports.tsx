"use client";

import Image from "next/image";
import Link from "next/link";
import { DocumentArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDeferredValue, useState } from "react";

import type { DemonstrationSessionSnapshot } from "@/lib/demonstration/session";

const OPERATIONAL_EVENT_REPORT_ID = "RPT-2026-0042";

const reports = [
  { id: OPERATIONAL_EVENT_REPORT_ID, type: "Operational event report", project: "Healthcare Construction Project", location: "Zone A · Monitoring Location 1", period: "22 Aug 2026 · 12:02–12:12", status: "Ready", summary: "Connected incident record with observations, response activity, comments and retained evidence." },
  { id: "RPT-2026-0041", type: "Daily monitoring summary", project: "Healthcare Construction Project", location: "All monitoring locations", period: "22 Aug 2026", status: "Ready", summary: "Daily particulate summary covering four monitoring locations and configured operational states." },
  { id: "RPT-2026-0040", type: "Trend and event review", project: "Healthcare Construction Project", location: "Zone A", period: "15–22 Aug 2026", status: "Ready", summary: "Trend review linking particulate observations with recorded operational events." },
  { id: "RPT-2026-0039", type: "Weekly project summary", project: "Healthcare Construction Project", location: "All monitoring locations", period: "15–21 Aug 2026", status: "Ready", summary: "Weekly project view of observations, alerts, actions and data availability." },
  { id: "RPT-2026-0038", type: "Project period report", project: "Healthcare Construction Project", location: "Project-wide", period: "1–21 Aug 2026", status: "Ready", summary: "Project-period record organised by monitoring location and operational event." },
  { id: "RPT-2026-0037", type: "Monitoring location history", project: "Healthcare Construction Project", location: "Zone A · Monitoring Location 2", period: "1–21 Aug 2026", status: "Ready", summary: "Observation and system-health history for one named monitoring location." },
  { id: "RPT-2026-0036", type: "System health and data availability", project: "Healthcare Construction Project", location: "Project-wide", period: "15–21 Aug 2026", status: "Ready", summary: "Gateway, sensor, observation freshness and data-availability history." },
  { id: "RPT-2026-0035", type: "Evidence register", project: "Healthcare Construction Project", location: "Zone A", period: "1–21 Aug 2026", status: "Draft", summary: "Index of retained photos, videos, comments and response records linked to operational events." },
] as const;

const reportTypes = ["All report types", ...new Set(reports.map((report) => report.type))];

function formatOffset(timestampMs?: number) {
  if (timestampMs === undefined) return "Pending";
  const totalMinutes = Math.floor(timestampMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function buildOperationalSummary(snapshot: DemonstrationSessionSnapshot) {
  const incident = snapshot.incidentState;
  if (incident.responses.length === 0) {
    return "Connected incident record ready to retain the saved work log, evidence, and closure history for this operational event.";
  }

  return `Connected incident record retaining ${incident.responses.length} saved work ${incident.responses.length === 1 ? "entry" : "entries"}, ${incident.evidence.length} evidence ${incident.evidence.length === 1 ? "item" : "items"}, and the closure history for this operational event.`;
}

export function ControlCentreReports({ snapshot }: { snapshot?: DemonstrationSessionSnapshot }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All report types");
  const [status, setStatus] = useState("All statuses");
  const [selectedId, setSelectedId] = useState<string>(reports[0].id);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = reports.filter((report) => {
    const matchesType = type === "All report types" || report.type === type;
    const matchesStatus = status === "All statuses" || report.status === status;
    const haystack = `${report.id} ${report.type} ${report.project} ${report.location} ${report.period}`.toLowerCase();
    return matchesType && matchesStatus && haystack.includes(deferredQuery);
  });
  const selected = filtered.find((report) => report.id === selectedId) ?? filtered[0] ?? reports[0];
  const operationalReportSelected = selected.id === OPERATIONAL_EVENT_REPORT_ID && snapshot;
  const incident = snapshot?.incidentState;
  const openedEvent = incident?.events.find((event) => event.type === "INCIDENT_OPENED");
  const closedEvent = incident?.events.find((event) => event.type === "INCIDENT_CLOSED");
  const previewSummary = operationalReportSelected ? buildOperationalSummary(snapshot) : selected.summary;
  const reportStatus = operationalReportSelected ? (incident?.closed ? "Ready" : "In progress") : selected.status;
  const stats = operationalReportSelected
    ? [
        [String(incident?.responses.length ?? 0), "Work log entries"],
        [String(incident?.evidence.length ?? 0), "Evidence items"],
        [incident?.assignedTo ?? "Unassigned", "Current owner"],
        [incident?.closed ? "Closed" : "Active", "Event status"],
      ]
    : [["4", "Monitoring locations"], ["288", "Observations"], ["1", "Operational event"], ["100%", "Data available"]];
  const includedSections = operationalReportSelected
    ? ["Observation summary and event metadata", "Assignment, ownership and priority", "Saved ticket work log", "Evidence, comments and closure history"]
    : ["Observation summary and trends", "Operational events and workflow", "Comments, actions and evidence", "System health and data availability"];

  return (
    <section className="bg-slate-100" aria-labelledby="reports-view-heading">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-700">Control Centre page</p>
        <h3 id="reports-view-heading" className="mt-1 text-xl font-black text-slate-950">Reports</h3>
        <p className="mt-1 text-xs text-slate-500">Find, review and generate connected operational reports.</p>
      </header>

      <div className="grid min-h-[42rem] lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]">
        <div className="border-b border-slate-300 bg-white p-4 lg:border-b-0 lg:border-r sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <label className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">Search reports</span>
              <span className="mt-1 flex min-h-11 items-center gap-2 border border-slate-300 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-600">
                <MagnifyingGlassIcon className="size-4 text-slate-400" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 text-sm outline-none" placeholder="ID, project, location or keyword" />
              </span>
            </label>
            <label className="grid gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">Report type
              <select value={type} onChange={(event) => setType(event.target.value)} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-900">
                {reportTypes.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">Status
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-900">
                {["All statuses", "Ready", "Draft"].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">{filtered.length} reports</p>
          <div className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
            {filtered.map((report) => (
              <button key={report.id} type="button" onClick={() => setSelectedId(report.id)} aria-pressed={selected.id === report.id} className="w-full px-3 py-4 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-pressed:bg-blue-50">
                <span className="flex items-start justify-between gap-3"><strong className="text-sm text-slate-950">{report.type}</strong><span className={`border px-2 py-0.5 text-[9px] font-black uppercase ${report.status === "Ready" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>{report.status}</span></span>
                <span className="mt-1 block font-mono text-[10px] font-bold text-blue-700">{report.id}</span>
                <span className="mt-1 block text-xs text-slate-500">{report.location} · {report.period}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No reports match those filters.</p>}
          </div>
        </div>

        <article className="m-3 self-start border border-slate-300 bg-white shadow-sm sm:m-5" aria-label="Selected report preview">
          <div className="border-b-4 border-blue-700 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <Image src="/assets/verifair_erne_tech_logo.webp" alt="VerifAir by ERNE Tech" width={204} height={68} className="h-auto w-28" />
              <div className="text-right"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Generated report</p><p className="mt-1 font-mono text-xs font-bold text-slate-900">{selected.id}</p></div>
            </div>
            <p className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-blue-700">Particulate monitoring</p>
            <h4 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{selected.type}</h4>
            <p className="mt-2 text-sm font-bold text-slate-600">{selected.project}</p>
          </div>
          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
            <dl className="grid content-start gap-3 text-sm">
              {[
                ["Reporting period", operationalReportSelected ? `${formatOffset(openedEvent?.timestampMs)}–${formatOffset(closedEvent?.timestampMs)}` : selected.period],
                ["Scope", selected.location],
                ["Record status", reportStatus],
                ["Prepared for", "Project operational review"],
              ].map(([label, value]) => <div key={label} className="border-b border-slate-200 pb-3"><dt className="text-xs font-bold text-slate-500">{label}</dt><dd className="mt-1 font-black text-slate-950">{value}</dd></div>)}
            </dl>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Executive summary</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{previewSummary}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {stats.map(([value, label]) => <div key={label} className="border border-slate-200 bg-slate-50 p-3"><strong className="block break-words text-xl text-slate-950">{value}</strong><span className="text-[10px] font-bold text-slate-500">{label}</span></div>)}
              </div>
            </div>
          </div>
          {operationalReportSelected ? (
            <div className="border-t border-slate-200 p-5 sm:p-7">
              <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Operational event details</p>
                  <dl className="mt-3 grid gap-3 text-sm">
                    {[
                      ["Incident ID", incident?.incidentId ?? "Pending"],
                      ["Workflow status", incident?.closed ? "Resolved" : incident?.progressStatus ?? "Open"],
                      ["Assignment group", incident?.assignedGroup ?? "Unassigned"],
                      ["Assignee", incident?.assignedTo ?? "Unassigned"],
                      ["Priority", incident?.priority ?? "High"],
                      ["Closure", incident?.closureDetails ?? "Pending closure"],
                    ].map(([label, value]) => (
                      <div key={label} className="border-b border-slate-200 pb-3">
                        <dt className="text-xs font-bold text-slate-500">{label}</dt>
                        <dd className="mt-1 font-black text-slate-950">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Saved ticket work log</p>
                      <p className="mt-1 text-sm font-bold text-slate-700">The completed work from the ticket is retained in the report preview.</p>
                    </div>
                    <span className="border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">
                      {incident?.responses.length ?? 0} retained entr{(incident?.responses.length ?? 0) === 1 ? "y" : "ies"}
                    </span>
                  </div>
                  {incident && incident.responses.length > 0 ? (
                    <ol className="mt-4 space-y-3">
                      {[...incident.responses].slice().reverse().map((response) => (
                        <li key={`${response.timestampMs}-${response.responseType}`} className="border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-black uppercase tracking-[0.08em] text-blue-700">{response.responseType}</p>
                            <p className="text-[11px] font-bold text-slate-500">Saved by {response.performedBy}</p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{response.details}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="mt-4 border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                      No saved work has been recorded for this event yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          <div className="border-t border-slate-200 p-5 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Included sections</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">{includedSections.map((item) => <p key={item} className="border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700">{item}</p>)}</div>
            <div className="mt-5 flex flex-wrap gap-2"><button type="button" className="inline-flex min-h-10 items-center gap-2 bg-blue-700 px-4 text-xs font-black text-white"><DocumentArrowDownIcon className="size-4" aria-hidden="true" />Generate PDF</button><Link href="/reporting" className="inline-flex min-h-10 items-center border border-slate-300 px-4 text-xs font-black text-slate-700">Open reporting centre</Link></div>
          </div>
          <p className="border-t border-slate-200 px-5 py-3 text-[10px] leading-4 text-slate-500 sm:px-7">Fictional demonstration report. Operational context only; not a regulatory or occupational exposure determination.</p>
        </article>
      </div>
    </section>
  );
}
