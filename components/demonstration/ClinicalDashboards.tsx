"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PARTICULATE_UNIT } from "@/lib/metrics";

type ZoneState = "normal" | "review" | "action";

type Zone = {
  id: string;
  name: string;
  context: string;
  pm1: number;
  pm25: number;
};

const initialZones: Zone[] = [
  {
    id: "work-zone-a",
    name: "Work Zone A",
    context: "Selected dust-producing work area",
    pm1: 11,
    pm25: 18,
  },
  {
    id: "occupied-interface",
    name: "Occupied Interface",
    context: "Boundary adjoining an occupied area",
    pm1: 4,
    pm25: 7,
  },
  {
    id: "external-boundary",
    name: "External Boundary",
    context: "Configured external monitoring point",
    pm1: 3,
    pm25: 5,
  },
  {
    id: "shared-access-route",
    name: "Shared Access Route",
    context: "Worker and facility circulation path",
    pm1: 17,
    pm25: 29,
  },
];

const trendPaths = {
  "work-zone-a": {
    pm1: "M40 188 C95 184 128 171 175 176 C230 182 260 150 310 159 C360 168 405 142 450 149 C500 156 548 134 596 140 C624 143 646 136 665 138",
    pm25:
      "M40 176 C90 168 128 155 175 161 C228 168 262 122 310 132 C358 141 395 72 445 87 C496 101 542 108 590 103 C622 100 646 108 665 105",
  },
  "occupied-interface": {
    pm1: "M40 203 C96 201 140 193 183 196 C236 200 282 186 330 192 C384 198 430 184 482 190 C535 194 610 186 665 188",
    pm25:
      "M40 196 C96 191 136 182 183 187 C237 191 280 170 330 178 C380 186 425 166 480 174 C534 182 608 169 665 171",
  },
  "external-boundary": {
    pm1: "M40 209 C95 207 142 201 188 204 C238 208 284 196 334 202 C388 207 432 195 485 201 C540 205 610 198 665 200",
    pm25:
      "M40 201 C96 197 140 190 186 194 C240 199 286 182 336 190 C388 197 434 181 487 189 C540 195 612 184 665 186",
  },
  "shared-access-route": {
    pm1: "M40 181 C92 174 136 159 184 165 C235 171 276 125 322 136 C372 147 412 120 460 127 C510 135 558 113 607 121 C628 124 648 120 665 119",
    pm25:
      "M40 164 C89 155 132 135 180 143 C230 151 267 82 318 96 C368 110 405 47 455 62 C506 77 547 33 595 47 C624 53 647 50 665 49",
  },
};

function stateFor(pm25: number): ZoneState {
  if (pm25 >= 26) return "action";
  if (pm25 >= 15) return "review";
  return "normal";
}

const stateLabel: Record<ZoneState, string> = {
  normal: "Normal",
  review: "Review",
  action: "Action",
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

function SharedDashboard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [activeId, setActiveId] = useState(initialZones[0].id);
  const active = initialZones.find((zone) => zone.id === activeId) ?? initialZones[0];
  const state = stateFor(active.pm25);
  const paths = trendPaths[active.id as keyof typeof trendPaths];

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

      <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="border-b border-slate-300 bg-slate-50 p-3 lg:border-b-0 lg:border-r">
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Monitoring locations
          </p>
          <div className="flex gap-2 overflow-x-auto lg:grid">
            {initialZones.map((zone) => {
              const zoneState = stateFor(zone.pm25);
              return (
                <button
                  key={zone.id}
                  type="button"
                  aria-pressed={activeId === zone.id}
                  onClick={() => setActiveId(zone.id)}
                  className="grid min-w-48 grid-cols-[0.5rem_1fr_auto] items-center gap-2 px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-white aria-pressed:bg-white aria-pressed:text-blue-700"
                >
                  <span className={`size-2 rounded-full ${stateStyles[zoneState].dot}`} />
                  <span>{zone.name}</span>
                  <span className="text-xs font-medium text-slate-500">
                    {zone.pm25}
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

          <div className={`mt-5 grid gap-5 ${compact ? "" : "xl:grid-cols-[1.35fr_0.65fr]"}`}>
            <div className="border border-slate-300">
              <div className="grid border-b border-slate-300 sm:grid-cols-2">
                <Reading label="PM1" value={active.pm1} state={stateFor(active.pm1)} />
                <Reading label="PM2.5" value={active.pm25} state={state} divided />
              </div>

              <div className="overflow-x-auto p-4">
                <svg
                  viewBox="0 0 700 250"
                  className="min-w-[38rem] w-full"
                  role="img"
                  aria-label={`PM1 and PM2.5 trend for ${active.name}`}
                >
                  <defs>
                    <linearGradient id="sharedPm1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4d9ed4" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#4d9ed4" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="sharedPm25" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4aa16e" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#4aa16e" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {[34, 84, 134, 184, 224].map((y) => (
                    <line key={y} x1="40" y1={y} x2="665" y2={y} stroke="#dfe7ec" />
                  ))}

                  <line
                    x1="40"
                    y1="109"
                    x2="665"
                    y2="109"
                    stroke="#c68718"
                    strokeWidth="2"
                    strokeDasharray="7 7"
                  />
                  <text x="500" y="98" fill="#8c5c0d" fontSize="12">
                    Configured review line
                  </text>

                  <path
                    d={`M40 224 L${paths.pm1.slice(1)} L665 224 Z`}
                    fill="url(#sharedPm1)"
                  />
                  <path
                    d={`M40 224 L${paths.pm25.slice(1)} L665 224 Z`}
                    fill="url(#sharedPm25)"
                  />
                  <path d={paths.pm1} fill="none" stroke="#4d9ed4" strokeWidth="4" />
                  <path d={paths.pm25} fill="none" stroke="#4aa16e" strokeWidth="4" />

                  <text x="40" y="244" fill="#64748b" fontSize="12">10:00</text>
                  <text x="192" y="244" fill="#64748b" fontSize="12">10:15</text>
                  <text x="344" y="244" fill="#64748b" fontSize="12">10:30</text>
                  <text x="495" y="244" fill="#64748b" fontSize="12">10:45</text>
                  <text x="625" y="244" fill="#64748b" fontSize="12">11:00</text>
                </svg>

                <div className="flex flex-wrap gap-5 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-600">
                  <span>— PM1</span>
                  <span className="text-emerald-700">— PM2.5</span>
                  <span className="text-amber-700">- - Configured review line</span>
                </div>
              </div>
            </div>

            {!compact ? (
              <div className="border border-slate-300">
                <div className="border-b border-slate-300 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    Example event record
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-950">
                    Latest response activity
                  </h3>
                </div>
                <ol className="divide-y divide-slate-200 px-5">
                  <Event time="10:42" title="Review condition detected">
                    PM2.5 crossed the configured review line for three consecutive samples.
                  </Event>
                  <Event time="10:44" title="Site contact acknowledged">
                    The nominated contact confirmed receipt and checked nearby work activity.
                  </Event>
                  <Event time="10:51" title="Example response recorded">
                    “Stopped dry sweeping, checked temporary barriers and changed to vacuum-assisted cleanup.”
                  </Event>
                  <Event time="11:20" title="Event reviewed and closed">
                    PM2.5 returned below the configured review line and the action was marked complete.
                  </Event>
                </ol>
              </div>
            ) : null}
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
  label: string;
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

function Event({
  time,
  title,
  children,
}: {
  time: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[3rem_1fr] gap-3 py-4">
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
        className={`grid gap-4 p-4 sm:p-5 ${
          compact ? "lg:grid-cols-2" : "xl:grid-cols-2"
        }`}
      >
        {zones.map((zone, index) => {
          const state = stateFor(zone.pm25);
          const stateSurface = {
            normal: "bg-emerald-600 text-white",
            review: "bg-amber-400 text-slate-950",
            action: "bg-red-600 text-white",
          }[state];

          const stateMuted = {
            normal: "text-emerald-50",
            review: "text-amber-950/75",
            action: "text-red-50",
          }[state];

          return (
            <article
              key={zone.id}
              className="grid min-h-[19rem] overflow-hidden border border-slate-300 bg-white grid-rows-[20%_80%]"
            >
              <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-300 bg-white px-5 py-4">
                <span className="font-mono text-sm font-black text-blue-700">
                  Z{String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-black text-slate-950 sm:text-2xl">
                    {zone.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Configured monitoring location
                  </p>
                </div>
                <span className={`size-4 rounded-full ${stateStyles[state].dot}`} />
              </header>

              <div className={`grid p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:p-7 ${stateSurface}`}>
                <div>
                  <p className={`text-sm font-semibold ${stateMuted}`}>
                    {zone.context}
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-6">
                    <RoomReading
                      label="PM1"
                      value={zone.pm1}
                      inverse={state !== "review"}
                    />
                    <RoomReading
                      label="PM2.5"
                      value={zone.pm25}
                      inverse={state !== "review"}
                    />
                  </div>

                  <div className={`mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${stateMuted}`}>
                    <span className="size-2 rounded-full bg-current" />
                    Updated just now
                  </div>
                </div>

                <div className="mt-7 border-t border-current/25 pt-6 text-left sm:mt-0 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0 sm:text-center">
                  <p className={`text-xs font-black uppercase tracking-[0.16em] ${stateMuted}`}>
                    Current status
                  </p>
                  <p className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
                    {stateLabel[state]}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-6 border-t border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-700">
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
    </div>
  );
}


function RoomReading({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  inverse?: boolean;
}) {
  return (
    <div>
      <p
        className={`text-xs font-black uppercase tracking-[0.14em] ${
          inverse ? "text-white/75" : "text-slate-900/70"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
        {value}{" "}
        <span
          className={`text-xs font-semibold tracking-normal ${
            inverse ? "text-white/80" : "text-slate-900/70"
          }`}
        >
          {PARTICULATE_UNIT}
        </span>
      </p>
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
