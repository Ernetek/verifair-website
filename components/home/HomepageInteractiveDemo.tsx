"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowPathIcon,
  BellAlertIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronLeftIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { selectLatestObservation } from "@/lib/replay/selectors";
import {
  DEMONSTRATION_DEVICE_HEALTH,
  getDemonstrationMetricTrendSeries,
  getDemonstrationRespirableDustTrend,
  publicDemonstrationScenario,
} from "@/lib/replay/demonstration-scenario";
import { PARTICULATE_UNIT } from "@/lib/metrics";
import { classifyDemonstrationMetric } from "@/lib/demonstration/metric-status";
import { DemonstrationSession } from "@/lib/demonstration/session";
import { ControlCentreEvents } from "./ControlCentreEvents";
import { ControlCentreReports } from "./ControlCentreReports";

const INCIDENT_ID = "VA-INC-2026-0042";
const OPERATOR = "Site Supervisor";
const metrics = [
  { id: "RESPIRABLE_DUST", label: "RESPIRABLE DUST" },
  { id: "PM1", label: "PM1" },
  { id: "PM2_5", label: "PM2.5" },
  { id: "PM10", label: "PM10" },
] as const;
type MetricId = (typeof metrics)[number]["id"];

const sequenceSteps = [
  {
    offsetMs: 0,
    label: "Baseline",
    title: "All locations normal",
    description: "Routine monitoring is active across the project. Select any location to inspect its current particulate readings.",
  },
  {
    offsetMs: 120_000,
    label: "Action",
    title: "Action condition detected",
    description: "Zone A · Monitoring Location 1 is promoted straight into the action workflow when the configured project action level is reached.",
  },
  {
    offsetMs: 240_000,
    label: "Response",
    title: "Operational response recorded",
    description: "The response workflow is available while monitoring continues from the same deterministic scenario record.",
  },
  {
    offsetMs: 360_000,
    label: "Monitoring",
    title: "Subsequent observations retained",
    description: "New readings are retained after the response. The interface does not imply that the response caused any change.",
  },
  {
    offsetMs: 480_000,
    label: "Review",
    title: "Condition returned to normal",
    description: "The event is ready for review with its readings, actions, comments and evidence kept together.",
  },
] as const;

const locationMeta = [
  ["WORK_ZONE_A", "Zone A", "Monitoring Location 1"],
  ["OCCUPIED_INTERFACE", "Zone A", "Monitoring Location 2"],
  ["SHARED_CORRIDOR", "Zone A", "Monitoring Location 3"],
  ["EXTERNAL_BOUNDARY", "Zone A", "Monitoring Location 4"],
] as const;

const operationalStateLegend = [
  ["ACTION", "Configured action level reached", "bg-red-600"],
  ["ATTENTION", "Configured attention level reached", "bg-amber-500"],
  ["NORMAL", "Below configured attention level", "bg-emerald-500"],
] as const;

const systemHealthLegend = [
  ["HEALTHY", "Observations current and monitoring systems reporting", "bg-emerald-600"],
  ["DEGRADED", "Monitoring available with a system or connectivity issue", "bg-amber-600"],
  ["STALE", "Current observation not received within freshness window", "bg-blue-600"],
  ["OFFLINE", "Monitor, Edge or communications unavailable", "bg-slate-900"],
] as const;

function OperationalLegend() {
  const renderRows = (items: readonly (readonly [string, string, string])[]) => items.map(([label, meaning, colour]) => (
    <div key={label} className="grid grid-cols-[auto_5.5rem_minmax(0,1fr)] items-start gap-2 text-[10px] leading-4 sm:text-xs sm:leading-5">
      <span className={`mt-1 size-2.5 rounded-full ${colour}`} aria-hidden="true" />
      <strong className="text-slate-900">{label}</strong>
      <span className="text-slate-600">{meaning}</span>
    </div>
  ));

  return (
    <section className="grid border-t border-slate-200 bg-white md:grid-cols-2" aria-label="Operational and system health legend">
      <div className="p-4 sm:p-5 md:border-r md:border-slate-200">
        <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">Particulate / operational state</h3>
        <div className="mt-3 grid gap-2">{renderRows(operationalStateLegend)}</div>
      </div>
      <div className="border-t border-slate-200 p-4 sm:p-5 md:border-t-0">
        <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">System / data health</h3>
        <div className="mt-3 grid gap-2">{renderRows(systemHealthLegend)}</div>
      </div>
    </section>
  );
}

function ViewHeading({ title, description }: { title: string; description: string }) {
  return <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-700">Control Centre page</p><h3 className="mt-1 text-xl font-black text-slate-950">{title}</h3><p className="mt-1 text-xs text-slate-500">{description}</p></header>;
}

const timelineRows = [
  [0, "Baseline monitoring started"],
  [120_000, "Configured action level reached"],
  [120_000, "Event created and notifications sent"],
  [180_000, "Acknowledged and assigned"],
  [240_000, "Response action recorded"],
  [360_000, "Reading reducing; follow-up retained"],
  [480_000, "Below configured attention level; review completed"],
] as const;

function formatTime(offsetMs: number) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(Date.parse(publicDemonstrationScenario.startTimestamp) + offsetMs));
}

function formatAustralianTime(date: Date) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function currentValue(snapshot: ReturnType<DemonstrationSession["getSnapshot"]>, monitorId: string, metricId: string) {
  const observation = selectLatestObservation(snapshot.replayState, monitorId, metricId);
  return observation?.reading.status === "available" ? Math.round(observation.reading.value) : 0;
}

function stateFor(snapshot: ReturnType<DemonstrationSession["getSnapshot"]>, monitorId: string) {
  return classifyDemonstrationMetric("PM2_5", currentValue(snapshot, monitorId, "PM2_5")).label;
}

function useHomepageSession() {
  const [session] = useState(() => new DemonstrationSession());
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
  return { session, snapshot };
}

function MetricSelector({ selected, onChange }: { selected: MetricId; onChange: (metric: MetricId) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Live Daily Trend measurement">
      {metrics.map((metric) => (
        <button
          key={metric.id}
          type="button"
          aria-pressed={selected === metric.id}
          onClick={() => onChange(metric.id)}
          className="min-h-9 border border-slate-300 px-2.5 text-[10px] font-black tracking-[0.06em] text-slate-700 aria-pressed:border-blue-700 aria-pressed:bg-blue-700 aria-pressed:text-white"
        >
          {metric.label}
        </button>
      ))}
    </div>
  );
}

function MonitoringTile({ snapshot, monitorId, selected, onSelect }: {
  snapshot: ReturnType<DemonstrationSession["getSnapshot"]>;
  monitorId: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = locationMeta.find(([id]) => id === monitorId) ?? locationMeta[0];
  const state = stateFor(snapshot, monitorId);
  const retainsAlertHistory = monitorId === "WORK_ZONE_A" && snapshot.incidentState.opened && !snapshot.incidentState.closed && state === "NORMAL";
  const sparkValues = getDemonstrationRespirableDustTrend(monitorId, snapshot.replayState.offsetMs);
  const minimum = Math.min(...sparkValues);
  const range = Math.max(Math.max(...sparkValues) - minimum, 1);
  const points = sparkValues.map((value, index) => `${(index / (sparkValues.length - 1)) * 180},${54 - ((value - minimum) / range) * 38}`).join(" ");
  const presentation = state === "ACTION"
    ? { rail: "border-l-red-500 border-t-red-500", surface: "bg-red-50/80", icon: "bg-red-600 text-white", stroke: "#dc2626", fill: "#fecaca" }
    : state === "ATTENTION"
      ? { rail: "border-l-amber-500 border-t-amber-500", surface: "bg-amber-50/80", icon: "bg-amber-500 text-white", stroke: "#f59e0b", fill: "#fde68a" }
      : { rail: "border-l-emerald-500 border-t-emerald-500", surface: "bg-emerald-50/70", icon: "bg-emerald-600 text-white", stroke: "#16a34a", fill: "#bbf7d0" };

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-testid={`homepage-monitoring-location-${monitorId}`}
      className={`min-w-0 border border-l-4 border-t-4 border-slate-200 ${presentation.rail} ${presentation.surface} p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:p-5 ${selected ? "ring-2 ring-blue-600 ring-offset-2" : ""}`}
    >
      <span className="flex items-start justify-between gap-4">
        <span>
          <span className="block text-base font-black uppercase text-slate-950 sm:text-lg">{meta[1]}</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{meta[2]}</span>
        </span>
        {retainsAlertHistory ? (
          <span className="flex items-center gap-1.5" aria-label="ACTION history, current state HEALTHY">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-red-600 text-white">
              <ExclamationTriangleIcon className="size-4 stroke-[2.5]" aria-hidden="true" />
            </span>
            <span className={`grid size-8 shrink-0 place-items-center rounded-full ${presentation.icon}`}>
              <CheckIcon className="size-5 stroke-[3]" aria-hidden="true" />
            </span>
          </span>
        ) : (
          <span className={`grid size-8 shrink-0 place-items-center rounded-full ${presentation.icon}`} aria-label={state === "NORMAL" ? "HEALTHY" : state}>
            {state === "NORMAL" ? <CheckIcon className="size-5 stroke-[3]" aria-hidden="true" /> : <ExclamationTriangleIcon className="size-5 stroke-[2.5]" aria-hidden="true" />}
          </span>
        )}
      </span>
      <span className="mt-3 grid grid-cols-[minmax(0,1fr)_6rem] items-end gap-2 sm:mt-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(8rem,1.2fr)] sm:gap-4">
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">RESPIRABLE DUST</span>
          <span className="mt-1 block font-mono text-3xl font-bold leading-none text-slate-950 sm:text-4xl">{currentValue(snapshot, monitorId, "RESPIRABLE_DUST")} <span className="text-[10px] font-normal text-slate-500">{PARTICULATE_UNIT}</span></span>
          <span className="mt-2 block text-[9px] font-semibold text-slate-500">Latest observation · {formatTime(snapshot.replayState.offsetMs)}</span>
        </span>
        <svg className="h-12 w-full sm:h-16" viewBox="0 0 180 60" role="img" aria-label={`${meta[1]} ${meta[2]} respirable dust recent trend`} preserveAspectRatio="none">
          <polygon points={`0,60 ${points} 180,60`} fill={presentation.fill} opacity="0.65" />
          <polyline points={points} fill="none" stroke={presentation.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="mt-3 grid grid-cols-3 gap-1.5 border-t border-slate-300/80 pt-3 sm:mt-5 sm:gap-3 sm:pt-4">
        {metrics.slice(1).map((metric) => (
          <span key={metric.id}>
            <span className="block text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">{metric.label}</span>
            <span className="mt-1 block font-mono text-lg font-bold text-slate-950 sm:text-xl">{currentValue(snapshot, monitorId, metric.id)} <span className="text-[8px] font-normal text-slate-500">{PARTICULATE_UNIT}</span></span>
          </span>
        ))}
      </span>
    </motion.button>
  );
}

function Trend({ snapshot, monitorId, metricId, onChange }: { snapshot: ReturnType<DemonstrationSession["getSnapshot"]>; monitorId: string; metricId: MetricId; onChange: (metric: MetricId) => void }) {
  const values = getDemonstrationMetricTrendSeries(monitorId, metricId, snapshot.replayState.offsetMs);
  const latest = currentValue(snapshot, monitorId, metricId);
  const threshold = metricId === "RESPIRABLE_DUST" ? { attention: 25, action: 50 } : metricId === "PM1" ? { attention: 8, action: 20 } : metricId === "PM2_5" ? { attention: 15, action: 25 } : { attention: 30, action: 50 };
  const max = Math.max(latest, threshold.action, ...values, 1);
  const x = (index: number) => 38 + (index / Math.max(values.length - 1, 1)) * 560;
  const y = (value: number) => 184 - (value / max) * 150;
  const path = values.length > 1 ? values.map((value, index) => `${index ? "L" : "M"}${x(index)} ${y(value)}`).join(" ") : `M38 ${y(latest)} L598 ${y(latest)}`;
  const smoothedPath = values.length > 1
    ? values.map((value, index) => {
      const prev = values[index - 1] ?? value;
      const next = values[index + 1] ?? value;
      const smoothed = (prev + value + next) / 3;
      return `${index ? "L" : "M"}${x(index)} ${y(smoothed)}`;
    }).join(" ")
    : path;
  const timelineLabels = values.map((_, index) => {
    const hoursAgo = (values.length - 1 - index) * 2;
    return hoursAgo === 0 ? "Now" : `-${hoursAgo}h`;
  });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">LIVE DAILY TREND</p>
          <p className="mt-1 text-sm font-bold text-slate-900">2-hour timeline · {metrics.find((metric) => metric.id === metricId)?.label}</p>
        </div>
        <MetricSelector selected={metricId} onChange={onChange} />
      </div>
      <div className="mt-3 overflow-hidden border border-slate-200 bg-slate-50">
        <svg className="h-52 w-full" viewBox="0 0 640 230" role="img" aria-label={`${metricId} live daily trend with latest reading ${latest} ${PARTICULATE_UNIT}`}>
          {[35, 85, 135, 185].map((line) => <line key={line} x1="38" y1={line} x2="598" y2={line} stroke="#e2e8f0" />)}
          <line x1="38" y1={y(threshold.attention)} x2="598" y2={y(threshold.attention)} stroke="#d97706" strokeDasharray="6 4" />
          <line x1="38" y1={y(threshold.action)} x2="598" y2={y(threshold.action)} stroke="#dc2626" strokeDasharray="6 4" />
          <text x="4" y="39" fontSize="10" fill="#64748b">{max} {PARTICULATE_UNIT}</text>
          <text x="4" y="187" fontSize="10" fill="#64748b">0</text>
          <path d={smoothedPath} fill="none" stroke="#7dd3fc" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={values.length > 1 ? x(values.length - 1) : 598} cy={y(latest)} r="6" fill="#0369a1" stroke="white" strokeWidth="2"><title>{`Latest reading: ${latest} ${PARTICULATE_UNIT}`}</title></circle>
          {timelineLabels.map((label, index) => <text key={label} x={x(index) - 9} y="221" fontSize="10" fill="#64748b">{label}</text>)}
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
        <span>Attention {threshold.attention} · Action {threshold.action} · Latest {latest} {PARTICULATE_UNIT}</span>
        <Link href="/monitoring" className="font-black text-blue-700 hover:underline">VIEW HISTORICAL TRENDS →</Link>
      </div>
    </div>
  );
}

function SystemHealthView() {
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedHardware, setSelectedHardware] = useState<string>("");
  const selectedSensor = DEMONSTRATION_DEVICE_HEALTH.sensors.find((sensor) => sensor.monitorId === selectedHardware);
  const selectedMeta = selectedSensor ? locationMeta.find(([id]) => id === selectedSensor.monitorId) ?? locationMeta[0] : null;
  const gateway = DEMONSTRATION_DEVICE_HEALTH.gateway;
  const zoneSensors = selectedZone === "ZONE_A" ? DEMONSTRATION_DEVICE_HEALTH.sensors : [];
  const details = selectedSensor && selectedMeta
    ? [
        ["Asset type", "Particulate monitor"],
        ["Zone", selectedMeta[1]],
        ["Monitoring location", selectedMeta[2]],
        ["Status", "ONLINE"],
        ["Reporting", "Current"],
        ["Battery", `${selectedSensor.batteryPercent}%`],
        ["Sensor serial", selectedSensor.serialNumber],
        ["Next calibration", selectedSensor.nextCalibration],
        ["Connected gateway", gateway.serialNumber],
      ]
    : [
        ["Monitored zones", "1"],
        ["Sensors online", "4 of 4"],
        ["Zones reporting", "1 of 1"],
        ["Site gateway", gateway.status],
        ["Gateway serial", gateway.serialNumber],
        ["Data freshness", "Current"],
        ["Overall status", "HEALTHY"],
      ];

  const selectZone = (zoneId: string) => {
    setSelectedZone(zoneId);
    setSelectedHardware("");
  };

  return (
    <section className="bg-white" aria-labelledby="system-health-view-heading">
      <ViewHeading title="Health" description="Site overview and monitoring hardware status." />
      <div className="px-4 py-5 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div><h4 id="system-health-view-heading" className="text-lg font-black text-slate-950">Site overview</h4><p className="mt-1 text-sm text-slate-600">4/4 sensors online · 4/4 monitoring locations reporting · Gateway online</p></div>
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-700"><span className="size-2.5 rounded-full bg-emerald-500" aria-hidden="true" /> Healthy</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="grid gap-2">
            <label htmlFor="health-zone" className="text-xs font-black uppercase tracking-[0.12em] text-slate-600">Zone</label>
            <select id="health-zone" value={selectedZone} onChange={(event) => selectZone(event.target.value)} className="min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-bold normal-case text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
              <option value="">Site overview</option>
              <option value="ZONE_A">Zone A</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="health-hardware" className="text-xs font-black uppercase tracking-[0.12em] text-slate-600">Hardware</label>
            <select id="health-hardware" value={selectedHardware} onChange={(event) => setSelectedHardware(event.target.value)} disabled={!selectedZone} className="min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-bold normal-case text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
              <option value="">{selectedZone ? "Select hardware" : "Select a zone first"}</option>
              {zoneSensors.map((sensor) => { const meta = locationMeta.find(([id]) => id === sensor.monitorId); return <option key={sensor.monitorId} value={sensor.monitorId}>{meta?.[2]} · {sensor.serialNumber}</option>; })}
            </select>
          </div>
        </div>
        <section className="mt-5 border-y border-slate-200" aria-label="Selected asset health details">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="flex items-center gap-3"><CpuChipIcon className="size-6 text-sky-700" aria-hidden="true" /><div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{selectedSensor ? "Selected hardware" : "Site health snapshot"}</p><h4 className="mt-1 text-lg font-black text-slate-950">{selectedSensor && selectedMeta ? `${selectedMeta[1]} · ${selectedMeta[2]}` : "Demonstration Healthcare Construction Project"}</h4></div></div><span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-700"><span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" /> {selectedSensor ? "Online" : "Healthy"}</span></div>
          <dl>{details.map(([label, value]) => <div key={label} className="grid gap-1 border-t border-slate-200 py-3 text-sm sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6"><dt className="font-bold text-slate-500">{label}</dt><dd className="font-mono font-bold text-slate-900">{value}</dd></div>)}</dl>
        </section>
      </div>
      <p className="mt-4 text-[10px] leading-4 text-slate-500">Fictional demonstration hardware identifiers and health values.</p>
    </section>
  );
}

function AssessView({ session, snapshot, selectedId, setSelectedId, onOpenEvents, onWorkStarted }: {
  session: DemonstrationSession;
  snapshot: ReturnType<DemonstrationSession["getSnapshot"]>;
  selectedId: string;
  setSelectedId: (id: string) => void;
  onOpenEvents: () => void;
  onWorkStarted: () => void;
}) {
  const selectedMeta = locationMeta.find(([id]) => id === selectedId) ?? locationMeta[0];
  const [detailsOpen, setDetailsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!detailsOpen) return;
    closeButtonRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [detailsOpen]);

  const selectLocation = (id: string) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };

  const openIncidentWorkspace = () => {
    if (selectedId === "WORK_ZONE_A" && snapshot.incidentState.opened && !snapshot.incidentState.investigationStarted) {
      const acknowledged = session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: OPERATOR });
      if (acknowledged.ok) session.dispatchIncidentEvent({ type: "ASSIGNED", assignee: OPERATOR, priority: "High" });
      if (session.getSnapshot().incidentState.phase === "Assign") {
        session.dispatchIncidentEvent({ type: "INVESTIGATION_STARTED", startedBy: OPERATOR });
        onWorkStarted();
      }
    }
    setDetailsOpen(false);
    onOpenEvents();
  };

  return (
    <div>
      <ViewHeading title="Monitoring" description="Current particulate conditions across Zone A monitoring locations." />
      <div id="control-centre-overview" className="grid scroll-mt-4 gap-2 bg-slate-100 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5" aria-label="Monitoring overview">
        {locationMeta.map(([id]) => <MonitoringTile key={id} snapshot={snapshot} monitorId={id} selected={id === selectedId} onSelect={() => selectLocation(id)} />)}
      </div>

      <AnimatePresence>
        {detailsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-0 sm:items-center sm:justify-center sm:p-6" onClick={() => setDetailsOpen(false)}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby="location-details-title" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-white p-5 shadow-2xl sm:rounded-lg sm:p-7" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-700">Location incidents</p><h3 id="location-details-title" className="mt-1 text-2xl font-black text-slate-950">{selectedMeta[1]} · {selectedMeta[2]}</h3><p className="mt-1 text-xs text-slate-500">Current and historical operational events for this monitoring location.</p></div><button ref={closeButtonRef} type="button" onClick={() => setDetailsOpen(false)} className="grid size-11 place-items-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Close location details"><XMarkIcon className="size-5" /></button></div>
              <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
                {selectedId === "WORK_ZONE_A" && snapshot.incidentState.opened && <div className="border-l-4 border-red-500 bg-red-50/60 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-[10px] font-black text-red-700">{INCIDENT_ID}</p><h4 className="mt-1 text-base font-black text-slate-950">Respirable Dust action condition</h4><p className="mt-1 text-xs text-slate-600">{snapshot.incidentState.closed ? "Resolved" : snapshot.incidentState.investigationStarted ? "In progress" : "Open · acknowledgement required"}</p></div><span className="border border-red-200 bg-white px-2 py-1 text-[10px] font-black text-red-800">ACTION</span></div></div>}
                <div className="p-4"><p className="font-mono text-[10px] font-black text-slate-500">VA-INC-2026-0038</p><h4 className="mt-1 text-sm font-black text-slate-900">Observation freshness review</h4><p className="mt-1 text-xs text-slate-500">Resolved · Historical demonstration record</p></div>
              </div>
              <div className="mt-5 flex justify-end"><button type="button" onClick={openIncidentWorkspace} className="min-h-11 bg-red-700 px-4 text-xs font-black text-white">{selectedId === "WORK_ZONE_A" && snapshot.incidentState.opened && !snapshot.incidentState.investigationStarted ? "START WORK" : "OPEN EVENTS WORKSPACE"}</button></div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ControlCentreMonitoring() {
  const [session] = useState(() => {
    const nextSession = new DemonstrationSession();
    nextSession.seek(240_000);
    return nextSession;
  });
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
  const [selectedId, setSelectedId] = useState("WORK_ZONE_A");

  return (
    <AssessView
      session={session}
      snapshot={snapshot}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
      onOpenEvents={() => window.location.assign("/workflow")}
      onWorkStarted={() => undefined}
    />
  );
}

function TrendsView({ snapshot, selectedId, setSelectedId, metricId, setMetricId }: { snapshot: ReturnType<DemonstrationSession["getSnapshot"]>; selectedId: string; setSelectedId: (id: string) => void; metricId: MetricId; setMetricId: (value: MetricId) => void }) {
  const selectedMeta = locationMeta.find(([id]) => id === selectedId) ?? locationMeta[0];
  return <section className="bg-white"><ViewHeading title="Trends" description="Review particulate history by monitoring location and metric." /><div className="p-4 sm:p-5"><label htmlFor="trend-location" className="text-xs font-black uppercase tracking-[0.12em] text-slate-600">Monitoring location</label><select id="trend-location" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-2 min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600">{locationMeta.map(([id, zone, location]) => <option key={id} value={id}>{zone} · {location}</option>)}</select><div className="mt-5 border-t border-slate-200 pt-5"><p className="mb-4 text-sm font-black text-slate-950">{selectedMeta[1]} · {selectedMeta[2]}</p><Trend snapshot={snapshot} monitorId={selectedId} metricId={metricId} onChange={setMetricId} /></div></div></section>;
}

export function ActView({ session, snapshot }: { session: DemonstrationSession; snapshot: ReturnType<DemonstrationSession["getSnapshot"]> }) {
  const incident = snapshot.incidentState;
  const actionValue = currentValue(snapshot, "WORK_ZONE_A", "RESPIRABLE_DUST");
  const dispatch = (type: "ACKNOWLEDGED" | "ASSIGNED" | "RESPONSE_RECORDED" | "RESPONSE_NOTE_ADDED") => {
    if (type === "ACKNOWLEDGED") session.dispatchIncidentEvent({ type, acknowledgedBy: OPERATOR });
    if (type === "ASSIGNED") session.dispatchIncidentEvent({ type, assignee: OPERATOR, priority: "High" });
    if (type === "RESPONSE_RECORDED") session.dispatchIncidentEvent({ type, responseType: "Local response", details: "Work area reviewed and response recorded.", performedBy: OPERATOR });
    if (type === "RESPONSE_NOTE_ADDED") session.dispatchIncidentEvent({ type, author: OPERATOR, note: "Follow-up comment added to the event record." });
  };
  const steps = [
    ["ACTION CONDITION DETECTED", true],
    ["EVENT CREATED", incident.opened],
    ["NOTIFICATIONS SENT", incident.opened],
    ["ACKNOWLEDGED", incident.acknowledged],
    ["ASSIGNED", Boolean(incident.assignedTo)],
    ["RESPONSE / INVESTIGATION", incident.investigationStarted || incident.responses.length > 0],
    ["CONTINUED MONITORING", snapshot.replayState.offsetMs >= 360_000],
  ] as const;
     return <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]"><div className="border border-red-300 bg-red-50 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-red-800">ACT · EVENT WORKFLOW</p><h2 className="mt-2 text-2xl font-black text-slate-950">ACTION CONDITION DETECTED</h2><p className="mt-3 text-sm font-bold text-slate-700">Work Zone A · Monitoring Location 1 · Respirable Dust</p><p className="mt-1 text-4xl font-black text-slate-950">{actionValue} <span className="text-sm">{PARTICULATE_UNIT}</span></p><p className="mt-2 text-xs font-bold text-red-800">CONFIGURED PROJECT ACTION LEVEL REACHED · {formatTime(120_000)}</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => dispatch("ACKNOWLEDGED")} disabled={incident.acknowledged} className="min-h-10 bg-red-700 px-3 text-xs font-black text-white disabled:bg-slate-300">ACKNOWLEDGE</button><button type="button" onClick={() => dispatch("ASSIGNED")} disabled={!incident.acknowledged || Boolean(incident.assignedTo)} className="min-h-10 border border-red-700 px-3 text-xs font-black text-red-800 disabled:border-slate-300 disabled:text-slate-400">ASSIGN</button><button type="button" onClick={() => dispatch("RESPONSE_RECORDED")} disabled={!incident.assignedTo} className="min-h-10 border border-slate-300 px-3 text-xs font-black disabled:text-slate-400">ADD ACTION</button><button type="button" onClick={() => dispatch("RESPONSE_NOTE_ADDED")} disabled={!incident.assignedTo} className="min-h-10 border border-slate-300 px-3 text-xs font-black disabled:text-slate-400">ADD COMMENT</button></div></div><div className="border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">EVENT {INCIDENT_ID}</p><div className="mt-3 space-y-2">{steps.map(([label, complete]) => <div key={label} className={`flex items-center gap-3 border-l-4 px-3 py-2 text-sm font-black ${complete ? "border-emerald-500 bg-emerald-50 text-slate-950" : "border-slate-200 text-slate-400"}`}><span aria-hidden="true">{complete ? "✓" : "○"}</span>{label}</div>)}</div></div></div>;
}

function RecordView({ snapshot }: { snapshot: ReturnType<DemonstrationSession["getSnapshot"]> }) {
  const resolved = snapshot.incidentState.closed;
  return (
    <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
      <div className="border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">RECORD · CONNECTED OPERATIONAL RECORD</p>
        <h2 className="mt-2 text-2xl font-black">{INCIDENT_ID}</h2>
        <span className={`mt-3 inline-flex border px-3 py-1 text-xs font-black uppercase ${resolved ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-amber-300 bg-amber-50 text-amber-900"}`}>{resolved ? "RESOLVED" : "IN PROGRESS"}</span>
        <p className="mt-4 text-sm font-bold">ZONE A · MONITORING LOCATION 1 · Particulate Event</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <span className="border bg-white p-2 font-bold">READINGS<br /><span className="font-normal">Same scenario measurements</span></span>
          <span className="border bg-white p-2 font-bold">RESPONSE<br /><span className="font-normal">Same event actions</span></span>
          <span className="border bg-white p-2 font-bold">COMMENTS<br /><span className="font-normal">Connected notes</span></span>
          <span className="border bg-white p-2 font-bold">EVIDENCE<br /><span className="font-normal">Reviewable record</span></span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2"><Link href="/reporting" className="cta-primary inline-flex min-h-10 items-center px-3 text-xs font-black">VIEW EVENT RECORD</Link><Link href="/reporting" className="inline-flex min-h-10 items-center border border-slate-300 px-3 text-xs font-black">VIEW GENERATED REPORT</Link></div>
      </div>
      <div className="border border-slate-200 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">TIMELINE · {INCIDENT_ID}</p>
        <div className="mt-3 space-y-2">{timelineRows.map(([offset, label]) => <div key={`${offset}-${label}`} className={`flex gap-3 border-l-2 py-1 pl-3 text-sm ${snapshot.replayState.offsetMs >= offset ? "border-blue-600 text-slate-950" : "border-slate-200 text-slate-400"}`}><span className="w-12 shrink-0 font-mono text-xs">{formatTime(offset)}</span><span>{label}</span></div>)}</div>
      </div>
    </div>
  );
}

export function HomepageInteractiveDemo() {
  const { session, snapshot } = useHomepageSession();
  const [recordOpen, setRecordOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("WORK_ZONE_A");
  const [metricId, setMetricId] = useState<MetricId>("RESPIRABLE_DUST");
  const [activeView, setActiveView] = useState<"monitoring" | "trends" | "reports" | "events" | "health">("monitoring");
  const [hydrated, setHydrated] = useState(false);
  const [clockNow, setClockNow] = useState<Date | null>(null);
  const currentStepIndex = sequenceSteps.reduce((activeIndex, step, index) => snapshot.replayState.offsetMs >= step.offsetMs ? index : activeIndex, 0);
  const currentStep = sequenceSteps[currentStepIndex];

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    let timerId: number;
    const updateClock = () => {
      setClockNow(new Date());
      timerId = window.setTimeout(updateClock, 1_000);
    };
    updateClock();
    return () => window.clearTimeout(timerId);
  }, []);

  const seekStep = (index: number) => session.seek(sequenceSteps[index].offsetMs);

  const completeGuidedStep = () => {
    if (currentStepIndex === 0 || currentStepIndex === 3) {
      seekStep(currentStepIndex + 1);
    }
  };

  const resetDemo = () => {
    session.restart();
    setRecordOpen(false);
    setActiveView("monitoring");
  };

  const eventActive = snapshot.incidentState.opened && !snapshot.incidentState.closed;
  const eventResolved = snapshot.incidentState.closed;
  const ribbon = eventResolved ? `✓ RESOLVED · ${INCIDENT_ID} · Operational record complete` : eventActive ? `● ACTION · Zone A · Monitoring Location 1 · Respirable Dust ${currentValue(snapshot, "WORK_ZONE_A", "RESPIRABLE_DUST")} ${PARTICULATE_UNIT} · ${INCIDENT_ID}` : null;
  const stepInstruction = [
    "The live baseline is shown for context. Start the scenario when you are ready to introduce a changing condition.",
    "Zone A now opens straight into an action alert. Open the raised event to start the operational review.",
    "Start work in the Events workspace and record the operator response.",
    "Review the retained follow-up observations, then complete the monitoring period.",
    "Complete resolution review, explicitly resolve the event, then open the connected record.",
  ][currentStepIndex];

  const monitoringView = <AssessView session={session} snapshot={snapshot} selectedId={selectedId} setSelectedId={setSelectedId} onOpenEvents={() => setActiveView("events")} onWorkStarted={() => seekStep(2)} />;

  return (
    <section id="monitoring" className="border-b border-slate-200 bg-white px-3 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[96rem]">
        <header className="mb-5 max-w-3xl px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">VerifAir · browser demonstration</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">See the VerifAir particulate monitoring and task management workspace in action.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Step through a scripted healthcare-refurbishment scenario. Watch operational exceptions reorganise the board while system health remains independently visible.</p>
        </header>

        <aside className="mb-4 border border-slate-300 bg-white px-4 py-3 text-slate-900" aria-label="Demonstration guide">
          <section className="grid gap-3 lg:grid-cols-[11rem_minmax(0,1fr)_auto] lg:items-center" aria-labelledby="demo-sequence-heading">
            <div>
              <h3 id="demo-sequence-heading" className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Demo sequence</h3>
              <div className="mt-2 flex items-center gap-1.5" aria-label={`Step ${currentStepIndex + 1} of ${sequenceSteps.length}`}>{sequenceSteps.map((step, index) => <span key={step.label} className={`h-2 rounded-full transition-all ${index === currentStepIndex ? "w-8 bg-slate-950" : index < currentStepIndex ? "w-2 bg-sky-600" : "w-2 bg-slate-300"}`} />)}</div>
              <div className="mt-3">
                {currentStepIndex === 0
                  ? <button type="button" onClick={completeGuidedStep} className="min-h-11 min-w-[9rem] bg-blue-600 px-5 text-xs font-black text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">START DEMO</button>
                  : <strong className="font-mono text-[10px] text-slate-700">{currentStepIndex + 1}/{sequenceSteps.length} · {currentStep.label}</strong>}
              </div>
            </div>
            <div className="min-w-0 border-l-2 border-sky-500 pl-3">
              <h4 className="text-sm font-black text-slate-950">{currentStep.title}</h4>
              <p className="mt-1 text-xs leading-4 text-slate-600">{currentStep.description} <strong className="text-slate-800">{stepInstruction}</strong></p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {currentStepIndex === 1 && <button type="button" onClick={() => setActiveView("events")} className="min-h-10 bg-red-700 px-3 text-xs font-black text-white">OPEN RAISED EVENT</button>}
              {currentStepIndex === 2 && <p className="max-w-xs border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-[10px] font-bold text-amber-950">Start work and save the response from the Events workspace, then continue monitoring.</p>}
              {currentStepIndex === 3 && <button type="button" onClick={completeGuidedStep} className="min-h-10 bg-slate-950 px-3 text-xs font-black text-white">COMPLETE MONITORING PERIOD</button>}
              {currentStepIndex === 4 && !eventResolved && <p className="max-w-xs border-l-4 border-sky-500 bg-sky-50 px-3 py-2 text-[10px] font-bold text-sky-950">Resolve the event in Events, then open the connected record.</p>}
              {currentStepIndex === 4 && eventResolved && <button type="button" onClick={() => setRecordOpen(true)} className="min-h-10 bg-blue-700 px-3 text-xs font-black text-white">OPEN CONNECTED RECORD</button>}
              {currentStepIndex > 0 && <><button type="button" onClick={() => seekStep(currentStepIndex - 1)} disabled={!hydrated} className="inline-flex min-h-10 items-center justify-center gap-1 border border-slate-300 px-3 text-xs font-bold text-slate-700"><ChevronLeftIcon className="size-4" />Previous</button><button type="button" onClick={resetDemo} disabled={!hydrated} className="grid size-10 shrink-0 place-items-center border border-slate-300 text-slate-600 disabled:text-slate-300" aria-label="Reset demonstration"><ArrowPathIcon className="size-4" /></button></>}
            </div>
          </section>
        </aside>

        <div className="relative isolate min-w-0 overflow-clip rounded-lg border border-slate-300 bg-white shadow-[0_28px_70px_-45px_rgba(15,23,42,0.45)]">
          <div className="relative grid gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3 text-white md:grid-cols-[auto_minmax(0,1fr)] md:items-center sm:px-5">
            <Image src="/assets/verifair_erne_tech_logo.webp" alt="VerifAir by ERNE Tech" width={204} height={68} className="h-auto w-20 sm:w-[5.5rem]" priority />
            <div className="text-left md:text-left">
              <strong className="text-xs font-black uppercase tracking-[0.12em] text-white">Particulate Monitoring &amp; Task Management</strong>
              <p className="mt-1 text-sm font-bold text-slate-200">Demonstration Healthcare Construction Project</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700 sm:px-5">
            <span className="font-black uppercase tracking-[0.14em] text-slate-500">Live operational view</span>
            <span className="font-mono font-bold text-slate-700">{clockNow ? formatAustralianTime(clockNow) : "--:--:-- AEST"}</span>
          </div>

          <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] sm:grid-cols-[3.75rem_minmax(0,1fr)]">
            <nav className="relative z-10 bg-slate-900 px-2 py-4 text-slate-300" aria-label="Control Centre sections">
              <div className="sticky top-24 flex flex-col items-center gap-2 lg:top-16">
              <button type="button" onClick={() => setActiveView("monitoring")} aria-label="Monitoring overview" title="Monitoring overview" aria-pressed={activeView === "monitoring"} className="grid size-10 place-items-center border-l-2 border-transparent transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 aria-pressed:border-sky-400 aria-pressed:bg-slate-800 aria-pressed:text-white"><Squares2X2Icon className="size-5" aria-hidden="true" /></button>
              <button type="button" onClick={() => setActiveView("trends")} aria-label="Trends" title="Trends" aria-pressed={activeView === "trends"} className="grid size-10 place-items-center border-l-2 border-transparent transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 aria-pressed:border-sky-400 aria-pressed:bg-slate-800 aria-pressed:text-white"><ChartBarIcon className="size-5" aria-hidden="true" /></button>
              <button type="button" onClick={() => setActiveView("reports")} aria-label="Reports" title="Reports" aria-pressed={activeView === "reports"} className="grid size-10 place-items-center border-l-2 border-transparent transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 aria-pressed:border-sky-400 aria-pressed:bg-slate-800 aria-pressed:text-white"><DocumentChartBarIcon className="size-5" aria-hidden="true" /></button>
              <button type="button" onClick={() => setActiveView("events")} aria-label="Incidents and alerts" title="Incidents and alerts" aria-pressed={activeView === "events"} className="relative grid size-10 place-items-center border-l-2 border-transparent transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 aria-pressed:border-red-400 aria-pressed:bg-slate-800 aria-pressed:text-white"><BellAlertIcon className="size-5" aria-hidden="true" />{snapshot.incidentState.opened && !snapshot.incidentState.closed && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-slate-900" aria-hidden="true" />}</button>
              <button type="button" onClick={() => setActiveView("health")} aria-label="System health" title="System health" aria-pressed={activeView === "health"} className="grid size-10 place-items-center border-l-2 border-transparent transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 aria-pressed:border-emerald-400 aria-pressed:bg-slate-800 aria-pressed:text-emerald-300"><HeartIcon className="size-5" aria-hidden="true" /></button>
              </div>
            </nav>
            <div className="min-w-0">
          <div aria-live="polite">{activeView === "monitoring" ? monitoringView : activeView === "trends" ? <TrendsView snapshot={snapshot} selectedId={selectedId} setSelectedId={setSelectedId} metricId={metricId} setMetricId={setMetricId} /> : activeView === "reports" ? <ControlCentreReports /> : activeView === "events" ? <ControlCentreEvents session={session} snapshot={snapshot} onWorkStarted={() => seekStep(2)} onResponseRecorded={() => seekStep(3)} /> : <SystemHealthView />}</div>
          {activeView === "monitoring" && <>
          <OperationalLegend />
          {ribbon && <div className={`border-y px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.08em] sm:px-5 ${eventResolved ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}>{ribbon}</div>}

          {recordOpen && eventResolved && <div className="border-b border-slate-300 bg-slate-50 px-4 py-4 sm:px-5"><RecordView snapshot={snapshot} /></div>}
          <div className="flex justify-end border-b border-slate-200 bg-white px-4 py-3 sm:px-5">{eventResolved && <button type="button" onClick={() => setRecordOpen((open) => !open)} className="min-h-10 bg-blue-700 px-3 text-xs font-black text-white">{recordOpen ? "CLOSE RECORD" : "OPEN RECORD"}</button>}</div>
          </>}
            </div>
          </div>
        </div>

        <p className="mt-4 border border-slate-200 bg-white px-4 py-3 text-[10px] leading-4 text-slate-500 sm:px-5"><strong>Fictional demonstration.</strong> Sites, locations, events, people and readings are simulated for product illustration. Recorded responses demonstrate the workflow; no causal link between an action and particulate levels is claimed or implied.</p>
      </div>
    </section>
  );
}
