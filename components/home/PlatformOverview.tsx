"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ProductDemonstrationPreview } from "@/components/demonstration/ProductDemonstration";
import { PARTICULATE_UNIT } from "@/lib/metrics";
import {
  DEMO_DISCLOSURE,
  DEMO_DISCLOSURE_WITH_CONTEXT,
  type VerifAirOperationalState,
} from "@/lib/product-model";

type OverviewPanel = "monitoring" | "workflow" | "reporting";
type ZoneState = VerifAirOperationalState;
type WorkStatus =
  | "New"
  | "Acknowledged"
  | "In progress"
  | "Awaiting verification"
  | "Ready to close"
  | "Resolved";
type ReportView = "Summary report" | "Trend and event review" | "Project-period report";
type DateRange = "Last 7 days" | "Last 30 days" | "This month";

const overviewPanels: Array<{
  key: OverviewPanel;
  number: string;
  label: string;
  title: string;
  description: string;
}> = [
  {
    key: "monitoring",
    number: "01",
    label: "Monitoring",
    title: "See changing particulate conditions across selected locations.",
    description:
      "Live particulate readings, zone status and timestamped updates give authorised teams a shared operational view.",
  },
  {
    key: "workflow",
    number: "02",
    label: "Workflow",
    title: "Move an alert from review to ownership, action and closure.",
    description:
      "System checks happen automatically. When a project-defined condition opens an alert, the human workflow starts with ownership, action, escalation and a documented close reason.",
  },
  {
    key: "reporting",
    number: "03",
    label: "Reporting",
    title: "Summarise conditions, events and data availability for project review.",
    description:
      "Choose the report type and date range when you want to explore reporting in more detail. Summary reporting starts with the last seven days.",
  },
];

const outcomes = [
  ["Earlier awareness", "See changing conditions closer to when they occur."],
  ["Assigned response", "Make ownership and alert status visible to the project team."],
  ["Time-stamped records", "Retain monitoring, acknowledgements, actions and closure notes."],
  ["Structured reporting", "Carry relevant monitoring and event information into project review."],
] as const;

const zones = [
  {
    id: "zone-1",
    name: "Level 1 - Construction Site Entry Door",
    state: "ATTENTION" as const,
    pm1: 11,
    pm25: 18,
    pm10: 27,
  },
  {
    id: "zone-2",
    name: "Level 1 - Construction Site Exit Door",
    state: "NORMAL" as const,
    pm1: 4,
    pm25: 7,
    pm10: 12,
  },
  {
    id: "zone-3",
    name: "Level 1 - Shared Corridor",
    state: "NORMAL" as const,
    pm1: 3,
    pm25: 5,
    pm10: 9,
  },
  {
    id: "zone-4",
    name: "Level 1 - General Entry Door",
    state: "ACTION" as const,
    pm1: 17,
    pm25: 29,
    pm10: 36,
  },
];

const reportRows = [
  {
    zone: "Level 1 - Construction Site Entry Door",
    averages: [8, 12, 20],
    highest: "34 PM10",
    longest: "14 min",
    warnings: 3,
    actions: 0,
    downtime: "1 min",
  },
  {
    zone: "Level 1 - Construction Site Exit Door",
    averages: [4, 6, 11],
    highest: "18 PM10",
    longest: "5 min",
    warnings: 0,
    actions: 0,
    downtime: "0 min",
  },
  {
    zone: "Level 1 - Shared Corridor",
    averages: [3, 5, 9],
    highest: "16 PM10",
    longest: "4 min",
    warnings: 0,
    actions: 0,
    downtime: "2 min",
  },
  {
    zone: "Level 1 - General Entry Door",
    averages: [12, 19, 31],
    highest: "52 PM10",
    longest: "18 min",
    warnings: 4,
    actions: 1,
    downtime: "0 min",
  },
] as const;

const stateStyles: Record<ZoneState, string> = {
  NORMAL: "border-emerald-300 bg-emerald-50 text-emerald-900",
  ATTENTION: "border-amber-300 bg-amber-50 text-amber-950",
  ACTION: "border-red-300 bg-red-50 text-red-900",
};

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function SystemAutomationStrip({ state }: { state: ZoneState }) {
  return (
    <div className="border-y border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
        <span className="mr-1 uppercase tracking-wide text-slate-500">Automated system checks</span>
        {["Detected", "Transferred", "Evaluated"].map((item, index) => (
          <span key={item} className="inline-flex items-center gap-2">
            <span className="inline-flex min-h-8 items-center border border-emerald-200 bg-emerald-50 px-2.5 text-emerald-800">
              {item} - complete
            </span>
            {index < 2 ? <span className="text-slate-400" aria-hidden="true">-&gt;</span> : null}
          </span>
        ))}
        <span className={`ml-auto inline-flex min-h-8 items-center border px-2.5 ${stateStyles[state]}`}>
          {state === "NORMAL" ? "No alert opened" : state === "ATTENTION" ? "Attention state" : "Action alert opened"}
        </span>
      </div>
    </div>
  );
}

function WorkflowTrend({ state }: { state: ZoneState }) {
  const pm25 =
    state === "ACTION"
      ? "M35 148 C105 142 160 126 220 130 C285 134 340 105 400 110 C455 115 500 72 555 76 C585 79 608 76 625 77"
      : state === "ATTENTION"
        ? "M35 158 C105 153 160 144 220 147 C285 151 340 136 400 139 C455 143 510 130 565 133 C590 135 610 133 625 134"
        : "M35 169 C105 166 160 158 220 161 C285 164 340 154 400 157 C455 160 510 153 565 155 C590 157 610 155 625 156";
  const pm10 =
    state === "ACTION"
      ? "M35 139 C105 131 160 113 220 120 C285 126 340 92 400 99 C455 105 500 62 555 68 C585 72 608 68 625 69"
      : "M35 151 C105 145 160 135 220 139 C285 143 340 126 400 131 C455 136 510 120 565 124 C590 126 610 124 625 125";

  return (
    <div className="overflow-hidden border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Recent particulate trend</p>
        <p className="text-[0.68rem] font-semibold text-slate-500">Project configuration</p>
      </div>
      <svg
        viewBox="0 0 650 205"
        className="mt-2 w-full"
        role="img"
        aria-label="Demonstration PM1, PM2.5 and PM10 trend with horizontal attention and action operational triggers"
      >
        {[40, 80, 120, 160, 190].map((y) => (
          <line key={y} x1="35" y1={y} x2="625" y2={y} stroke="#e2e8f0" />
        ))}
        <line x1="35" y1="130" x2="625" y2="130" stroke="#d97706" strokeWidth="2" strokeDasharray="7 7" />
        <line x1="35" y1="86" x2="625" y2="86" stroke="#dc2626" strokeWidth="2" strokeDasharray="7 7" />
        <text x="470" y="121" fill="#92400e" fontSize="10" fontWeight="700">Attention trigger</text>
        <text x="482" y="77" fill="#991b1b" fontSize="10" fontWeight="700">Action setting</text>
        {state === "ACTION" ? (
          <g>
            <rect x="474" y="39" width="106" height="47" fill="#fee2e2" fillOpacity="0.65" />
            <text x="484" y="32" fill="#991b1b" fontSize="9" fontWeight="700">10 min sustained</text>
          </g>
        ) : null}
        <path d="M35 177 C105 173 160 168 220 170 C285 173 340 163 400 166 C455 169 510 162 565 164 C590 165 610 164 625 164" fill="none" stroke="#0284c7" strokeWidth="4" />
        <path d={pm25} fill="none" stroke="#059669" strokeWidth="4" />
        <path d={pm10} fill="none" stroke="#7c3aed" strokeWidth="4" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-[0.68rem] font-semibold">
        <span className="text-sky-700">PM1</span>
        <span className="text-emerald-700">PM2.5</span>
        <span className="text-violet-700">PM10</span>
        <span className="text-amber-700">Attention trigger</span>
        <span className="text-red-700">Action setting</span>
      </div>
    </div>
  );
}

function HumanWorkflowMotion({ stage }: { stage: number }) {
  const steps = ["Alert opened", "Assigned", "Work started", "Verification", "Resolved"];

  return (
    <ol className="workflow-human" aria-label="Human response workflow">
      {steps.map((label, index) => {
        const complete = index < stage;
        const current = index === stage;
        return (
          <li key={label} className="workflow-human__item">
            <span className={`workflow-human__node ${complete ? "is-complete" : current ? "is-current" : ""}`}>
              {String(index + 1).padStart(2, "0")}
              {current ? <span className="workflow-human__pulse" aria-hidden="true" /> : null}
            </span>
            <span className="workflow-human__label">{label}</span>
            {index < steps.length - 1 ? (
              <span className={`workflow-human__connector ${index < stage ? "is-complete" : ""}`} aria-hidden="true">
                <span className="workflow-human__arrow" />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function WorkflowDashboardDemo() {
  const [zoneIndex, setZoneIndex] = useState(3);
  const [status, setStatus] = useState<WorkStatus>("New");
  const [assignee, setAssignee] = useState("");
  const [escalated, setEscalated] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const zone = zones[zoneIndex];

  useEffect(() => {
    setStatus("New");
    setAssignee("");
    setEscalated(false);
    setCloseReason("");
  }, [zoneIndex]);

  const stage = useMemo(() => {
    if (zone.state === "NORMAL") return -1;
    if (status === "Resolved") return 4;
    if (status === "Awaiting verification" || status === "Ready to close") return 3;
    if (status === "In progress") return 2;
    if (assignee || status === "Acknowledged") return 1;
    return 0;
  }, [assignee, status, zone.state]);

  const canResolve = status === "Ready to close" && closeReason.trim().length >= 10;

  return (
    <div className="overflow-hidden border border-slate-300 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]">
      <div className="grid gap-4 border-b border-slate-300 bg-slate-50 px-4 py-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Response workflow</p>
          <p className="mt-1 font-bold text-slate-950">Demonstration Project</p>
        </div>
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
          Selected zone
          <select
            value={zoneIndex}
            onChange={(event) => setZoneIndex(Number(event.target.value))}
            className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 lg:min-w-[22rem]"
          >
            {zones.map((item, index) => (
              <option key={item.id} value={index}>Zone {index + 1} - {item.name}</option>
            ))}
          </select>
        </label>
      </div>

      <SystemAutomationStrip state={zone.state} />

      <div className="p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Zone status</p>
            <span className={`mt-2 inline-flex border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${stateStyles[zone.state]}`}>
              {zone.state}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["PM1", zone.pm1], ["PM2.5", zone.pm25], ["PM10", zone.pm10]].map(([metric, value]) => (
              <div key={metric} className="border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">{metric}</p>
                <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
                <p className="text-[0.62rem] font-semibold text-slate-500">{PARTICULATE_UNIT}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <WorkflowTrend state={zone.state} />
        </div>

        {zone.state === "NORMAL" ? (
          <div className="mt-5 border-l-4 border-emerald-600 bg-emerald-50 px-4 py-4">
            <p className="font-bold text-emerald-950">Automated evaluation complete. No human response workflow opened.</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">The green demonstration zone remains visible in monitoring and reporting without creating unnecessary response tasks.</p>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Human response workflow</p>
            <div className="mt-4">
              <HumanWorkflowMotion stage={stage} />
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Alert status</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{status}</p>
                  </div>
                  {escalated ? <span className="border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-black uppercase text-red-800">Escalated</span> : null}
                </div>

                <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Assign task to user
                  <select
                    value={assignee}
                    onChange={(event) => setAssignee(event.target.value)}
                    disabled={status === "Resolved"}
                    className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-950 disabled:bg-slate-100"
                  >
                    <option value="">Select user</option>
                    <option value="Site Supervisor">Site Supervisor</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="HSE Lead">HSE Lead</option>
                    <option value="Facilities Manager">Facilities Manager</option>
                  </select>
                </label>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => assignee && setStatus("Acknowledged")}
                    disabled={!assignee || status === "Resolved"}
                    className="inline-flex min-h-11 items-center justify-center border border-slate-300 bg-white px-4 text-sm font-bold text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Assign task
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("In progress")}
                    disabled={!assignee || status === "Resolved"}
                    className="inline-flex min-h-11 items-center justify-center bg-blue-600 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {zone.state === "ATTENTION" ? "Start review" : "Start work"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEscalated(true);
                      if (!assignee) setAssignee("HSE Lead");
                      if (status === "New") setStatus("Acknowledged");
                    }}
                    disabled={status === "Resolved"}
                    className="inline-flex min-h-11 items-center justify-center border border-red-300 bg-red-50 px-4 text-sm font-bold text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Escalate
                  </button>
                </div>

                <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Progress status
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as WorkStatus)}
                    disabled={status === "Resolved"}
                    className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-950 disabled:bg-slate-100"
                  >
                    <option>New</option>
                    <option>Acknowledged</option>
                    <option>In progress</option>
                    <option>Awaiting verification</option>
                    <option>Ready to close</option>
                    <option value="Resolved" disabled>Resolved</option>
                  </select>
                </label>
              </div>

              <div className="border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Resolve alert</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Set the status to Ready to close, then record the reason before resolving the alert.</p>
                <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Closure reason - required
                  <textarea
                    value={closeReason}
                    onChange={(event) => setCloseReason(event.target.value)}
                    disabled={status === "Resolved"}
                    required
                    rows={4}
                    placeholder="Example: work stopped, controls checked, area cleaned and particulate conditions returned to the configured range."
                    className="mt-2 block w-full resize-y border border-slate-300 bg-white p-3 text-sm font-medium normal-case tracking-normal text-slate-950 disabled:bg-slate-100"
                  />
                </label>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => canResolve && setStatus("Resolved")}
                    disabled={!canResolve}
                    className="inline-flex min-h-11 items-center justify-center bg-slate-950 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Resolve alert
                  </button>
                  <span className="text-xs font-semibold text-slate-500">
                    {status === "Resolved" ? "Closed reason recorded" : canResolve ? "Ready to resolve" : "Closure reason required before resolution"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 border-l-4 border-blue-600 bg-blue-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-800">Latest response activity</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {status === "Resolved"
                  ? `Resolved by ${assignee || "assigned user"}. Closure reason recorded.`
                  : assignee
                    ? `${status}. Owner: ${assignee}${escalated ? ". Escalation recorded." : "."}`
                    : zone.state === "ATTENTION"
                      ? "Attention state opened. No task has been assigned yet."
                      : "Action alert opened. Awaiting assignment."}
              </p>
            </div>
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-slate-500">{DEMO_DISCLOSURE} {DEMO_DISCLOSURE_WITH_CONTEXT}</p>
      </div>
    </div>
  );
}

function SmallReportTrend({ zoneIndex }: { zoneIndex: number }) {
  const tone = zones[zoneIndex].state;
  const pm25 = tone === "ACTION" ? "M30 100 C95 96 135 78 190 82 C240 86 285 54 335 59 C390 65 430 34 485 41 C520 45 548 42 570 44" : "M30 105 C95 101 135 92 190 95 C240 98 285 86 335 89 C390 92 430 80 485 84 C520 87 548 84 570 85";
  return (
    <svg viewBox="0 0 600 145" className="w-full" role="img" aria-label="Compact demonstration PM trend">
      {[30, 65, 100, 130].map((y) => <line key={y} x1="30" y1={y} x2="570" y2={y} stroke="#e2e8f0" />)}
      <line x1="30" y1="81" x2="570" y2="81" stroke="#d97706" strokeDasharray="6 6" strokeWidth="2" />
      <line x1="30" y1="48" x2="570" y2="48" stroke="#dc2626" strokeDasharray="6 6" strokeWidth="2" />
      <path d="M30 116 C95 113 135 108 190 110 C245 112 285 103 335 106 C390 109 430 102 485 104 C520 106 548 104 570 104" fill="none" stroke="#0284c7" strokeWidth="3" />
      <path d={pm25} fill="none" stroke="#059669" strokeWidth="3" />
      <path d="M30 108 C95 102 135 88 190 92 C240 96 285 78 335 83 C390 88 430 70 485 75 C520 79 548 76 570 77" fill="none" stroke="#7c3aed" strokeWidth="3" />
    </svg>
  );
}

function SummaryReport({ dateRange, zoneIndex }: { dateRange: DateRange; zoneIndex: number }) {
  return (
    <div className="mt-5">
      <div className="overflow-x-auto border-y border-slate-300">
        <table className="w-full min-w-[58rem] border-collapse text-left text-sm">
          <caption className="sr-only">Demonstration zone summary for {dateRange}</caption>
          <thead className="bg-slate-50 text-[0.68rem] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Zone</th>
              <th className="px-3 py-3">Avg PM1</th>
              <th className="px-3 py-3">Avg PM2.5</th>
              <th className="px-3 py-3">Avg PM10</th>
              <th className="px-3 py-3">Highest recorded</th>
              <th className="px-3 py-3">Longest duration</th>
              <th className="px-3 py-3">Warnings</th>
              <th className="px-3 py-3">Actions</th>
              <th className="px-3 py-3">Downtime</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((row, index) => (
              <tr key={row.zone} className={`border-t border-slate-200 ${index === zoneIndex ? "bg-blue-50" : "bg-white"}`}>
                <td className="px-3 py-3 font-semibold text-slate-950">Zone {index + 1}</td>
                <td className="px-3 py-3">{row.averages[0]}</td>
                <td className="px-3 py-3">{row.averages[1]}</td>
                <td className="px-3 py-3">{row.averages[2]}</td>
                <td className="px-3 py-3">{row.highest.split(" ")[0]} {PARTICULATE_UNIT} {row.highest.split(" ")[1]}</td>
                <td className="px-3 py-3">{row.longest}</td>
                <td className="px-3 py-3">{row.warnings}</td>
                <td className="px-3 py-3">{row.actions}</td>
                <td className="px-3 py-3">{row.downtime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_0.3fr] lg:items-center">
        <div className="border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Compact trend - Zone {zoneIndex + 1}</p>
            <p className="text-xs font-semibold text-slate-500">{dateRange}</p>
          </div>
          <SmallReportTrend zoneIndex={zoneIndex} />
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <div className="border border-slate-200 bg-slate-50 p-3">
            <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">Data availability</dt>
            <dd className="mt-2 text-xl font-black text-slate-950">99.9%</dd>
          </div>
          <div className="border border-slate-200 bg-slate-50 p-3">
            <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">Recorded downtime</dt>
            <dd className="mt-2 text-xl font-black text-slate-950">3 min</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function TrendEventReport({ zoneIndex, dateRange }: { zoneIndex: number; dateRange: DateRange }) {
  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[0.65fr_0.35fr]">
      <div className="border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-bold text-slate-950">Zone {zoneIndex + 1} particulate trend</p>
          <p className="text-xs font-semibold text-slate-500">{dateRange}</p>
        </div>
        <div className="mt-2"><SmallReportTrend zoneIndex={zoneIndex} /></div>
      </div>
      <ol className="border-y border-slate-300">
        {["Warning recorded", "Project contact acknowledged", "Response note added", "Review completed"].map((item, index) => (
          <li key={item} className="border-b border-slate-200 py-3 last:border-b-0">
            <span className="text-xs font-bold text-blue-700">{String(index + 1).padStart(2, "0")}</span>
            <span className="ml-3 text-sm font-semibold text-slate-800">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProjectPeriodReport({ dateRange }: { dateRange: DateRange }) {
  const rows = [
    ["Project", "Demonstration Project"],
    ["Report period", dateRange],
    ["Monitoring locations", "4 configured locations"],
    ["Metrics", "Respirable Dust, PM1, PM2.5 and PM10"],
    ["Warnings", "7 demonstration warnings"],
    ["Actions", "1 demonstration action"],
    ["Recorded downtime", "3 minutes"],
    ["Review status", "Ready for project review"],
  ];
  return (
    <div className="mt-5 border-y border-slate-300">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 border-b border-slate-200 py-3 last:border-b-0 sm:grid-cols-[11rem_1fr]">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-sm font-semibold text-slate-950">{value}</p>
        </div>
      ))}
    </div>
  );
}

function ReportingDashboardDemo() {
  const reducedMotion = useReducedMotion();
  const [view, setView] = useState<ReportView>("Summary report");
  const [dateRange, setDateRange] = useState<DateRange>("Last 7 days");
  const [zoneIndex, setZoneIndex] = useState(0);
  const [reportTouched, setReportTouched] = useState(false);

  return (
    <div className="overflow-hidden border border-slate-300 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]">
      <div className="grid gap-4 border-b border-slate-300 bg-slate-50 px-4 py-4 xl:grid-cols-[1fr_auto_auto_auto] xl:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Reporting dashboard</p>
          <p className="mt-1 font-bold text-slate-950">Demonstration Project</p>
        </div>

        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Report view
          <span className="relative mt-2 block">
            <select
              value={view}
              onChange={(event) => {
                setView(event.target.value as ReportView);
                setReportTouched(true);
              }}
              className={`block min-h-11 w-full border bg-white px-3 pr-10 text-sm font-semibold normal-case tracking-normal text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${!reportTouched && !reducedMotion ? "platform-control-highlight border-blue-400" : "border-slate-300"}`}
            >
              <option>Summary report</option>
              <option>Trend and event review</option>
              <option>Project-period report</option>
            </select>
            {!reportTouched ? <span className="pointer-events-none absolute -right-2 -top-2 bg-blue-600 px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-wide text-white">Choose view</span> : null}
          </span>
        </label>

        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Date range
          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value as DateRange)}
            className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
          </select>
        </label>

        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Highlight zone
          <select
            value={zoneIndex}
            onChange={(event) => setZoneIndex(Number(event.target.value))}
            className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {zones.map((zone, index) => <option key={zone.id} value={index}>Zone {index + 1}</option>)}
          </select>
        </label>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Selected report</p>
            <h4 className="mt-1 text-xl font-bold text-slate-950">{view}</h4>
          </div>
          <span className="border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-blue-800">{DEMO_DISCLOSURE}</span>
        </div>

        {view === "Summary report" ? <SummaryReport dateRange={dateRange} zoneIndex={zoneIndex} /> : null}
        {view === "Trend and event review" ? <TrendEventReport zoneIndex={zoneIndex} dateRange={dateRange} /> : null}
        {view === "Project-period report" ? <ProjectPeriodReport dateRange={dateRange} /> : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <p className="text-xs leading-5 text-slate-500">{DEMO_DISCLOSURE_WITH_CONTEXT}</p>
          <Link href="/downloads/verifair-demonstration-report.pdf" className="cta-primary inline-flex min-h-11 items-center justify-center px-4 text-sm font-bold">Export demonstration PDF</Link>
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

export function PlatformOverviewSection() {
  const reducedMotion = useReducedMotion();
  const [activePanel, setActivePanel] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const navRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activePanelRef = useRef(0);
  const [carouselInView, setCarouselInView] = useState(false);
  const [carouselReset, setCarouselReset] = useState(0);

  const goToPanel = useCallback((index: number, focusNav = false) => {
    const next = Math.max(0, Math.min(index, overviewPanels.length - 1));
    const track = trackRef.current;
    const panel = panelRefs.current[next];
    activePanelRef.current = next;
    setActivePanel(next);
    if (track && panel) {
      track.scrollTo({ left: panel.offsetLeft - track.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    }
    if (focusNav) window.requestAnimationFrame(() => navRefs.current[next]?.focus());
  }, [reducedMotion]);

  useEffect(() => {
    activePanelRef.current = activePanel;
  }, [activePanel]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.panelIndex);
        if (!Number.isNaN(index)) {
          activePanelRef.current = index;
          setActivePanel(index);
        }
      },
      { root: track, threshold: [0.55, 0.75] },
    );
    panelRefs.current.forEach((panel) => panel && observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncHash = () => {
      const hashMap: Record<string, number> = {
        "#platform": 0,
        "#monitoring": 0,
        "#workflow": 1,
        "#reportpreview": 2,
      };
      const target = hashMap[window.location.hash];
      if (target === undefined) return;
      window.requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ block: "start", behavior: reducedMotion ? "auto" : "smooth" });
        window.setTimeout(() => goToPanel(target), reducedMotion ? 0 : 180);
      });
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [goToPanel, reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateVisibility = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const sectionCrossesReadingBand =
        rect.top < viewportHeight * 0.68 &&
        rect.bottom > viewportHeight * 0.32;
      setCarouselInView(sectionCrossesReadingBand);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !carouselInView) return;

    const timer = window.setTimeout(() => {
      const section = sectionRef.current;
      const focused = document.activeElement as HTMLElement | null;
      const userIsWorkingInDashboard =
        Boolean(section && focused && section.contains(focused)) &&
        Boolean(focused?.closest("select, textarea, input, button"));

      if (document.hidden || userIsWorkingInDashboard) {
        setCarouselReset((value) => value + 1);
        return;
      }

      goToPanel((activePanelRef.current + 1) % overviewPanels.length);
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [activePanel, carouselInView, carouselReset, goToPanel, reducedMotion]);

  return (
    <section ref={sectionRef} id="platform" className="relative scroll-mt-24 border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
      <span id="monitoring" className="pointer-events-none absolute left-0 top-0 block size-px" aria-hidden="true" />
      <span id="workflow" className="pointer-events-none absolute left-0 top-0 block size-px" aria-hidden="true" />
      <span id="reportpreview" className="pointer-events-none absolute left-0 top-0 block size-px" aria-hidden="true" />

      <div className="container">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Platform overview</p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">Monitoring, response workflow and reporting in one connected project view.</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">The overview advances automatically every 7 seconds while it is in view. Use the screen controls, swipe or the Previous and Next buttons at any time; autoplay pauses while you are working with dashboard controls.</p>
        </div>

        <div className="mt-9 flex flex-col gap-4 border-y border-slate-300 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div aria-label="Platform overview screens" className="flex flex-wrap gap-2">
            {overviewPanels.map((panel, index) => (
              <button
                key={panel.key}
                ref={(element) => { navRefs.current[index] = element; }}
                type="button"
                aria-pressed={activePanel === index}
                aria-current={activePanel === index ? "step" : undefined}
                onClick={() => { setCarouselReset((value) => value + 1); goToPanel(index); }}
                onKeyDown={(event) => {
                  let next: number | null = null;
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % overviewPanels.length;
                  if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + overviewPanels.length) % overviewPanels.length;
                  if (event.key === "Home") next = 0;
                  if (event.key === "End") next = overviewPanels.length - 1;
                  if (next !== null) {
                    event.preventDefault();
                    setCarouselReset((value) => value + 1);
                    goToPanel(next, true);
                  }
                }}
                className="inline-flex min-h-11 items-center gap-2 border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-pressed:border-blue-600 aria-pressed:bg-blue-600 aria-pressed:text-white"
              >
                <span className="font-mono text-[0.65rem] opacity-70">{panel.number}</span>
                {panel.label}
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-500">{activePanel + 1} / {overviewPanels.length}</p>
        </div>

        <div ref={trackRef} className="platform-overview-track mt-8 -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {overviewPanels.map((panel, index) => (
            <article
              key={panel.key}
              ref={(element) => { panelRefs.current[index] = element; }}
              data-panel-index={index}
              className="grid w-full shrink-0 snap-start gap-x-8 border border-slate-300 bg-white p-5 shadow-[0_22px_70px_-50px_rgba(15,23,42,0.5)] sm:p-7 lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:p-8"
            >
              <header className="lg:col-start-1 lg:row-start-1">
                <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-blue-600">{panel.number} - {panel.label}</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">{panel.title}</h3>
              </header>

              <div className="mt-6 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
                {panel.key === "monitoring" ? <ProductDemonstrationPreview /> : null}
                {panel.key === "workflow" ? <WorkflowDashboardDemo /> : null}
                {panel.key === "reporting" ? <ReportingDashboardDemo /> : null}
              </div>

              <div className="mt-5 lg:col-start-1 lg:row-start-2 lg:mt-6">
                <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{panel.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <button type="button" onClick={() => { setCarouselReset((value) => value + 1); goToPanel(activePanel - 1); }} disabled={activePanel === 0} className="inline-flex min-h-11 items-center gap-2 border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"><ArrowIcon direction="left" /> Previous</button>
          <div className="flex gap-2" aria-label="Platform overview progress">
            {overviewPanels.map((panel, index) => (
              <button key={panel.key} type="button" onClick={() => { setCarouselReset((value) => value + 1); goToPanel(index); }} aria-label={`Show ${panel.label}`} aria-current={activePanel === index ? "step" : undefined} className="grid size-10 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                <span className={`h-1.5 rounded-full transition-all ${activePanel === index ? "w-8 bg-blue-600" : "w-4 bg-slate-300"}`} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { setCarouselReset((value) => value + 1); goToPanel(activePanel + 1); }} disabled={activePanel === overviewPanels.length - 1} className="inline-flex min-h-11 items-center gap-2 border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40">Next <ArrowIcon direction="right" /></button>
        </div>

        <dl className="mt-12 grid border-y border-slate-300 sm:grid-cols-2 xl:grid-cols-4">
          {outcomes.map(([title, body]) => (
            <div key={title} className="border-b border-slate-300 py-5 sm:border-r sm:px-5 xl:border-b-0 last:border-r-0">
              <dt className="font-bold text-slate-950">{title}</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-600">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
