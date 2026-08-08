"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PARTICULATE_UNIT } from "@/lib/metrics";

type ZoneState = "normal" | "review" | "action";
type MetricName = "PM1" | "PM2.5" | "PM10";
type WorkflowTone = "complete" | "current" | "pending" | "inactive";

type Zone = {
  id: string;
  name: string;
  context: string;
  pm1: number;
  pm25: number;
  pm10: number;
};

type WorkflowProgress = {
  label: string;
  status: string;
  tone: WorkflowTone;
};

type ResponseActivity = {
  time: string;
  title: string;
  detail: string;
};

const DEMO_WARNING_PM25 = 15;
const DEMO_ACTION_PM25 = 26;
const DEMO_ACTION_DWELL_MINUTES = 10;

const initialZones: Zone[] = [
  {
    id: "zone-1",
    name: "Level 1 - Construction Site Entry Door",
    context: "Construction-side entry interface",
    pm1: 11,
    pm25: 18,
    pm10: 27,
  },
  {
    id: "zone-2",
    name: "Level 1 - Construction Site Exit Door",
    context: "Construction-side exit interface",
    pm1: 4,
    pm25: 7,
    pm10: 12,
  },
  {
    id: "zone-3",
    name: "Level 1 - Shared Corridor",
    context: "Shared occupied circulation route",
    pm1: 3,
    pm25: 5,
    pm10: 9,
  },
  {
    id: "zone-4",
    name: "Level 1 - General Entry Door",
    context: "General entry interface outside the work zone",
    pm1: 17,
    pm25: 29,
    pm10: 36,
  },
];

const trendPaths = {
  "zone-1": {
    pm1: "M40 190 C95 187 132 179 176 182 C228 185 270 172 318 176 C370 179 414 169 462 173 C514 177 594 168 665 170",
    pm25:
      "M40 178 C92 171 130 164 176 167 C226 170 270 153 318 157 C370 161 410 145 460 149 C510 153 558 145 607 149 C630 151 649 148 665 149",
    pm10:
      "M40 171 C90 164 132 154 178 158 C228 162 270 147 320 151 C371 154 414 137 462 142 C514 147 560 136 608 141 C630 143 650 140 665 141",
  },
  "zone-2": {
    pm1: "M40 204 C96 202 140 196 183 198 C236 201 282 189 330 194 C384 199 430 188 482 192 C535 196 610 190 665 191",
    pm25:
      "M40 198 C96 194 136 186 183 190 C237 194 280 176 330 182 C380 188 425 174 480 180 C534 185 608 176 665 178",
    pm10:
      "M40 191 C94 186 138 178 183 182 C236 186 282 168 331 175 C382 181 429 166 482 173 C535 180 609 169 665 171",
  },
  "zone-3": {
    pm1: "M40 210 C95 208 142 203 188 205 C238 209 284 199 334 203 C388 208 432 198 485 202 C540 206 610 201 665 202",
    pm25:
      "M40 203 C96 200 140 193 186 196 C240 200 286 187 336 192 C388 198 434 186 487 191 C540 196 612 189 665 190",
    pm10:
      "M40 197 C96 193 140 186 186 190 C240 194 286 178 336 185 C388 191 434 176 487 184 C540 190 612 180 665 182",
  },
  "zone-4": {
    pm1: "M40 184 C92 178 136 164 184 169 C235 175 276 137 322 145 C372 153 412 130 460 136 C510 142 558 123 607 129 C628 131 648 127 665 127",
    pm25:
      "M40 170 C89 162 132 145 180 151 C230 158 267 126 318 132 C368 137 405 95 455 101 C506 106 547 78 595 86 C624 90 647 87 665 88",
    pm10:
      "M40 158 C88 149 132 129 180 137 C229 145 266 111 318 118 C368 124 405 82 455 88 C506 94 548 64 595 72 C624 76 647 73 665 74",
  },
};

const workflowSteps = [
  "Detected",
  "Transferred",
  "Evaluated",
  "Notified",
  "Action recorded",
  "Reviewed / closed",
] as const;

function stateFor(pm25: number): ZoneState {
  if (pm25 >= DEMO_ACTION_PM25) return "action";
  if (pm25 >= DEMO_WARNING_PM25) return "review";
  return "normal";
}

function metricStateFor(metric: MetricName, value: number): ZoneState {
  const thresholds: Record<MetricName, { review: number; action: number }> = {
    PM1: { review: 15, action: 26 },
    "PM2.5": { review: DEMO_WARNING_PM25, action: DEMO_ACTION_PM25 },
    PM10: { review: 30, action: 45 },
  };
  const threshold = thresholds[metric];
  if (value >= threshold.action) return "action";
  if (value >= threshold.review) return "review";
  return "normal";
}

const stateLabel: Record<ZoneState, string> = {
  normal: "Normal",
  review: "Review",
  action: "Action",
};

const stateGuidance: Record<
  ZoneState,
  {
    summary: string;
    action: string;
  }
> = {
  normal: {
    summary: "Readings remain within the configured demonstration range.",
    action: "The event has been evaluated. No response workflow is triggered.",
  },
  review: {
    summary: "The latest PM2.5 level has entered the configured warning range.",
    action: "The condition has been reviewed; no response action has been recorded yet.",
  },
  action: {
    summary: `PM2.5 has met the demonstration action condition after remaining above the action limit for at least ${DEMO_ACTION_DWELL_MINUTES} minutes.`,
    action: "The example notification, response-recording and closure workflow is complete.",
  },
};

const stateStyles: Record<
  ZoneState,
  {
    dot: string;
    badge: string;
    band: string;
  }
> = {
  normal: {
    dot: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-800",
    band: "border-emerald-600 bg-emerald-50",
  },
  review: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-800",
    band: "border-amber-500 bg-amber-50",
  },
  action: {
    dot: "bg-red-600",
    badge: "bg-red-50 text-red-800",
    band: "border-red-600 bg-red-50",
  },
};

const workflowStatusStyles: Record<WorkflowTone, string> = {
  complete: "bg-emerald-50 text-emerald-800",
  current: "bg-blue-50 text-blue-800",
  pending: "bg-amber-50 text-amber-900",
  inactive: "bg-slate-100 text-slate-500",
};

function workflowForState(state: ZoneState): WorkflowProgress[] {
  if (state === "normal") {
    return [
      { label: workflowSteps[0], status: "Complete", tone: "complete" },
      { label: workflowSteps[1], status: "Complete", tone: "complete" },
      { label: workflowSteps[2], status: "Complete", tone: "complete" },
      { label: workflowSteps[3], status: "Not triggered", tone: "inactive" },
      { label: workflowSteps[4], status: "Not triggered", tone: "inactive" },
      { label: workflowSteps[5], status: "Not triggered", tone: "inactive" },
    ];
  }

  if (state === "review") {
    return [
      { label: workflowSteps[0], status: "Complete", tone: "complete" },
      { label: workflowSteps[1], status: "Complete", tone: "complete" },
      { label: workflowSteps[2], status: "Complete", tone: "complete" },
      { label: workflowSteps[3], status: "Acknowledged", tone: "complete" },
      { label: workflowSteps[4], status: "No action yet", tone: "pending" },
      { label: workflowSteps[5], status: "Monitoring", tone: "current" },
    ];
  }

  return [
    { label: workflowSteps[0], status: "Complete", tone: "complete" },
    { label: workflowSteps[1], status: "Complete", tone: "complete" },
    { label: workflowSteps[2], status: "Complete", tone: "complete" },
    { label: workflowSteps[3], status: "Complete", tone: "complete" },
    { label: workflowSteps[4], status: "Complete", tone: "complete" },
    { label: workflowSteps[5], status: "Closed", tone: "complete" },
  ];
}

const responseActivity: Record<ZoneState, ResponseActivity[]> = {
  normal: [],
  review: [
    {
      time: "10:42",
      title: "Warning condition reviewed",
      detail: "PM2.5 crossed the configured warning line and the recent trend was reviewed.",
    },
    {
      time: "10:44",
      title: "Site contact acknowledged",
      detail: "Nearby activity and controls were checked. No response action has been recorded yet.",
    },
  ],
  action: [
    {
      time: "10:42",
      title: "Action condition confirmed",
      detail: `PM2.5 remained above the configured action limit for at least ${DEMO_ACTION_DWELL_MINUTES} minutes.`,
    },
    {
      time: "10:44",
      title: "Site contact acknowledged",
      detail: "The nominated contact confirmed receipt and reviewed nearby work activity.",
    },
    {
      time: "10:51",
      title: "Example response recorded",
      detail: "Dry sweeping stopped, temporary barriers were checked and vacuum-assisted cleanup commenced.",
    },
    {
      time: "11:20",
      title: "Workflow reviewed and closed",
      detail: "The response, notes and event history were reviewed and the demonstration workflow was marked complete.",
    },
  ],
};

function activitySummaryFor(state: ZoneState) {
  if (state === "normal") return "Evaluated · no response workflow";
  if (state === "review") return "Reviewed · no action recorded";
  return "Completed example workflow";
}

function SharedDashboard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [activeId, setActiveId] = useState(initialZones[0].id);
  const active = initialZones.find((zone) => zone.id === activeId) ?? initialZones[0];
  const state = stateFor(active.pm25);
  const paths = trendPaths[active.id as keyof typeof trendPaths];
  const workflow = workflowForState(state);
  const activities = responseActivity[state];

  return (
    <div className="overflow-hidden border border-slate-300 bg-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)]">
      <div className="grid gap-4 border-b border-slate-300 bg-slate-50 px-5 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <p className="text-xl font-black tracking-tight text-slate-950">
          Verif<span className="text-blue-600">Air</span>
        </p>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            Shared VerifAir dashboard
          </p>
          <p className="mt-1 font-bold text-slate-950">Demonstration Project</p>
        </div>
        <span className="w-fit border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-blue-800">
          Demonstration data
        </span>
      </div>

      <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="border-b border-slate-300 bg-slate-50 p-3 lg:border-b-0 lg:border-r">
          <p className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Select a zone
          </p>
          <p className="px-2 pb-3 pt-1 text-xs leading-5 text-blue-700 lg:hidden">
            Tap any zone to update the readings, trend, workflow status and response record.
          </p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {initialZones.map((zone, index) => {
              const zoneState = stateFor(zone.pm25);
              return (
                <button
                  key={zone.id}
                  type="button"
                  aria-pressed={activeId === zone.id}
                  onClick={() => setActiveId(zone.id)}
                  className="grid min-h-28 grid-cols-[0.5rem_1fr] content-center items-center gap-x-2 gap-y-1 border border-slate-200 px-3 py-3 text-left text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-white aria-pressed:border-blue-500 aria-pressed:bg-blue-50 aria-pressed:text-blue-800 lg:min-h-24"
                >
                  <span className={`size-2 rounded-full ${stateStyles[zoneState].dot}`} />
                  <span className="font-mono text-[0.65rem] font-black uppercase tracking-[0.12em] text-blue-700">
                    Zone {index + 1}
                  </span>
                  <span className="col-start-2 leading-5">{zone.name}</span>
                  <span className="col-start-2 text-xs font-medium text-slate-500">
                    PM2.5 {zone.pm25} · {stateLabel[zoneState]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <div className="grid border-y border-slate-300 sm:grid-cols-3">
            <div className="py-4 sm:pr-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Selected location
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">{active.name}</p>
            </div>
            <div className="border-t border-slate-300 py-4 sm:border-l sm:border-t-0 sm:px-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Current status
              </p>
              <span className={`mt-2 inline-flex px-2.5 py-1 text-sm font-bold ${stateStyles[state].badge}`}>
                {stateLabel[state]}
              </span>
            </div>
            <div className="border-t border-slate-300 py-4 sm:border-l sm:border-t-0 sm:pl-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Latest update
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">10:58</p>
            </div>
          </div>

          <div className={`mt-4 border-l-4 p-4 ${stateStyles[state].band}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
              {stateLabel[state]} guidance for {active.name}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {stateGuidance[state].summary}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {stateGuidance[state].action}
            </p>
          </div>

          <section
            className="mt-5 border border-slate-300 bg-slate-50"
            aria-labelledby="shared-workflow-title"
          >
            <div className="flex flex-col gap-2 border-b border-slate-300 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                id="shared-workflow-title"
                className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700"
              >
                Current workflow
              </p>
              <p className="text-xs font-semibold text-slate-600">
                {activitySummaryFor(state)}
              </p>
            </div>

            <ol className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
              {workflow.map((step, index) => (
                <li
                  key={step.label}
                  className="border-b border-r border-slate-200 px-3 py-3 last:border-r-0 xl:border-b-0"
                >
                  <span className="font-mono text-[0.65rem] font-bold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 text-xs font-bold text-slate-800">{step.label}</p>
                  <span className={`mt-2 inline-flex px-2 py-1 text-[0.62rem] font-black uppercase tracking-wide ${workflowStatusStyles[step.tone]}`}>
                    {step.status}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <div className={`mt-5 grid gap-5 ${compact ? "" : "xl:grid-cols-[1.35fr_0.65fr]"}`}>
            <div className="border border-slate-300">
              <div className="grid border-b border-slate-300 sm:grid-cols-3">
                <Reading label="PM1" value={active.pm1} state={metricStateFor("PM1", active.pm1)} />
                <Reading label="PM2.5" value={active.pm25} state={metricStateFor("PM2.5", active.pm25)} divided />
                <Reading label="PM10" value={active.pm10} state={metricStateFor("PM10", active.pm10)} divided />
              </div>

              <div className="overflow-x-auto p-4">
                <svg
                  viewBox="0 0 700 270"
                  className="min-w-[38rem] w-full"
                  role="img"
                  aria-label={`PM1, PM2.5 and PM10 trend for ${active.name}, with horizontal demonstration warning and action limits for the PM2.5 workflow`}
                >
                  <defs>
                    <linearGradient id="sharedPm1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4d9ed4" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#4d9ed4" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="sharedPm25" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4aa16e" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#4aa16e" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="sharedPm10" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {[44, 84, 124, 164, 204, 224].map((y) => (
                    <line key={y} x1="40" y1={y} x2="665" y2={y} stroke="#dfe7ec" />
                  ))}

                  <line
                    x1="40"
                    y1="160"
                    x2="665"
                    y2="160"
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeDasharray="7 7"
                  />
                  <text x="494" y="151" fill="#92400e" fontSize="11" fontWeight="700">
                    Configured warning line
                  </text>

                  <line
                    x1="40"
                    y1="112"
                    x2="665"
                    y2="112"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="7 7"
                  />
                  <text x="500" y="103" fill="#991b1b" fontSize="11" fontWeight="700">
                    Configured action limit
                  </text>

                  {state === "action" ? (
                    <g>
                      <rect x="455" y="44" width="105" height="68" fill="#fee2e2" fillOpacity="0.55" />
                      <line x1="455" y1="38" x2="560" y2="38" stroke="#b91c1c" strokeWidth="2" />
                      <line x1="455" y1="34" x2="455" y2="42" stroke="#b91c1c" strokeWidth="2" />
                      <line x1="560" y1="34" x2="560" y2="42" stroke="#b91c1c" strokeWidth="2" />
                      <text x="462" y="29" fill="#991b1b" fontSize="10" fontWeight="700">
                        {DEMO_ACTION_DWELL_MINUTES} min sustained above action limit
                      </text>
                    </g>
                  ) : null}

                  <path
                    d={`M40 224 L${paths.pm1.slice(1)} L665 224 Z`}
                    fill="url(#sharedPm1)"
                  />
                  <path
                    d={`M40 224 L${paths.pm25.slice(1)} L665 224 Z`}
                    fill="url(#sharedPm25)"
                  />
                  <path
                    d={`M40 224 L${paths.pm10.slice(1)} L665 224 Z`}
                    fill="url(#sharedPm10)"
                  />
                  <path d={paths.pm1} fill="none" stroke="#4d9ed4" strokeWidth="4" />
                  <path d={paths.pm25} fill="none" stroke="#4aa16e" strokeWidth="4" />
                  <path d={paths.pm10} fill="none" stroke="#7c3aed" strokeWidth="4" />

                  <text x="40" y="248" fill="#64748b" fontSize="12">10:00</text>
                  <text x="192" y="248" fill="#64748b" fontSize="12">10:15</text>
                  <text x="344" y="248" fill="#64748b" fontSize="12">10:30</text>
                  <text x="495" y="248" fill="#64748b" fontSize="12">10:45</text>
                  <text x="625" y="248" fill="#64748b" fontSize="12">11:00</text>
                </svg>

                <div className="flex flex-wrap gap-5 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-600">
                  <span className="text-sky-700">— PM1</span>
                  <span className="text-emerald-700">— PM2.5</span>
                  <span className="text-violet-700">— PM10</span>
                  <span className="text-amber-700">- - Warning line</span>
                  <span className="text-red-700">- - Action limit</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Example project settings only. The horizontal warning and action lines shown here apply to this demonstration PM2.5 workflow; project settings are defined for the intended use and response plan.
                </p>
                {state === "action" ? (
                  <p className="mt-2 text-xs font-semibold leading-5 text-red-700">
                    Workflow trigger demonstrated: PM2.5 remained above the action limit for at least {DEMO_ACTION_DWELL_MINUTES} minutes before the action workflow was triggered.
                  </p>
                ) : state === "review" ? (
                  <p className="mt-2 text-xs font-semibold leading-5 text-amber-800">
                    Review state: the warning line was crossed, but the sustained action-limit condition has not been met. No response action is recorded yet.
                  </p>
                ) : (
                  <p className="mt-2 text-xs font-semibold leading-5 text-emerald-800">
                    Normal state: the zone has been evaluated and no response workflow is triggered beyond evaluation.
                  </p>
                )}
              </div>
            </div>

            <ResponseActivityPanel state={state} activities={activities} compact={compact} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Reading({
  label,
  value,
  state,
  divided = false,
}: {
  label: MetricName;
  value: number;
  state: ZoneState;
  divided?: boolean;
}) {
  return (
    <div className={`p-5 ${divided ? "border-t border-slate-300 sm:border-l sm:border-t-0" : ""}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
        {value}{" "}
        <span className="text-sm font-medium tracking-normal text-slate-500">
          {PARTICULATE_UNIT}
        </span>
      </p>
      <span className={`mt-3 inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${stateStyles[state].badge}`}>
        {stateLabel[state]}
      </span>
    </div>
  );
}

function ResponseActivityPanel({
  state,
  activities,
  compact,
}: {
  state: ZoneState;
  activities: ResponseActivity[];
  compact: boolean;
}) {
  return (
    <section className="border border-slate-300 bg-white">
      <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
          Example event record
        </p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-slate-950">Latest response activity</h3>
          <span className={`w-fit px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide ${stateStyles[state].badge}`}>
            {activitySummaryFor(state)}
          </span>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="px-5 py-8">
          <p className="font-bold text-slate-950">No response activity</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This zone has been evaluated and remains green. Notification, response-action and closure steps have not been triggered.
          </p>
        </div>
      ) : (
        <ol className={compact ? "divide-y divide-slate-200" : "divide-y divide-slate-200 px-5"}>
          {activities.map((activity) => (
            <Event key={`${activity.time}-${activity.title}`} time={activity.time} title={activity.title} compact={compact}>
              {activity.detail}
            </Event>
          ))}
        </ol>
      )}

      {state === "review" ? (
        <div className="border-t border-slate-200 bg-amber-50 px-5 py-3 text-xs font-semibold leading-5 text-amber-900">
          Reviewed. No response action has been recorded at this stage.
        </div>
      ) : null}
    </section>
  );
}

function Event({
  time,
  title,
  children,
  compact = false,
}: {
  time: string;
  title: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <li className={`grid grid-cols-[3rem_1fr] gap-3 ${compact ? "px-4 py-3" : "py-4"}`}>
      <time className="font-mono text-xs font-bold text-blue-700">{time}</time>
      <div>
        <p className="font-bold text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{children}</p>
      </div>
    </li>
  );
}

function MonitoringRoomDisplay({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [zones, setZones] = useState(initialZones);
  const [lastUpdated, setLastUpdated] = useState("10:58:42");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setZones((current) =>
        current.map((zone) => ({
          ...zone,
          pm1: Math.max(
            1,
            Math.min(34, zone.pm1 + Math.floor(Math.random() * 5) - 2),
          ),
          pm25: Math.max(
            1,
            Math.min(42, zone.pm25 + Math.floor(Math.random() * 7) - 3),
          ),
          pm10: Math.max(
            1,
            Math.min(60, zone.pm10 + Math.floor(Math.random() * 9) - 4),
          ),
        })),
      );

      setLastUpdated(
        new Intl.DateTimeFormat("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden border border-slate-300 bg-slate-100 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)]">
      <div className="grid gap-3 border-b border-slate-300 bg-white px-5 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <p className="text-xl font-black tracking-tight text-slate-950">
          Verif<span className="text-blue-600">Air</span>
        </p>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            Monitoring room display
          </p>
          <p className="mt-1 font-bold text-slate-950">Demonstration Project</p>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-mono text-lg font-bold text-slate-950">
            {lastUpdated}
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Demonstration data
          </p>
        </div>
      </div>

      <div
        className={`grid grid-cols-2 gap-4 p-4 sm:p-5 ${
          compact ? "xl:grid-cols-4" : "xl:grid-cols-4"
        }`}
      >
        {zones.map((zone, index) => {
          const overallState = stateFor(zone.pm25);

          return (
            <article
              key={zone.id}
              className="overflow-hidden border border-slate-300 bg-white"
            >
              <header className="border-b border-slate-300 bg-white px-4 py-4 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                      Zone {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-xl font-black leading-tight tracking-tight text-slate-950 sm:text-2xl">
                      {zone.name}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide ${stateStyles[overallState].badge}`}
                  >
                    {stateLabel[overallState]}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-5 text-slate-600">
                  {zone.context}
                </p>
              </header>

              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4">
                <RoomMetricTile label="PM1" value={zone.pm1} />
                <RoomMetricTile label="PM2.5" value={zone.pm25} />
              </div>

              <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-xs font-semibold text-slate-500">
                  Overall status
                </span>

                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-700">
                  <span
                    className={`size-2.5 rounded-full ${stateStyles[overallState].dot}`}
                  />
                  {stateLabel[overallState]}
                </span>
              </footer>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 border-t border-slate-300 bg-white px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-full bg-emerald-600" />
            Normal
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-full bg-amber-400" />
            Review
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-600" />
            Action
          </span>
        </div>

        <p className="text-xs font-semibold text-slate-500">
          Levels and states update automatically for demonstration.
        </p>
      </div>
    </div>
  );
}


function RoomMetricTile({
  label,
  value,
}: {
  label: "PM1" | "PM2.5";
  value: number;
}) {
  const state = stateFor(value);

  const tileStyles: Record<
    ZoneState,
    {
      surface: string;
      label: string;
      value: string;
      detail: string;
    }
  > = {
    normal: {
      surface: "border-emerald-300 bg-emerald-600",
      label: "text-emerald-50",
      value: "text-white",
      detail: "text-emerald-50/90",
    },
    review: {
      surface: "border-amber-300 bg-amber-400",
      label: "text-amber-950/80",
      value: "text-slate-950",
      detail: "text-amber-950/75",
    },
    action: {
      surface: "border-red-300 bg-red-600",
      label: "text-red-50",
      value: "text-white",
      detail: "text-red-50/90",
    },
  };

  const details: Record<ZoneState, string> = {
    normal: "Within current range",
    review: "Monitor closely",
    action: "Requires review",
  };

  const styles = tileStyles[state];

  return (
    <div
      className={`flex min-h-44 flex-col justify-between border p-4 sm:min-h-48 ${styles.surface}`}
    >
      <div>
        <p
          className={`text-sm font-black uppercase tracking-[0.12em] ${styles.label}`}
        >
          {label}
        </p>

        <p className={`mt-6 text-4xl font-black tracking-tight sm:text-5xl ${styles.value}`}>
          {value}{" "}
          <span className="text-xs font-bold tracking-normal opacity-85">
            {PARTICULATE_UNIT}
          </span>
        </p>
      </div>

      <div>
        <p className={`text-xs font-semibold ${styles.detail}`}>
          {details[state]}
        </p>
        <p className={`mt-2 text-[0.65rem] font-black uppercase tracking-[0.12em] ${styles.detail}`}>
          {stateLabel[state]}
        </p>
      </div>
    </div>
  );
}



const heroLiveFrames: Record<
  Zone["id"],
  Array<Pick<Zone, "pm1" | "pm25" | "pm10">>
> = {
  "zone-1": [
    { pm1: 11, pm25: 18, pm10: 27 },
    { pm1: 13, pm25: 23, pm10: 34 },
    { pm1: 16, pm25: 28, pm10: 42 },
    { pm1: 14, pm25: 21, pm10: 33 },
    { pm1: 10, pm25: 13, pm10: 23 },
  ],
  "zone-2": [
    { pm1: 4, pm25: 7, pm10: 12 },
    { pm1: 6, pm25: 10, pm10: 16 },
    { pm1: 9, pm25: 14, pm10: 22 },
    { pm1: 12, pm25: 17, pm10: 27 },
    { pm1: 7, pm25: 11, pm10: 18 },
  ],
  "zone-3": [
    { pm1: 3, pm25: 5, pm10: 9 },
    { pm1: 4, pm25: 6, pm10: 11 },
    { pm1: 5, pm25: 8, pm10: 13 },
    { pm1: 4, pm25: 7, pm10: 12 },
    { pm1: 3, pm25: 5, pm10: 9 },
  ],
  "zone-4": [
    { pm1: 17, pm25: 29, pm10: 36 },
    { pm1: 19, pm25: 32, pm10: 45 },
    { pm1: 14, pm25: 24, pm10: 34 },
    { pm1: 11, pm25: 14, pm10: 24 },
    { pm1: 16, pm25: 27, pm10: 39 },
  ],
};

function HeroMetricTile({
  label,
  value,
}: {
  label: "PM1" | "PM2.5";
  value: number;
}) {
  const state = stateFor(value);

  const styles: Record<
    ZoneState,
    { surface: string; label: string; value: string; detail: string }
  > = {
    normal: {
      surface: "border-emerald-300 bg-emerald-600",
      label: "text-emerald-50",
      value: "text-white",
      detail: "text-emerald-50/90",
    },
    review: {
      surface: "border-amber-300 bg-amber-400",
      label: "text-amber-950/80",
      value: "text-slate-950",
      detail: "text-amber-950/80",
    },
    action: {
      surface: "border-red-300 bg-red-600",
      label: "text-red-50",
      value: "text-white",
      detail: "text-red-50/90",
    },
  };

  const style = styles[state];

  return (
    <div
      className={`flex min-h-24 flex-col justify-between border p-2.5 ${style.surface}`}
    >
      <p
        className={`text-[0.58rem] font-black uppercase tracking-[0.12em] ${style.label}`}
      >
        {label}
      </p>
      <p className={`mt-2 text-2xl font-black tracking-tight sm:text-3xl ${style.value}`}>
        {value}{" "}
        <span className="text-[0.48rem] font-bold tracking-normal opacity-85">
          {PARTICULATE_UNIT}
        </span>
      </p>
      <p
        className={`mt-2 text-[0.53rem] font-black uppercase tracking-[0.1em] ${style.detail}`}
      >
        {stateLabel[state]}
      </p>
    </div>
  );
}

function HeroZoneCard({ zone, index }: { zone: Zone; index: number }) {
  const overallState = stateFor(zone.pm25);

  return (
    <article className="overflow-hidden border border-slate-300 bg-white">
      <header className="border-b border-slate-200 bg-white px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-[0.56rem] font-black uppercase tracking-[0.14em] text-blue-700">
              Zone {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 min-h-9 text-xs font-black leading-tight text-slate-950 sm:text-sm">
              {zone.name}
            </h3>
          </div>
          <span
            className={`shrink-0 px-2 py-1 text-[0.52rem] font-black uppercase tracking-wide ${stateStyles[overallState].badge}`}
          >
            {stateLabel[overallState]}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 p-2.5">
        <HeroMetricTile label="PM1" value={zone.pm1} />
        <HeroMetricTile label="PM2.5" value={zone.pm25} />
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2">
        <span className="text-[0.58rem] font-semibold text-slate-500">
          Overall status
        </span>
        <span className="inline-flex items-center gap-1.5 text-[0.56rem] font-black uppercase tracking-wide text-slate-700">
          <span
            className={`size-2 rounded-full ${stateStyles[overallState].dot}`}
          />
          {stateLabel[overallState]}
        </span>
      </footer>
    </article>
  );
}

export function MonitoringRoomHeroPreview() {
  const [frame, setFrame] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("10:58:42");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setFrame((current) => current + 1);
      setLastUpdated(
        new Intl.DateTimeFormat("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    }, 3500);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const zones = useMemo(
    () =>
      initialZones.map((zone) => {
        const frames = heroLiveFrames[zone.id];
        const values = frames[frame % frames.length];
        return { ...zone, ...values };
      }),
    [frame],
  );

  return (
    <div className="overflow-hidden border border-white/20 bg-slate-100 shadow-[0_30px_90px_-45px_rgba(59,130,246,0.7)]">
      <div className="grid gap-2 border-b border-slate-300 bg-white px-3 py-2.5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <p className="text-base font-black tracking-tight text-slate-950">
          Verif<span className="text-blue-600">Air</span>
        </p>
        <div>
          <p className="text-[0.56rem] font-bold uppercase tracking-[0.14em] text-blue-700">
            Monitoring room display
          </p>
          <p className="mt-0.5 text-[0.68rem] font-bold text-slate-950">
            Demonstration Project
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-xs font-bold text-slate-950">
            {lastUpdated}
          </p>
          <p className="text-[0.52rem] font-semibold uppercase tracking-wide text-slate-500">
            Demonstration data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 p-2.5 sm:grid-cols-2 lg:hidden">
        {zones.slice(0, 2).map((zone, index) => (
          <HeroZoneCard key={zone.id} zone={zone} index={index} />
        ))}
      </div>

      <div className="hidden grid-cols-2 gap-2 p-2.5 lg:grid">
        {zones.map((zone, index) => (
          <HeroZoneCard key={zone.id} zone={zone} index={index} />
        ))}
      </div>

      <div className="grid gap-2 border-t border-slate-300 bg-white px-3 py-2.5 text-[0.56rem] font-semibold text-slate-600 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-600" /> Normal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400" /> Review
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-red-600" /> Action
          </span>
        </div>
        <span className="sm:text-right">
          {reducedMotion ? "Animation paused" : "Live demo updates"} · Example project settings
        </span>
      </div>
    </div>
  );
}

export function DashboardDemonstrationSection() {
  const [active, setActive] = useState<"shared" | "room">("shared");

  const tabs = useMemo(
    () => [
      {
        id: "shared" as const,
        label: "Shared dashboard",
        description: "Trends, current readings and example response records.",
      },
      {
        id: "room" as const,
        label: "Monitoring room display",
        description: "Large-format, colour-coded status across four configured zones.",
      },
    ],
    [],
  );

  return (
    <section
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="dashboard-demonstration-title"
    >
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Product demonstration
            </p>
            <h2
              id="dashboard-demonstration-title"
              className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl"
            >
              Two interfaces for two operational contexts.
            </h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            The shared dashboard supports authorised review of readings, trends
            and example event records. The monitoring room display keeps live
            zone status visible without exposing the full response workflow.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Dashboard demonstration"
          className="mt-10 grid border-y border-slate-300 sm:grid-cols-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              className="border-b border-slate-300 px-5 py-5 text-left sm:border-b-0 sm:border-r sm:last:border-r-0 aria-selected:bg-slate-950 aria-selected:text-white"
            >
              <span className="block font-bold">{tab.label}</span>
              <span className="mt-1 block text-sm leading-6 opacity-70">{tab.description}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          {active === "shared" ? (
            <SharedDashboard compact />
          ) : (
            <MonitoringRoomDisplay compact />
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-5">
          <Link href="/demonstration/shared-dashboard" className="font-bold text-blue-600 hover:underline">
            Open the shared dashboard demonstration →
          </Link>
          <Link href="/demonstration/monitoring-room" className="font-bold text-blue-600 hover:underline">
            Open the monitoring room display →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SharedDashboardPage() {
  return <SharedDashboard />;
}

export function MonitoringRoomDisplayPage() {
  return <MonitoringRoomDisplay />;
}

export function SharedDashboardPreview() {
  return <SharedDashboard compact />;
}

export function MonitoringRoomPreview() {
  return <MonitoringRoomDisplay compact />;
}
