"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { PARTICULATE_UNIT } from "@/lib/metrics";
import {
  DEMO_DISCLOSURE,
  DEMO_DISCLOSURE_WITH_CONTEXT,
} from "@/lib/product-model";
import {
  classifyDemonstrationMetric,
  type DemonstrationMetricId,
} from "@/lib/demonstration/metric-status";
import { publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";
import { selectLatestObservation } from "@/lib/replay/selectors";
import {
  DemonstrationSession,
  getSharedDemonstrationSession,
} from "@/lib/demonstration/session";
import { ReplayControls } from "@/components/demonstration/ReplayControls";
import { CANONICAL_WORKFLOW_PHASES } from "@/components/demonstration/ProductDemonstration";

function observationValue(
  state: ReturnType<DemonstrationSession["getSnapshot"]>["replayState"],
  monitorId: string,
  metricId: string,
): number | null {
  const obs = selectLatestObservation(state, monitorId, metricId);
  return obs?.reading.status === "available" ? obs.reading.value : null;
}

export function SharedDashboard({
  session: sessionProp,
}: {
  readonly session?: DemonstrationSession;
}) {
  const session = sessionProp ?? getSharedDemonstrationSession();
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );
  const { replayState, incidentState } = snapshot;

  const monitors = publicDemonstrationScenario.monitors;
  const [selectedMonitorId, setSelectedMonitorId] = useState(monitors[0].id);

  const selectedMonitor =
    monitors.find((m) => m.id === selectedMonitorId) ?? monitors[0];

  const selectedPm25 = observationValue(replayState, selectedMonitor.id, "PM2_5") ?? 0;
  const selectedPm1 = observationValue(replayState, selectedMonitor.id, "PM1") ?? 0;
  const selectedPm10 = observationValue(replayState, selectedMonitor.id, "PM10") ?? 0;

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-700">
              Shared Operational Dashboard
            </p>
            <h2 className="text-3xl font-black text-slate-950">
              Multi-Zone Environmental Status
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Canonical replay timestamp: {new Date(replayState.timestamp).toUTCString()}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">
              Phase: {incidentState.phase}
            </span>
            <span className="rounded bg-slate-900 px-3 py-1 text-xs font-bold text-white">
              Status: {incidentState.progressStatus}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {monitors.map((m) => {
          const isSelected = m.id === selectedMonitorId;
          const pm25 = observationValue(replayState, m.id, "PM2_5") ?? 0;
          const status = classifyDemonstrationMetric("PM2_5", pm25);
          const statusTone = status.lightClassName;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMonitorId(m.id)}
              className={`min-h-11 border-l-4 p-4 text-left shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${statusTone} ${
                isSelected ? "ring-2 ring-blue-600" : ""
              }`}
            >
              <p className="text-xs font-black uppercase tracking-wide opacity-75">
                {m.name}
              </p>
              <h3 className="mt-1 text-base font-black">{m.name}</h3>
              <p className="mt-2 text-2xl font-black">
                {pm25} <span className="text-xs font-bold">{PARTICULATE_UNIT}</span>
              </p>
              <p className="mt-1 text-xs font-black uppercase">{status.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border border-slate-300 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                {selectedMonitor.name} — Current Readings
              </h3>
              <p className="text-xs text-slate-500">
                {selectedMonitor.name}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600">
              {DEMO_DISCLOSURE}
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-500">PM1</p>
              <p className="mt-2 text-3xl font-black text-blue-700">{selectedPm1} µg/m³</p>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-500">PM2.5</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{selectedPm25} µg/m³</p>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-500">PM10</p>
              <p className="mt-2 text-3xl font-black text-purple-700">{selectedPm10} µg/m³</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-black uppercase text-slate-500">
              Canonical Response Progress
            </h4>
            <ol className="mt-3 grid gap-2 sm:grid-cols-3">
              {CANONICAL_WORKFLOW_PHASES.map((p: (typeof CANONICAL_WORKFLOW_PHASES)[number], idx: number) => {
                const isActive = incidentState.phase === p && !incidentState.closed;
                const isPast =
                  incidentState.closed ||
                  CANONICAL_WORKFLOW_PHASES.indexOf(incidentState.phase) > idx;
                return (
                  <li
                    key={p}
                    className={`border p-2 text-xs font-bold ${
                      isActive
                        ? "border-blue-700 bg-blue-700 text-white"
                        : isPast
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                        : "border-slate-300 bg-white text-slate-400"
                    }`}
                  >
                    {idx + 1}. {p}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="border border-slate-300 bg-white p-5">
          <h3 className="text-lg font-black text-slate-950">Incident Timeline</h3>
          <p className="text-xs text-slate-500">Incident INC-0042</p>

          <ol className="mt-4 space-y-3">
            {incidentState.events.length === 0 ? (
              <li className="text-xs text-slate-500">No events recorded at current offset.</li>
            ) : (
              incidentState.events.map((ev, i) => (
                <li key={`${ev.type}-${i}`} className="border-l-2 border-blue-600 pl-3 text-xs">
                  <p className="font-bold text-slate-900">{ev.type}</p>
                  <p className="text-slate-500">Offset: {Math.floor(ev.timestampMs / 1000)}s</p>
                </li>
              ))
            )}
          </ol>
        </div>
      </div>

      <ReplayControls session={session} />
    </div>
  );
}

export function MonitoringRoomDisplay({ session: sessionProp }: { readonly session?: DemonstrationSession }) {
  const session = sessionProp ?? getSharedDemonstrationSession();
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
  const { replayState, incidentState } = snapshot;

  return (
    <div className="bg-slate-950 p-3 text-white shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3 sm:items-center sm:gap-4 sm:pb-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-sky-400 sm:text-xs sm:tracking-widest">Centralised Site-wide Monitoring Hub</p>
          <h2 className="text-xl font-black sm:text-3xl">Live Environmental Status</h2>
        </div>
        <div className="shrink-0 text-right">
          <span className="block text-[10px] font-bold text-emerald-400 sm:text-xs">● LIVE MONITORING</span>
        </div>
      </div>
      <p className="mt-3 text-[10px] leading-4 text-slate-300 sm:text-xs">{DEMO_DISCLOSURE} {DEMO_DISCLOSURE_WITH_CONTEXT}</p>
      <div data-testid="monitoring-room-sensor-grid" className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 lg:grid-cols-4">
        {publicDemonstrationScenario.monitors.map((monitor) => {
          const metrics: readonly [DemonstrationMetricId, string, number][] = [
            ["PM2_5", "PM2.5", observationValue(replayState, monitor.id, "PM2_5") ?? 0],
            ["PM1", "PM1", observationValue(replayState, monitor.id, "PM1") ?? 0],
            ["RESPIRABLE_DUST", "Respirable dust", observationValue(replayState, monitor.id, "RESPIRABLE_DUST") ?? 0],
            ["PM10", "PM10", observationValue(replayState, monitor.id, "PM10") ?? 0],
          ];
          return <article key={monitor.id} className="min-w-0 border border-slate-700 bg-slate-900 p-2 shadow sm:p-4">
            <h3 className="min-h-8 break-words text-xs font-black leading-4 sm:text-lg sm:leading-6">{monitor.name}</h3>
            <div className="mt-2 grid grid-cols-2 gap-1.5 sm:gap-2">
              {metrics.map(([id, label, value], index) => {
                const status = classifyDemonstrationMetric(id, value);
                return <div key={id} className={`${status.panelClassName} min-w-0 p-2 ${index === 0 ? "col-span-2" : ""}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1"><span className="text-[10px] font-black uppercase sm:text-xs">{label}</span><strong className="text-[9px] sm:text-[10px]">{status.label}</strong></div>
                  <p className={`${index === 0 ? "text-2xl sm:text-4xl" : "text-base sm:text-xl"} font-black leading-tight`}>{value} <span className="text-[9px] font-bold sm:text-xs">{PARTICULATE_UNIT}</span></p>
                </div>;
              })}
            </div>
          </article>;
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3 text-xs text-slate-400 sm:mt-6 sm:pt-4">
        <span>Current Phase: <strong className="text-sky-300">{incidentState.phase}</strong></span>
        <span>Progress: <strong className="text-white">{incidentState.progressStatus}</strong></span>
      </div>
    </div>
  );
}

export function MonitoringRoomHeroPreview({
  session: sessionProp,
}: {
  readonly session?: DemonstrationSession;
}) {
  const session = sessionProp ?? getSharedDemonstrationSession();
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );
  const { replayState, incidentState } = snapshot;
  const monitors = publicDemonstrationScenario.monitors;
  
  return (
    <div className="border border-slate-800 bg-slate-950 p-4 text-white rounded">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
        <span className="font-bold text-sky-400 uppercase tracking-wider">
          Monitoring Room Preview
        </span>
        <span className="text-slate-400 font-mono">
          {new Date(replayState.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {monitors.slice(0, 4).map((m) => {
          const pm25 = observationValue(replayState, m.id, "PM2_5") ?? 0;
          const status = classifyDemonstrationMetric("PM2_5", pm25);
          return (
            <div
              key={m.id}
              className={`border p-2 ${status.panelClassName}`}
            >
              <p className="break-words font-bold">{m.name}</p>
              <p className="text-lg font-black">{pm25} {PARTICULATE_UNIT}</p>
              <p className="text-[10px] font-black uppercase">{status.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>Workflow: {incidentState.phase}</span>
        <Link href="/demonstration/monitoring-room" className="text-sky-400 hover:underline">
          Full Display →
        </Link>
      </div>
    </div>
  );
}

export function SharedDashboardPreview() {
  return <SharedDashboard />;
}



// Compatibility exports retained for existing routes/home sections.
export const MonitoringRoomDisplayPage = MonitoringRoomDisplay;
export const SharedDashboardPage = SharedDashboard;
export const MonitoringRoomPreview = MonitoringRoomHeroPreview;


export function DashboardDemonstrationSection() {
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
            The shared dashboard supports review of simulated readings,
            trends and incident records. The monitoring-room display keeps
            configured zone status visible in a large-format operational view.
          </p>
        </div>

        <div className="mt-8 grid gap-8">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-blue-700">
              Shared dashboard
            </p>

            <SharedDashboard />
          </div>

          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-blue-700">
              Monitoring room
            </p>

            <MonitoringRoomDisplay />
          </div>
        </div>
      </div>
    </section>
  );
}
