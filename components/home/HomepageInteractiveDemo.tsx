"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { selectLatestObservation } from "@/lib/replay/selectors";
import { publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";
import { PARTICULATE_UNIT } from "@/lib/metrics";
import { classifyDemonstrationMetric } from "@/lib/demonstration/metric-status";
import { DemonstrationSession } from "@/lib/demonstration/session";
import type { VerifAirOperationalState } from "@/lib/product-model";

const INCIDENT_ID = "VA-INC-2026-0042";
const OPERATOR = "Site Supervisor";
const metrics = [
  { id: "RESPIRABLE_DUST", label: "RESPIRABLE DUST" },
  { id: "PM1", label: "PM1" },
  { id: "PM2_5", label: "PM2.5" },
  { id: "PM10", label: "PM10" },
] as const;
type MetricId = (typeof metrics)[number]["id"];
type Stage = "ASSESS" | "ACT" | "RECORD";

const locationMeta = [
  ["WORK_ZONE_A", "Work Zone A", "Work area"],
  ["OCCUPIED_INTERFACE", "Boundary", "Boundary / interface"],
  ["SHARED_CORRIDOR", "Corridor", "Transition area"],
  ["EXTERNAL_BOUNDARY", "Occupied Area", "Occupied environment"],
] as const;

const stateStyles: Record<VerifAirOperationalState, string> = {
  ACTION: "border-red-300 bg-red-50 text-red-950",
  ATTENTION: "border-amber-300 bg-amber-50 text-amber-950",
  NORMAL: "border-emerald-300 bg-emerald-50 text-emerald-950",
};

const stateHeaderStyles: Record<VerifAirOperationalState, string> = {
  ACTION: "bg-red-700 text-white",
  ATTENTION: "bg-amber-400 text-slate-950",
  NORMAL: "bg-emerald-700 text-white",
};

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

function MonitoringTile({
  snapshot,
  monitorId,
  selected,
  onSelect,
  wallboard,
}: {
  snapshot: ReturnType<DemonstrationSession["getSnapshot"]>;
  monitorId: string;
  selected: boolean;
  onSelect: () => void;
  wallboard: boolean;
}) {
  const meta = locationMeta.find(([id]) => id === monitorId) ?? locationMeta[0];
  const state = stateFor(snapshot, monitorId);
  const tileClass = wallboard ? stateHeaderStyles[state] : stateStyles[state];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-testid={`homepage-monitoring-location-${monitorId}`}
      className={`flex min-h-[13rem] min-w-0 flex-col border text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${tileClass} ${selected ? "ring-4 ring-blue-500 ring-offset-2" : ""}`}
    >
      <span className={`flex items-center justify-between px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${wallboard ? "bg-black/20" : stateHeaderStyles[state]}`}>
        <span>{state}</span>
        <span aria-hidden="true">{state === "NORMAL" ? "✓" : "!"}</span>
      </span>
      <span className="flex flex-1 flex-col p-3">
        <span className={`text-[9px] font-black uppercase tracking-[0.12em] ${wallboard ? "text-white/75" : "text-slate-500"}`}>SITE · Demonstration Project</span>
        <span className={`mt-1 text-[9px] font-bold uppercase tracking-[0.1em] ${wallboard ? "text-white/75" : "text-slate-500"}`}>ZONE · {meta[2]}</span>
        <span className={`mt-1 line-clamp-1 min-h-5 text-sm font-black uppercase ${wallboard ? "text-white" : "text-slate-950"}`}>{meta[1]}</span>
        <span className="mt-2 border border-blue-200 bg-blue-50 p-2 text-slate-950">
          <span className="block text-[9px] font-black uppercase text-blue-800">Respirable Dust</span>
          <span className="mt-1 block text-2xl font-black">{currentValue(snapshot, monitorId, "RESPIRABLE_DUST")} <span className="text-[10px]">{PARTICULATE_UNIT}</span></span>
        </span>
        <span className="mt-2 grid grid-cols-3 gap-1 text-center text-slate-950">
          {(["PM1", "PM2_5", "PM10"] as const).map((metric) => (
            <span key={metric} className="border border-slate-200 bg-white/80 p-1">
              <span className="block text-[8px] font-black text-slate-500">{metric === "PM2_5" ? "PM2.5" : metric}</span>
              <span className="mt-1 block text-sm font-black">{currentValue(snapshot, monitorId, metric)}</span>
            </span>
          ))}
        </span>
        <span className={`mt-auto pt-2 text-[9px] font-bold ${wallboard ? "text-white/75" : "text-slate-600"}`}>LAST SENSOR READING · {formatTime(snapshot.replayState.offsetMs)}</span>
      </span>
    </button>
  );
}

function Trend({ snapshot, monitorId, metricId, onChange }: { snapshot: ReturnType<DemonstrationSession["getSnapshot"]>; monitorId: string; metricId: MetricId; onChange: (metric: MetricId) => void }) {
  const points = publicDemonstrationScenario.observations
    .filter((observation) => observation.monitorId === monitorId && observation.metricId === metricId && observation.offsetMs <= snapshot.replayState.offsetMs)
    .slice(-6);
  const values = points.map((point) => (point.reading.status === "available" ? point.reading.value : 0));
  const latest = currentValue(snapshot, monitorId, metricId);
  const threshold = metricId === "RESPIRABLE_DUST" ? { attention: 25, action: 50 } : metricId === "PM1" ? { attention: 8, action: 20 } : metricId === "PM2_5" ? { attention: 15, action: 25 } : { attention: 30, action: 50 };
  const max = Math.max(latest, threshold.action, ...values, 1);
  const x = (index: number) => 38 + (index / Math.max(values.length - 1, 1)) * 560;
  const y = (value: number) => 184 - (value / max) * 150;
  const path = values.length > 1 ? values.map((value, index) => `${index ? "L" : "M"}${x(index)} ${y(value)}`).join(" ") : `M38 ${y(latest)} L598 ${y(latest)}`;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">LIVE DAILY TREND</p>
          <p className="mt-1 text-sm font-bold text-slate-900">TODAY · {metrics.find((metric) => metric.id === metricId)?.label}</p>
        </div>
        <MetricSelector selected={metricId} onChange={onChange} />
      </div>
      <div className="mt-3 overflow-hidden border border-slate-200 bg-slate-50">
        <svg className="h-48 w-full" viewBox="0 0 640 220" role="img" aria-label={`${metricId} live daily trend with latest reading ${latest} ${PARTICULATE_UNIT}`}>
          {[35, 85, 135, 185].map((line) => <line key={line} x1="38" y1={line} x2="598" y2={line} stroke="#e2e8f0" />)}
          <line x1="38" y1={y(threshold.attention)} x2="598" y2={y(threshold.attention)} stroke="#d97706" strokeDasharray="6 4" />
          <line x1="38" y1={y(threshold.action)} x2="598" y2={y(threshold.action)} stroke="#dc2626" strokeDasharray="6 4" />
          <text x="4" y="39" fontSize="10" fill="#64748b">{max} {PARTICULATE_UNIT}</text>
          <text x="4" y="187" fontSize="10" fill="#64748b">0</text>
          <text x="42" y="207" fontSize="10" fill="#64748b">Earlier</text>
          <text x="560" y="207" fontSize="10" fill="#64748b">Now</text>
          <path d={path} fill="none" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={values.length > 1 ? x(values.length - 1) : 598} cy={y(latest)} r="6" fill="#0369a1" stroke="white" strokeWidth="2"><title>{`Latest reading: ${latest} ${PARTICULATE_UNIT}`}</title></circle>
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
        <span>Attention {threshold.attention} · Action {threshold.action} · Latest {latest} {PARTICULATE_UNIT}</span>
        <Link href="/monitoring" className="font-black text-blue-700 hover:underline">VIEW HISTORICAL TRENDS →</Link>
      </div>
    </div>
  );
}

function AssessView({ snapshot, selectedId, setSelectedId, wallboard, setWallboard, metricId, setMetricId }: {
  snapshot: ReturnType<DemonstrationSession["getSnapshot"]>;
  selectedId: string;
  setSelectedId: (id: string) => void;
  wallboard: boolean;
  setWallboard: (value: boolean) => void;
  metricId: MetricId;
  setMetricId: (value: MetricId) => void;
}) {
  const selectedMeta = locationMeta.find(([id]) => id === selectedId) ?? locationMeta[0];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">ASSESS · SHARED PROJECT DASHBOARD</p><h2 className="mt-1 text-xl font-black text-slate-950">Demonstration Healthcare Refurbishment</h2></div>
        <div className="inline-flex border border-slate-300 bg-white p-1" role="group" aria-label="Monitoring view">
          {(["PROJECT", "PORTFOLIO"] as const).map((view) => <button key={view} type="button" aria-pressed={view === "PROJECT"} className={`min-h-9 px-3 text-[10px] font-black ${view === "PROJECT" ? "bg-blue-700 text-white" : "text-slate-400"}`} disabled={view === "PORTFOLIO"}>{view}</button>)}
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-2 ${wallboard ? "lg:grid-cols-2" : "lg:grid-cols-4"}`}>
        {locationMeta.map(([id]) => <MonitoringTile key={id} snapshot={snapshot} monitorId={id} selected={id === selectedId} onSelect={() => setSelectedId(id)} wallboard={wallboard} />)}
      </div>
      <div className="border border-slate-300 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">MONITORING LOCATION · {selectedMeta[1]}</p><span className={`border px-2 py-1 text-[10px] font-black uppercase ${stateStyles[stateFor(snapshot, selectedId)]}`}>{stateFor(snapshot, selectedId)}</span></div>
        <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-[10px] font-black uppercase text-slate-500">Respirable Dust</p><p className="mt-1 text-4xl font-black">{currentValue(snapshot, selectedId, "RESPIRABLE_DUST")} <span className="text-sm">{PARTICULATE_UNIT}</span></p><p className="mt-3 text-xs font-bold text-slate-600">PM1 {currentValue(snapshot, selectedId, "PM1")} · PM2.5 {currentValue(snapshot, selectedId, "PM2_5")} · PM10 {currentValue(snapshot, selectedId, "PM10")}</p><p className="mt-2 text-xs font-bold text-slate-500">LAST SENSOR READING · {formatTime(snapshot.replayState.offsetMs)}</p></div><Trend snapshot={snapshot} monitorId={selectedId} metricId={metricId} onChange={setMetricId} /></div>
        <div className="mt-3"><MetricSelector selected={metricId} onChange={setMetricId} /></div>
      </div>
      <button type="button" onClick={() => setWallboard(!wallboard)} className="min-h-10 border border-slate-300 px-4 text-xs font-black text-slate-700">{wallboard ? "CONTROL CENTRE" : "WALLBOARD"}</button>
    </div>
  );
}

function ActView({ session, snapshot }: { session: DemonstrationSession; snapshot: ReturnType<DemonstrationSession["getSnapshot"]> }) {
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
  return <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]"><div className="border border-red-300 bg-red-50 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-red-800">ACT · EVENT WORKFLOW</p><h2 className="mt-2 text-2xl font-black text-slate-950">ACTION CONDITION DETECTED</h2><p className="mt-3 text-sm font-bold text-slate-700">Work Zone A · Respirable Dust</p><p className="mt-1 text-4xl font-black text-slate-950">{actionValue} <span className="text-sm">{PARTICULATE_UNIT}</span></p><p className="mt-2 text-xs font-bold text-red-800">CONFIGURED PROJECT ACTION LEVEL REACHED · {formatTime(120_000)}</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => dispatch("ACKNOWLEDGED")} disabled={incident.acknowledged} className="min-h-10 bg-red-700 px-3 text-xs font-black text-white disabled:bg-slate-300">ACKNOWLEDGE</button><button type="button" onClick={() => dispatch("ASSIGNED")} disabled={!incident.acknowledged || Boolean(incident.assignedTo)} className="min-h-10 border border-red-700 px-3 text-xs font-black text-red-800 disabled:border-slate-300 disabled:text-slate-400">ASSIGN</button><button type="button" onClick={() => dispatch("RESPONSE_RECORDED")} disabled={!incident.assignedTo} className="min-h-10 border border-slate-300 px-3 text-xs font-black disabled:text-slate-400">ADD ACTION</button><button type="button" onClick={() => dispatch("RESPONSE_NOTE_ADDED")} disabled={!incident.assignedTo} className="min-h-10 border border-slate-300 px-3 text-xs font-black disabled:text-slate-400">ADD COMMENT</button></div></div><div className="border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">EVENT {INCIDENT_ID}</p><div className="mt-3 space-y-2">{steps.map(([label, complete]) => <div key={label} className={`flex items-center gap-3 border-l-4 px-3 py-2 text-sm font-black ${complete ? "border-emerald-500 bg-emerald-50 text-slate-950" : "border-slate-200 text-slate-400"}`}><span aria-hidden="true">{complete ? "✓" : "○"}</span>{label}</div>)}</div></div></div>;
}

function RecordView({ snapshot }: { snapshot: ReturnType<DemonstrationSession["getSnapshot"]> }) {
  const resolved = snapshot.replayState.offsetMs >= 480_000;
  return <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]"><div className="border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">RECORD · CONNECTED OPERATIONAL RECORD</p><h2 className="mt-2 text-2xl font-black">{INCIDENT_ID}</h2><span className={`mt-3 inline-flex border px-3 py-1 text-xs font-black uppercase ${resolved ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-amber-300 bg-amber-50 text-amber-900"}`}>{resolved ? "RESOLVED" : "IN PROGRESS"}</span><p className="mt-4 text-sm font-bold">WORK ZONE A · Particulate Event</p><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><span className="border bg-white p-2 font-bold">READINGS<br /><span className="font-normal">Same scenario measurements</span></span><span className="border bg-white p-2 font-bold">RESPONSE<br /><span className="font-normal">Same event actions</span></span><span className="border bg-white p-2 font-bold">COMMENTS<br /><span className="font-normal">Connected notes</span></span><span className="border bg-white p-2 font-bold">EVIDENCE<br /><span className="font-normal">Reviewable record</span></span></div><div className="mt-4 flex flex-wrap gap-2"><Link href="/reporting" className="cta-primary inline-flex min-h-10 items-center px-3 text-xs font-black">VIEW EVENT RECORD</Link><Link href="/reporting" className="inline-flex min-h-10 items-center border border-slate-300 px-3 text-xs font-black">VIEW GENERATED REPORT</Link></div></div><div className="border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">TIMELINE · {INCIDENT_ID}</p><div className="mt-3 space-y-2">{timelineRows.map(([offset, label]) => <div key={`${offset}-${label}`} className={`flex gap-3 border-l-2 py-1 pl-3 text-sm ${snapshot.replayState.offsetMs >= offset ? "border-blue-600 text-slate-950" : "border-slate-200 text-slate-400"}`}><span className="w-12 shrink-0 font-mono text-xs">{formatTime(offset)}</span><span>{label}</span></div>)}</div></div></div>;
}

export function HomepageInteractiveDemo() {
  const { session, snapshot } = useHomepageSession();
  const [stage, setStage] = useState<Stage>("ASSESS");
  const [selectedId, setSelectedId] = useState("WORK_ZONE_A");
  const [wallboard, setWallboard] = useState(false);
  const [metricId, setMetricId] = useState<MetricId>("RESPIRABLE_DUST");
  const [replaying, setReplaying] = useState(false);

  useEffect(() => {
    if (!replaying) return;
    let offset = session.currentOffsetMs;
    const timer = window.setInterval(() => {
      offset = Math.min(offset + 40_000, 480_000);
      session.seek(offset);
      if (offset >= 480_000) {
        window.clearInterval(timer);
        setReplaying(false);
      }
    }, 1_100);
    return () => window.clearInterval(timer);
  }, [replaying, session]);

  const eventActive = snapshot.replayState.offsetMs >= 120_000 && snapshot.replayState.offsetMs < 480_000;
  const eventResolved = snapshot.replayState.offsetMs >= 480_000;
  const ribbon = eventResolved ? `✓ RESOLVED · ${INCIDENT_ID} · Operational record complete` : eventActive ? `● ACTION · Work Zone A · Respirable Dust ${currentValue(snapshot, "WORK_ZONE_A", "RESPIRABLE_DUST")} ${PARTICULATE_UNIT} · ${INCIDENT_ID}` : `MONITORING · Demonstration Healthcare Refurbishment · ${formatTime(snapshot.replayState.offsetMs)}`;

  const activeView = useMemo(() => {
    if (stage === "ACT") return <ActView session={session} snapshot={snapshot} />;
    if (stage === "RECORD") return <RecordView snapshot={snapshot} />;
    return <AssessView snapshot={snapshot} selectedId={selectedId} setSelectedId={setSelectedId} wallboard={wallboard} setWallboard={setWallboard} metricId={metricId} setMetricId={setMetricId} />;
  }, [metricId, selectedId, session, snapshot, stage, wallboard]);

  return (
    <section id="monitoring" className="border-b border-slate-200 bg-slate-100 px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">SEE VERIFAIR IN ACTION.</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">One connected operational view from particulate readings through response and record.</h2>
          <p className="mt-3 text-lg font-black tracking-[0.12em] text-blue-700">ASSESS → ACT → RECORD</p>
        </header>
        <div className="border-4 border-slate-950 bg-slate-950 p-1 shadow-[0_24px_60px_rgba(15,23,42,0.22)] sm:border-8 sm:p-2">
          <div className="overflow-hidden bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-4 text-white sm:px-6"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-300">DEMONSTRATION PROJECT</p><p className="mt-1 text-lg font-black">Healthcare Refurbishment</p></div><button type="button" onClick={() => { setReplaying(true); session.restart(); setStage("ASSESS"); }} className="min-h-10 border border-white/50 px-4 text-xs font-black uppercase tracking-[0.08em] hover:bg-white/10">{replaying ? "REPLAYING" : "REPLAY EVENT"}</button></div>
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 p-2 sm:p-3" role="tablist" aria-label="Demonstration stage"><button type="button" role="tab" aria-selected={stage === "ASSESS"} onClick={() => setStage("ASSESS")} className={`min-h-11 border px-2 text-xs font-black ${stage === "ASSESS" ? "border-blue-700 bg-blue-700 text-white" : "border-transparent text-slate-500"}`}>01 ASSESS</button><button type="button" role="tab" aria-selected={stage === "ACT"} onClick={() => setStage("ACT")} className={`min-h-11 border px-2 text-xs font-black ${stage === "ACT" ? "border-blue-700 bg-blue-700 text-white" : "border-transparent text-slate-500"}`}>02 ACT</button><button type="button" role="tab" aria-selected={stage === "RECORD"} onClick={() => setStage("RECORD")} className={`min-h-11 border px-2 text-xs font-black ${stage === "RECORD" ? "border-blue-700 bg-blue-700 text-white" : "border-transparent text-slate-500"}`}>03 RECORD</button></div>
            <div className="p-3 sm:p-5">{activeView}</div>
            <div className={`border-y px-4 py-3 text-xs font-black uppercase tracking-[0.06em] ${eventResolved ? "border-emerald-200 bg-emerald-50 text-emerald-900" : eventActive ? "border-red-200 bg-red-50 text-red-900" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{ribbon}</div>
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 text-xs"><strong className="flex items-center gap-2 uppercase tracking-[0.08em] text-slate-950"><span className="size-2.5 rounded-full bg-emerald-500" aria-hidden="true" />SYSTEM HEALTH · HEALTHY</strong><span className="font-semibold text-slate-600">4/4 monitoring locations reporting</span></div>
            <p className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">Demonstration only. Sites, events, people and readings shown are fictional and are used to demonstrate VerifAir functionality.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
