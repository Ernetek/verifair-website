"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon, BuildingOffice2Icon, DevicePhoneMobileIcon, SignalIcon } from "@heroicons/react/24/outline";

import { classifyDemonstrationMetric, DEMONSTRATION_METRIC_THRESHOLDS } from "@/lib/demonstration/metric-status";
import { resolveMonitoringPresentation } from "@/lib/demonstration/monitoring-view";
import { PARTICULATE_UNIT } from "@/lib/metrics";
import { DEMONSTRATION_METRICS, publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";
import { type VerifAirOperationalState, type VerifAirSystemHealth } from "@/lib/product-model";

const measurementDetails = [
  {
    id: "RESPIRABLE_DUST",
    label: "Respirable Dust",
    detail: "A separately captured particulate channel.",
    tone: "border-blue-700 bg-blue-50 text-blue-950"
  },
  { id: "PM1", label: "PM1", detail: "Fine particulate measurement.", tone: "border-slate-300 bg-white text-slate-950" },
  { id: "PM2_5", label: "PM2.5", detail: "Fine particulate measurement.", tone: "border-slate-300 bg-white text-slate-950" },
  { id: "PM10", label: "PM10", detail: "Coarse particulate measurement.", tone: "border-slate-300 bg-white text-slate-950" }
] as const;

const hierarchy = [
  ["MONITORING LOCATION", "A named point with its own device and observation history", DevicePhoneMobileIcon],
  ["ZONE", "A work area, floor, boundary or occupied interface", SignalIcon],
  ["SITE", "A project, facility or construction location", BuildingOffice2Icon],
  ["PORTFOLIO", "A connected view across multiple projects and operating environments", BuildingOffice2Icon]
] as const;

const statusLegends = [
  {
    title: "PARTICULATE / OPERATIONAL STATE",
    rows: [
      ["ACTION", "Configured action level reached", "text-red-700", "●"],
      ["ATTENTION", "Configured attention level reached", "text-amber-600", "●"],
      ["NORMAL", "Below configured attention level", "text-emerald-600", "●"]
    ]
  },
  {
    title: "SYSTEM / DATA HEALTH",
    rows: [
      ["HEALTHY", "Observations current and monitoring systems reporting", "text-emerald-600", "●"],
      ["DEGRADED", "Monitoring available with a system or connectivity issue", "text-amber-600", "●"],
      ["STALE", "Current observation not received within freshness window", "text-blue-700", "●"],
      ["OFFLINE", "Monitor, Edge or communications unavailable", "text-slate-900", "●"]
    ]
  }
] as const;

const MONITORING_VIEW_OFFSET_MS = 240_000;

const operationalStateStyles: Record<VerifAirOperationalState, { border: string; background: string; icon: string }> = {
  NORMAL: { border: "border-t-8 border-emerald-600", background: "bg-emerald-50", icon: "✓" },
  ATTENTION: { border: "border-t-8 border-amber-500", background: "bg-amber-50", icon: "!" },
  ACTION: { border: "border-t-8 border-red-600", background: "bg-red-50", icon: "!" }
};

type MonitoringRecord = {
  readonly id: string;
  readonly name: string;
  readonly site: string;
  readonly zone: string;
  readonly location: string;
  readonly values: Record<(typeof DEMONSTRATION_METRICS)[number]["id"], number>;
  readonly operationalState: VerifAirOperationalState;
  readonly systemHealth: VerifAirSystemHealth;
  readonly lastObservation: string;
};

const monitoringRecords: readonly MonitoringRecord[] = publicDemonstrationScenario.monitors.map((monitor, index) => {
  const values = Object.fromEntries(
    DEMONSTRATION_METRICS.map((metric) => {
      const observations = publicDemonstrationScenario.observations.filter(
        (observation) =>
          observation.monitorId === monitor.id && observation.metricId === metric.id && observation.offsetMs <= MONITORING_VIEW_OFFSET_MS
      );
      const latest = observations[observations.length - 1];
      return [metric.id, latest?.reading.status === "available" ? latest.reading.value : 0];
    })
  ) as MonitoringRecord["values"];
  return {
    id: monitor.id,
    name: monitor.name,
    site: "Demonstration Project",
    zone: index === 0 ? "Work area" : index === 1 ? "Occupied interface" : index === 2 ? "Shared corridor" : "External boundary",
    location: monitor.name,
    values,
    operationalState: classifyDemonstrationMetric("PM2_5", values.PM2_5).label,
    systemHealth: "HEALTHY",
    lastObservation: "13 Aug 2026, 12:04 AEST"
  };
});

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {children ? <p className="mt-4 text-base leading-7 text-slate-600">{children}</p> : null}
    </div>
  );
}

function MonitorDetail({ monitor }: { readonly monitor: MonitoringRecord }) {
  const [selectedMetricId, setSelectedMetricId] = useState<(typeof DEMONSTRATION_METRICS)[number]["id"]>("RESPIRABLE_DUST");
  const selectedMetric = DEMONSTRATION_METRICS.find((metric) => metric.id === selectedMetricId) ?? DEMONSTRATION_METRICS[0];
  const history = publicDemonstrationScenario.observations.filter(
    (observation) =>
      observation.monitorId === monitor.id && observation.metricId === selectedMetric.id && observation.reading.status === "available"
  );
  const value = monitor.values[selectedMetric.id];
  const threshold = DEMONSTRATION_METRIC_THRESHOLDS[selectedMetric.id];
  const presentation = resolveMonitoringPresentation(monitor.operationalState, monitor.systemHealth);
  const status = operationalStateStyles[monitor.operationalState];

  return (
    <div className="border border-slate-300 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)]">
      <div className={`border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-7 ${status.border}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">Illustrative monitoring location</p>
            <h3 className="mt-2 text-2xl font-black">{monitor.location}</h3>
            <p className="mt-1 text-sm text-slate-300">
              Zone: {monitor.zone} · Site: {monitor.site}
            </p>
          </div>
          <span className={`flex items-center gap-2 border px-3 py-2 text-xs font-black uppercase ${status.background} text-slate-950`}>
            <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full border-2 border-current text-base">
              {status.icon}
            </span>
            {presentation.primaryState}
          </span>
        </div>
      </div>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Latest reading</p>
          <p className="mt-2 text-5xl font-black text-slate-950">
            {value}
            <span className="ml-2 text-sm font-bold text-slate-500">{PARTICULATE_UNIT}</span>
          </p>
          <dl className="mt-5 grid gap-3 border-y border-slate-200 py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Last Sensor Reading</dt>
              <dd className="font-bold text-slate-900">{monitor.lastObservation}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Configured trigger</dt>
              <dd className="font-bold text-slate-900">Project operational trigger</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Operational state</dt>
              <dd className="font-bold text-amber-800">{monitor.operationalState}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Monitor / Edge health</dt>
              <dd className="font-bold text-emerald-800">{monitor.systemHealth}</dd>
            </div>
          </dl>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Live Daily Trend</p>
              <p className="mt-1 text-sm font-bold text-slate-900">Today&apos;s readings for the selected monitoring location</p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Live Daily Trend timeframe">
              {(["TODAY", "7 DAYS", "30 DAYS"] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  type="button"
                  aria-pressed={timeframe === "TODAY"}
                  disabled={timeframe !== "TODAY"}
                  title={timeframe === "TODAY" ? undefined : "Available once historical data spans multiple days"}
                  className="min-h-9 border border-slate-300 px-3 text-xs font-black text-slate-700 aria-pressed:border-blue-700 aria-pressed:bg-blue-700 aria-pressed:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-900">Select one measurement channel</p>
            <div className="flex flex-wrap gap-2" aria-label="Live Daily Trend measurement">
              {measurementDetails.map((metric) => (
                <button
                  key={metric.id}
                  type="button"
                  aria-pressed={selectedMetricId === metric.id}
                  onClick={() => setSelectedMetricId(metric.id as (typeof DEMONSTRATION_METRICS)[number]["id"])}
                  className="min-h-10 border border-slate-300 px-3 text-xs font-black text-slate-700 aria-pressed:border-blue-700 aria-pressed:bg-blue-700 aria-pressed:text-white"
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          {(() => {
            const points = history.length > 1 ? history : [history[0]].filter(Boolean);
            const readings = points.map((observation) => (observation.reading.status === "available" ? observation.reading.value : 0));
            const maxValue = Math.max(value, ...readings, threshold.action, 1);
            const minValue = 0;
            const chartLeft = 46;
            const chartRight = 615;
            const chartTop = 20;
            const chartBottom = 185;
            const scaleY = (reading: number) =>
              chartBottom - ((reading - minValue) / (maxValue - minValue || 1)) * (chartBottom - chartTop);
            const scaleX = (index: number, count: number) =>
              count <= 1 ? chartLeft : chartLeft + (index / (count - 1)) * (chartRight - chartLeft);
            const linePath = readings.length > 1
              ? readings.map((reading, index) => `${index === 0 ? "M" : "L"}${scaleX(index, readings.length).toFixed(1)} ${scaleY(reading).toFixed(1)}`).join(" ")
              : `M${chartLeft} ${scaleY(value).toFixed(1)} L${chartRight} ${scaleY(value).toFixed(1)}`;
            const latestX = readings.length > 1 ? scaleX(readings.length - 1, readings.length) : chartRight;
            const latestY = readings.length > 1 ? scaleY(readings[readings.length - 1]) : scaleY(value);
            const attentionY = scaleY(threshold.attention);
            return (
              <svg
                className="mt-5 h-56 w-full border border-slate-200 bg-slate-50"
                viewBox="0 0 640 220"
                role="img"
                aria-label={`${selectedMetric.label} Live Daily Trend for today, latest reading ${value} ${PARTICULATE_UNIT}`}
              >
                {[40, 85, 130, 175].map((y) => (
                  <line key={y} x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                ))}
                <text x="6" y={chartTop + 4} fill="#94a3b8" fontSize="10">{maxValue.toFixed(0)}</text>
                <text x="6" y={chartBottom} fill="#94a3b8" fontSize="10">{minValue}</text>
                <line x1={chartLeft} y1={attentionY} x2={chartRight} y2={attentionY} stroke="#d97706" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x={chartRight - 108} y={attentionY - 6} fill="#b45309" fontSize="10" fontWeight="bold">Configured attention level</text>
                <path d={linePath} fill="none" stroke="#0369a1" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={latestX} cy={latestY} r="6" fill="#0369a1" stroke="#ffffff" strokeWidth="2" />
                <text x={chartLeft} y="207" fill="#64748b" fontSize="11">Start of day</text>
                <text x={chartRight - 42} y="207" fill="#64748b" fontSize="11">Now</text>
              </svg>
            );
          })()}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <span>
              {selectedMetric.label} · latest reading {value} {PARTICULATE_UNIT} · {monitor.lastObservation}
            </span>
            <Link href="/reporting" className="font-black text-blue-700 hover:underline">
              View Historical Trends →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MonitoringControlCentre() {
  const [selectedMonitorId, setSelectedMonitorId] = useState(monitoringRecords[0].id);
  const [wallboard, setWallboard] = useState(false);
  const selectedMonitor = monitoringRecords.find((monitor) => monitor.id === selectedMonitorId) ?? monitoringRecords[0];
  return (
    <div className="border border-slate-300 bg-slate-100 p-3 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)] sm:p-5">
      <div
        className={`${wallboard ? "bg-slate-950" : "bg-[#0f6cab]"} flex flex-wrap items-start justify-between gap-4 px-4 py-4 text-white sm:px-6`}
      >
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-200">
            {wallboard ? "Wallboard · VerifAir Platform browser view" : "Control Centre — at a glance"}
          </p>
          <h3 className="mt-1 text-2xl font-black">Demonstration Project</h3>
          <p className="text-sm text-slate-200">Live status across all zones</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="monitoring-site-filter">
            Site filter
          </label>
          <select
            id="monitoring-site-filter"
            className="min-h-10 border border-white/40 bg-white/10 px-3 text-xs font-bold text-white"
            defaultValue="all-sites"
          >
            <option className="text-slate-950" value="all-sites">
              All Sites
            </option>
          </select>
          <label className="sr-only" htmlFor="monitoring-zone-filter">
            Zone filter
          </label>
          <select
            id="monitoring-zone-filter"
            className="min-h-10 border border-white/40 bg-white/10 px-3 text-xs font-bold text-white"
            defaultValue="all-zones"
          >
            <option className="text-slate-950" value="all-zones">
              All Zones
            </option>
          </select>
          <span className="inline-flex min-h-10 items-center gap-2 border border-emerald-300/60 px-3 text-xs font-black">
            <span aria-hidden="true" className="size-2 rounded-full bg-emerald-300" />
            Live
          </span>
          <button
            type="button"
            aria-pressed={wallboard}
            onClick={() => setWallboard((current) => !current)}
            className="min-h-11 border border-white/60 px-4 text-xs font-black uppercase tracking-[0.08em] hover:bg-white/10"
          >
            {wallboard ? "Control Centre" : "Wallboard / Display Mode"}
          </button>
        </div>
      </div>
      <div className={`${wallboard ? "bg-slate-950" : "bg-slate-100"} p-3 sm:p-5`}>
        <div className={`grid grid-cols-2 items-stretch gap-2 sm:gap-3 ${wallboard ? "" : "xl:grid-cols-4"}`}>
          {monitoringRecords.map((monitor) => {
            const status = operationalStateStyles[monitor.operationalState];
            const dark = wallboard;
            return (
              <button
                key={monitor.id}
                type="button"
                onClick={() => setSelectedMonitorId(monitor.id)}
                className={`flex h-full min-w-0 flex-col border p-2.5 text-left shadow-sm sm:p-4 ${dark ? (monitor.operationalState === "ACTION" ? "border-red-800 bg-red-950/80 text-white" : monitor.operationalState === "ATTENTION" ? "border-amber-700 bg-amber-950/80 text-white" : "border-emerald-800 bg-emerald-950/80 text-white") : monitor.operationalState === "ACTION" ? "border-red-200 bg-red-50" : monitor.operationalState === "ATTENTION" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"} ${status.border} ${selectedMonitor.id === monitor.id ? "ring-2 ring-blue-500" : ""}`}
              >
                <div
                  className={`-mx-2.5 -mt-2.5 mb-3 flex items-center justify-between gap-2 px-2.5 py-2.5 sm:-mx-4 sm:-mt-4 sm:mb-4 sm:px-4 sm:py-3 ${dark ? (monitor.operationalState === "ACTION" ? "bg-red-950" : monitor.operationalState === "ATTENTION" ? "bg-amber-950" : "bg-emerald-950") : status.background}`}
                >
                  <span
                    className={`text-[0.68rem] font-black uppercase tracking-[0.06em] sm:text-sm sm:tracking-[0.1em] ${dark ? "text-white" : "text-slate-950"}`}
                  >
                    {monitor.operationalState}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex size-6 items-center justify-center rounded-full border-2 border-current text-sm font-black sm:size-8 sm:text-lg ${dark ? "text-white" : "text-slate-950"}`}
                  >
                    {status.icon}
                  </span>
                </div>
                <p className={`text-[10px] font-black uppercase tracking-[0.12em] ${dark ? "text-slate-300" : "text-slate-500"} truncate`}>
                  Site · {monitor.site}
                </p>
                <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.1em] ${dark ? "text-slate-300" : "text-slate-500"} truncate`}>
                  Zone · {monitor.zone}
                </p>
                <h4 className={`mt-1 line-clamp-2 min-h-[2.25rem] text-sm font-black sm:min-h-[2.75rem] sm:text-lg ${dark ? "text-white" : "text-slate-950"}`}>{monitor.location}</h4>
                <div className="mt-2 border border-blue-200 bg-blue-50 p-2.5 sm:mt-3 sm:p-3">
                  <p className="text-[9px] font-black uppercase text-blue-800 sm:text-[10px]">Respirable Dust</p>
                  <p className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                    {monitor.values.RESPIRABLE_DUST} <span className="text-xs">{PARTICULATE_UNIT}</span>
                  </p>
                </div>
                <dl className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                  {["PM1", "PM2_5", "PM10"].map((metricId) => (
                    <div
                      key={metricId}
                      className={`border p-1.5 sm:p-2 ${dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}
                    >
                      <dt className={`text-[8px] font-black sm:text-[9px] ${dark ? "text-slate-300" : "text-slate-500"}`}>
                        {metricId === "PM2_5" ? "PM2.5" : metricId}
                      </dt>
                      <dd className={`mt-1 text-sm font-black sm:text-base ${dark ? "text-white" : "text-slate-950"}`}>
                        {monitor.values[metricId as keyof typeof monitor.values]}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className={`mt-auto pt-2 text-[9px] font-bold sm:mt-3 sm:pt-0 sm:text-xs ${dark ? "text-slate-300" : "text-slate-600"}`}>
                  Last Sensor Reading · {monitor.lastObservation}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-5">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.15em] text-slate-500">Monitor Detail · {selectedMonitor.location}</p>
        <MonitorDetail monitor={selectedMonitor} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-slate-300 bg-white p-3 text-xs font-bold text-slate-700 sm:p-4">
        <strong className="flex items-center gap-2 font-black uppercase tracking-[0.08em]">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-emerald-500" />
          System Health · Healthy
        </strong>
        <span>4/4 monitoring locations reporting</span>
      </div>
    </div>
  );
}

export function MonitoringPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="border-b border-slate-800 bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">VERIFAIR MONITORING</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl">
              Visibility across every
              <br />
              monitoring location.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
              One project with several monitoring locations is a complete VerifAir view. Add more sites when you need portfolio-wide visibility.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#control-centre" className="cta-primary inline-flex min-h-12 items-center justify-center px-6 font-black">
                See Monitoring in Action
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center border border-white/50 px-6 font-black text-white hover:bg-white/10"
              >
                Discuss Your Monitoring Requirements
              </Link>
            </div>
          </div>
          <Image
            src="/assets/monitoring-display.png"
            alt="VerifAir ASSESS monitoring display"
            width={1536}
            height={1024}
            className="h-full max-h-[34rem] w-full object-cover"
            priority
            unoptimized
          />
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 sm:py-20">
        <div className="container">
          <SectionHeading eyebrow="Four distinct channels" title="See the measurements independently">
            Respirable Dust is presented as its own captured channel alongside PM1, PM2.5 and PM10. VerifAir does not derive one from
            another, and observations do not automatically determine exposure or regulatory compliance.
          </SectionHeading>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {measurementDetails.map((metric, index) => (
              <div key={metric.id} className={`border p-5 ${metric.tone} ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <p className="text-lg font-black">{metric.label}</p>
                <p className="mt-2 text-sm leading-6 opacity-75">{metric.detail}</p>
                <span className="mt-8 block text-xs font-black uppercase tracking-[0.12em]">ug/m3</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="control-centre" className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
        <div className="container">
          <SectionHeading eyebrow="Operational monitoring" title="Shared monitoring dashboard and Wallboard / Display Mode">
            The Control Centre and Wallboard are views of the same VerifAir Platform state for authorised users and monitoring-room
            displays.
          </SectionHeading>
          <div className="mt-8">
            <MonitoringControlCentre />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Demonstration only. Sites, events, people and readings shown are fictional and are used to demonstrate VerifAir functionality.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 py-12 sm:py-16">
        <div className="container">
          <SectionHeading eyebrow="Status semantics" title="UNDERSTANDING VERIFAIR STATUS COLOURS" />
          <div className="mt-7">
            <StatusLegend />
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            VerifAir compares monitored particulate readings with the operational levels configured for the project. States align with the
            configured Dustlight traffic-light trigger levels, maintaining consistent status from the physical monitor to the central
            operational view.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="container">
          <SectionHeading eyebrow="Scaling up" title="One project is a complete VerifAir use case">
            A single project with several monitoring locations already delivers shared visibility, coordinated response and a connected
            record. When you need it, the same platform scales up to a portfolio view across multiple sites.
          </SectionHeading>
          <ol className="mt-10 grid gap-3 md:grid-cols-4">
            {hierarchy.map(([label, detail, Icon], index) => (
              <li key={label} className="relative border border-slate-200 bg-white p-5">
                <Icon className="size-7 text-blue-700" aria-hidden="true" />
                <p className="mt-5 text-xs font-black tracking-[0.14em] text-slate-950">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
                {index < hierarchy.length - 1 ? (
                  <ArrowRightIcon
                    className="absolute -right-5 top-1/2 z-10 hidden size-8 bg-slate-50 p-1 text-blue-700 md:block"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-blue-700 py-16 text-white sm:py-20">
        <div className="container flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">Continue exploring</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-4xl">Need visibility across more than one monitoring location?</h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/contact" className="cta-primary-inverse inline-flex min-h-12 items-center justify-center px-6 font-black">
              Discuss Your Monitoring Requirements
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex min-h-12 items-center justify-center border border-white/60 px-6 font-black text-white hover:bg-white/10"
            >
              Explore Operational Workflow
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusLegend() {
  return (
    <div className="overflow-hidden border-y border-slate-300 bg-white">
      <div className="grid lg:grid-cols-2">
        {statusLegends.map((legend, index) => (
          <section
            key={legend.title}
            className={`px-5 py-5 sm:px-7 ${index > 0 ? "border-t border-slate-200 lg:border-l lg:border-t-0" : ""}`}
            aria-labelledby={`${legend.title.replaceAll(" ", "-").toLowerCase()}-title`}
          >
            <h3
              id={`${legend.title.replaceAll(" ", "-").toLowerCase()}-title`}
              className="text-xs font-black tracking-[0.12em] text-slate-950"
            >
              {legend.title}
            </h3>
            <div className="mt-4 grid gap-3">
              {legend.rows.map(([label, description, tone, icon]) => (
                <div key={label} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`mt-0.5 text-2xl leading-4 ${tone}`}>
                    {icon}
                  </span>
                  <p className="min-w-0 text-sm leading-5 text-slate-600">
                    <strong className={`mr-2 font-black ${tone}`}>{label}</strong>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
