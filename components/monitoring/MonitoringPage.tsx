"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRightIcon, BuildingOffice2Icon, DevicePhoneMobileIcon, GlobeAltIcon, SignalIcon } from "@heroicons/react/24/outline";

import { DEMONSTRATION_METRIC_THRESHOLDS } from "@/lib/demonstration/metric-status";
import { monitoringProjection, type MonitoringLocationProjection } from "@/lib/demonstration/monitoring-projection";
import { resolveMonitoringPresentation } from "@/lib/demonstration/monitoring-view";
import { PARTICULATE_UNIT } from "@/lib/metrics";
import { MONITORING_TECHNOLOGY_PATH, type VerifAirOperationalState } from "@/lib/product-model";
import { DEMONSTRATION_METRICS, publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";

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
  ["PORTFOLIO", "A connected view across multiple projects and operating environments", GlobeAltIcon],
  ["SITE", "A project, facility or construction location", BuildingOffice2Icon],
  ["ZONE", "A work area, floor, boundary or occupied interface", SignalIcon],
  ["MONITORING LOCATION", "A named point with its own device and observation history", DevicePhoneMobileIcon]
] as const;

const statusLegends = [
  {
    title: "DUSTLIGHT DEVICE STATUS",
    rows: [
      ["GREEN", "Device traffic-light status is green", "text-emerald-600"],
      ["YELLOW", "Device traffic-light status is yellow", "text-amber-600"],
      ["RED", "Device traffic-light status is red", "text-red-700"]
    ]
  },
  {
    title: "VERIFAIR OPERATIONAL STATE",
    rows: [
      ["NORMAL", "Below configured attention levels", "text-emerald-600"],
      ["ATTENTION", "A configured attention level has been reached", "text-amber-600"],
      ["ACTION", "A configured action level has been reached", "text-red-700"]
    ]
  },
  {
    title: "SYSTEM HEALTH",
    rows: [
      ["HEALTHY", "Observations current and monitoring systems reporting", "text-emerald-600"],
      ["DEGRADED", "Monitoring available with a system or connectivity issue", "text-amber-600"],
      ["STALE", "An observation has not arrived within the freshness window", "text-blue-700"],
      ["OFFLINE", "A monitor, Edge or communications path is unavailable", "text-slate-900"]
    ]
  }
] as const;

const operationalStateStyles: Record<VerifAirOperationalState, { border: string; background: string; icon: string }> = {
  NORMAL: { border: "border-t-8 border-emerald-600", background: "bg-emerald-50", icon: "✓" },
  ATTENTION: { border: "border-t-8 border-amber-500", background: "bg-amber-50", icon: "!" },
  ACTION: { border: "border-t-8 border-red-600", background: "bg-red-50", icon: "!" }
};

const timestampFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Australia/Sydney",
  timeZoneName: "short"
});
const formatTimestamp = (timestamp: string) => timestampFormatter.format(new Date(timestamp));

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {children ? <p className="mt-4 text-base leading-7 text-slate-600">{children}</p> : null}
    </div>
  );
}

function MeasurementGrid({ monitor }: { monitor: MonitoringLocationProjection }) {
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {measurementDetails.map((metric) => (
        <div
          key={metric.id}
          className={`border p-3 ${metric.id === "RESPIRABLE_DUST" ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}
        >
          <dt className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">{metric.label}</dt>
          <dd className="mt-1 text-2xl font-black text-slate-950">
            {monitor.values[metric.id]} <span className="text-xs font-bold text-slate-500">{PARTICULATE_UNIT}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function MonitorCard({
  monitor,
  selected,
  wallboard,
  onSelect
}: {
  monitor: MonitoringLocationProjection;
  selected: boolean;
  wallboard: boolean;
  onSelect: () => void;
}) {
  const status = operationalStateStyles[monitor.operationalState];
  const cardClassName = `flex h-full min-w-0 flex-col border p-3 text-left shadow-sm sm:p-4 ${wallboard ? (monitor.operationalState === "ACTION" ? "border-red-800 bg-red-950/80 text-white" : monitor.operationalState === "ATTENTION" ? "border-amber-700 bg-amber-950/80 text-white" : "border-emerald-800 bg-emerald-950/80 text-white") : monitor.operationalState === "ACTION" ? "border-red-200 bg-red-50" : monitor.operationalState === "ATTENTION" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"} ${status.border} ${selected && !wallboard ? "ring-2 ring-blue-500" : ""}`;
  const contents = (
    <>
      <div
        className={`-mx-3 -mt-3 mb-3 flex items-center justify-between gap-2 px-3 py-3 sm:-mx-4 sm:-mt-4 sm:px-4 ${wallboard ? "bg-slate-950/50" : status.background}`}
      >
        <span className={`text-xs font-black uppercase tracking-[0.1em] ${wallboard ? "text-white" : "text-slate-950"}`}>
          {monitor.operationalState}
        </span>
        <span
          aria-hidden="true"
          className={`flex size-7 items-center justify-center rounded-full border-2 border-current font-black ${wallboard ? "text-white" : "text-slate-950"}`}
        >
          {status.icon}
        </span>
      </div>
      <p className={`text-[10px] font-black uppercase tracking-[0.1em] ${wallboard ? "text-slate-300" : "text-slate-500"}`}>
        {monitor.site} · {monitor.zone}
      </p>
      <h4 className={`mt-1 text-lg font-black ${wallboard ? "text-white" : "text-slate-950"}`}>{monitor.location}</h4>
      <div className="mt-3">
        <MeasurementGrid monitor={monitor} />
      </div>
      <dl className={`mt-3 grid gap-1 text-xs ${wallboard ? "text-slate-200" : "text-slate-600"}`}>
        <div className="flex justify-between gap-3">
          <dt>Dustlight</dt>
          <dd className="font-black">{monitor.dustlightDeviceStatus}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Observation</dt>
          <dd className="font-black">{monitor.observationFreshness}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Last observation</dt>
          <dd className="text-right font-black">{formatTimestamp(monitor.lastObservationTimestamp)}</dd>
        </div>
      </dl>
    </>
  );
  return wallboard ? (
    <article
      data-testid={`monitoring-location-${monitor.id}`}
      className={cardClassName}
      aria-label={`${monitor.location} wallboard status`}
    >
      {contents}
    </article>
  ) : (
    <button
      type="button"
      data-testid={`monitoring-location-${monitor.id}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={cardClassName}
    >
      {contents}
    </button>
  );
}

function MonitorDetail({ monitor }: { monitor: MonitoringLocationProjection }) {
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
  const readings = history.map((observation) => (observation.reading.status === "available" ? observation.reading.value : 0));
  const maxValue = Math.max(value, ...readings, threshold.action, 1);
  const chartLeft = 46,
    chartRight = 615,
    chartTop = 20,
    chartBottom = 185;
  const scaleY = (reading: number) => chartBottom - (reading / maxValue) * (chartBottom - chartTop);
  const scaleX = (index: number, count: number) => (count <= 1 ? chartLeft : chartLeft + (index / (count - 1)) * (chartRight - chartLeft));
  const linePath =
    readings.length > 1
      ? readings
          .map((reading, index) => `${index === 0 ? "M" : "L"}${scaleX(index, readings.length).toFixed(1)} ${scaleY(reading).toFixed(1)}`)
          .join(" ")
      : `M${chartLeft} ${scaleY(value).toFixed(1)} L${chartRight} ${scaleY(value).toFixed(1)}`;
  const latestX = readings.length > 1 ? scaleX(readings.length - 1, readings.length) : chartRight;
  const latestY = scaleY(readings.at(-1) ?? value);
  const attentionY = scaleY(threshold.attention);

  return (
    <article
      aria-labelledby="monitor-detail-title"
      className="border border-slate-300 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)]"
    >
      <div className={`border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-7 ${status.border}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">Monitor detail</p>
            <h3 id="monitor-detail-title" className="mt-2 text-2xl font-black">
              {monitor.location}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Site: {monitor.site} · Zone: {monitor.zone}
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
      <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Current observations</p>
          <div className="mt-4">
            <MeasurementGrid monitor={monitor} />
          </div>
          <dl className="mt-5 grid gap-3 border-y border-slate-200 py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">VerifAir operational state</dt>
              <dd className="font-black text-slate-900">{monitor.operationalState}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Dustlight device status</dt>
              <dd className="font-black text-slate-900">{monitor.dustlightDeviceStatus}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Observation freshness</dt>
              <dd className="font-black text-slate-900">{monitor.observationFreshness}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Last observation</dt>
              <dd className="text-right font-black text-slate-900">{formatTimestamp(monitor.lastObservationTimestamp)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Monitor health</dt>
              <dd className="font-black text-slate-900">{monitor.monitorHealth}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Edge health</dt>
              <dd className="font-black text-slate-900">{monitor.edgeHealth}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Historical trend</p>
          <p className="mt-1 text-sm font-bold text-slate-900">Deterministic observations for this monitoring location</p>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Historical trend measurement">
            {measurementDetails.map((metric) => (
              <button
                key={metric.id}
                type="button"
                aria-pressed={selectedMetricId === metric.id}
                onClick={() => setSelectedMetricId(metric.id)}
                className="min-h-10 border border-slate-300 px-3 text-xs font-black text-slate-700 aria-pressed:border-blue-700 aria-pressed:bg-blue-700 aria-pressed:text-white"
              >
                {metric.label}
              </button>
            ))}
          </div>
          <svg
            className="mt-5 h-56 w-full border border-slate-200 bg-slate-50"
            viewBox="0 0 640 220"
            role="img"
            aria-label={`${selectedMetric.label} historical trend, latest observation ${value} ${PARTICULATE_UNIT}`}
          >
            {[40, 85, 130, 175].map((y) => (
              <line key={y} x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            ))}
            <text x="6" y={chartTop + 4} fill="#94a3b8" fontSize="10">
              {maxValue.toFixed(0)}
            </text>
            <text x="6" y={chartBottom} fill="#94a3b8" fontSize="10">
              0
            </text>
            <line x1={chartLeft} y1={attentionY} x2={chartRight} y2={attentionY} stroke="#d97706" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x={chartRight - 108} y={attentionY - 6} fill="#b45309" fontSize="10" fontWeight="bold">
              Configured attention level
            </text>
            <path d={linePath} fill="none" stroke="#0369a1" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={latestX} cy={latestY} r="6" fill="#0369a1" stroke="#ffffff" strokeWidth="2" />
            <text x={chartLeft} y="207" fill="#64748b" fontSize="11">
              Start
            </text>
            <text x={chartRight - 42} y="207" fill="#64748b" fontSize="11">
              Latest
            </text>
          </svg>
          <p className="mt-3 text-xs font-bold text-slate-600">
            {selectedMetric.label} · latest observation {value} {PARTICULATE_UNIT} · {formatTimestamp(monitor.lastObservationTimestamp)}
          </p>
        </div>
      </div>
    </article>
  );
}

function SystemHealthSummary({ dark = false }: { dark?: boolean }) {
  const items = [
    `${monitoringProjection.reportingLocationCount}/${monitoringProjection.totalLocationCount} monitors reporting`,
    `Edge ${monitoringProjection.edgeStatus.toLowerCase()}`,
    `Primary provider ${monitoringProjection.primaryProviderStatus.toLowerCase()}`,
    `Secondary provider ${monitoringProjection.secondaryProviderStatus.toLowerCase()}`,
    `Observations ${monitoringProjection.observationsStatus.toLowerCase()}`
  ];
  return (
    <div className={`border p-4 ${dark ? "border-slate-700 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <strong className="flex items-center gap-2 font-black uppercase tracking-[0.08em]">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-emerald-500" />
          Overall system health · {monitoringProjection.overallSystemHealth}
        </strong>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MonitoringControlCentre() {
  const [selectedMonitorId, setSelectedMonitorId] = useState(monitoringProjection.locations[0].id);
  const [wallboard, setWallboard] = useState(false);
  const selectedMonitor = monitoringProjection.locations.find(({ id }) => id === selectedMonitorId) ?? monitoringProjection.locations[0];
  return (
    <div className="border border-slate-300 bg-slate-100 p-3 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)] sm:p-5">
      <div
        className={`${wallboard ? "bg-slate-950" : "bg-[#0f6cab]"} flex flex-wrap items-start justify-between gap-4 px-4 py-4 text-white sm:px-6`}
      >
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-200">
            {wallboard ? "Wallboard · VerifAir Platform browser view" : "Control Centre · at a glance"}
          </p>
          <h3 className="mt-1 text-2xl font-black">{monitoringProjection.site}</h3>
          <p className="mt-1 text-sm text-slate-200">Site · Demonstration Project &nbsp;|&nbsp; Zone · Zone A</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-10 items-center gap-2 border border-emerald-300/60 px-3 text-xs font-black">
            <span aria-hidden="true" className="size-2 rounded-full bg-emerald-300" />
            Observations {monitoringProjection.observationsStatus.toLowerCase()}
          </span>
          <button
            type="button"
            aria-pressed={wallboard}
            onClick={() => setWallboard((current) => !current)}
            className="min-h-11 border border-white/60 px-4 text-xs font-black uppercase tracking-[0.08em] hover:bg-white/10"
          >
            {wallboard ? "Return to Control Centre" : "Wallboard / Display Mode"}
          </button>
        </div>
      </div>
      <div className={`${wallboard ? "bg-slate-950" : "bg-slate-100"} p-3 sm:p-5`}>
        <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {monitoringProjection.locations.map((monitor) => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
              selected={selectedMonitor.id === monitor.id}
              wallboard={wallboard}
              onSelect={() => setSelectedMonitorId(monitor.id)}
            />
          ))}
        </div>
        <div className="mt-4">
          <SystemHealthSummary dark={wallboard} />
        </div>
      </div>
      {!wallboard ? (
        <div className="mt-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.15em] text-slate-500">Selected monitoring location</p>
          <MonitorDetail monitor={selectedMonitor} />
        </div>
      ) : null}
    </div>
  );
}

function StatusLegend() {
  return (
    <div className="overflow-hidden border-y border-slate-300 bg-white">
      <div className="grid lg:grid-cols-3">
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
              {legend.rows.map(([label, description, tone]) => (
                <div key={label} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`mt-0.5 text-2xl leading-4 ${tone}`}>
                    ●
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

export function MonitoringPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="border-b border-slate-800 bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">VerifAir monitoring</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl">
              Visibility across every
              <br />
              monitoring location.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
              One project with several monitoring locations is a complete VerifAir view. Add more sites when you need portfolio-wide
              visibility.
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
          <div className="relative overflow-hidden border border-white/15">
            <Image
              src="/assets/monitoring-display.png"
              alt="VerifAir monitoring display"
              width={1536}
              height={1024}
              className="h-full max-h-[34rem] w-full object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-x-3 bottom-3 border border-white/20 bg-slate-950/90 p-4 backdrop-blur-sm sm:inset-x-5 sm:bottom-5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-300">Monitoring view</p>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
                <span>{monitoringProjection.totalLocationCount} monitoring locations</span>
                <span>Four distinct particulate channels</span>
                <span>System health {monitoringProjection.overallSystemHealth.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="container">
          <SectionHeading eyebrow="Connected monitoring structure" title="From portfolio to monitoring location">
            Start with one complete project view and add sites when broader portfolio visibility is required.
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
                <span className="mt-8 block text-xs font-black uppercase tracking-[0.12em]">{PARTICULATE_UNIT}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="control-centre" className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
        <div className="container">
          <SectionHeading eyebrow="Operational monitoring" title="Multi-location monitoring. One shared view.">
            Control Centre, Monitor Detail, trends and Wallboard all use the same deterministic monitoring scenario and status projection.
          </SectionHeading>
          <div className="mt-8">
            <MonitoringControlCentre />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Demonstration only. Sites and readings shown are fictional and demonstrate monitoring functionality.
          </p>
        </div>
      </section>
      <section className="border-b border-slate-200 py-12 sm:py-16">
        <div className="container">
          <SectionHeading eyebrow="Three distinct states" title="Understand what each status means" />
          <div className="mt-7">
            <StatusLegend />
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            Dustlight device status, VerifAir operational state and overall system health answer different questions. They remain visibly
            separate and are not substituted for one another.
          </p>
        </div>
      </section>
      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="container">
          <SectionHeading eyebrow="Technology path" title="From particulate observation to a shared platform view">
            Each layer has a clear monitoring responsibility while the platform keeps the operational picture connected.
          </SectionHeading>
          <ol className="mt-9 grid gap-3 md:grid-cols-4">
            {MONITORING_TECHNOLOGY_PATH.map((item, index) => (
              <li key={item.technology} className="relative border border-slate-200 bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">{item.technology}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.responsibilities}</p>
                {index < MONITORING_TECHNOLOGY_PATH.length - 1 ? (
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
      <section className="border-b border-slate-200 py-12 sm:py-16">
        <div className="container">
          <SectionHeading eyebrow="Responsible positioning" title="Monitoring information supports informed project decisions">
            Demonstration observations are fictional and indicative. They are not workplace exposure measurements, reference measurements or
            automatic compliance determinations. Project requirements and operational triggers must be configured and reviewed for the
            relevant context.
          </SectionHeading>
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
              href="/workflow"
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
