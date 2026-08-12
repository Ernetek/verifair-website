"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";

import { ReplayControls } from "@/components/demonstration/ReplayControls";
import {
  DEMONSTRATION_METRICS,
  publicDemonstrationScenario,
} from "@/lib/replay/demonstration-scenario";
import { evaluateAt } from "@/lib/replay/engine";
import { ReplayPlaybackController } from "@/lib/replay/playback-controller";
import {
  selectLatestObservation,
  selectObservationHistory,
} from "@/lib/replay/selectors";

const chartColours: Record<string, string> = {
  PM1: "#0284c7",
  PM2_5: "#059669",
  RESPIRABLE_DUST: "#d97706",
  PM10: "#7c3aed",
};

function formatOffset(offsetMs: number): string {
  const seconds = Math.floor(offsetMs / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function observationValue(
  state: ReturnType<ReplayPlaybackController["getSnapshot"]>["state"],
  monitorId: string,
  metricId: string,
): string {
  const observation = selectLatestObservation(state, monitorId, metricId);
  return observation?.reading.status === "available"
    ? String(observation.reading.value)
    : "—";
}

function MetricChart({
  controller,
  monitorId,
  metricId,
  label,
}: {
  readonly controller: ReplayPlaybackController;
  readonly monitorId: string;
  readonly metricId: string;
  readonly label: string;
}) {
  const { state } = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  const history = selectObservationHistory(
    publicDemonstrationScenario,
    state,
    monitorId,
    metricId,
  );
  const available = history.filter(
    (item) => item.reading.status === "available",
  );
  const maximum = Math.max(
    1,
    ...available.map((item) =>
      item.reading.status === "available" ? item.reading.value : 0,
    ),
  );
  const points = available
    .map((item) => {
      const x = 10 + (item.offsetMs / controller.durationMs) * 280;
      const value = item.reading.status === "available" ? item.reading.value : 0;
      const y = 90 - (value / maximum) * 70;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-black text-slate-900">{label}</h3>
        <p className="text-sm text-slate-600">
          {observationValue(state, monitorId, metricId)} µg/m³
        </p>
      </div>
      <svg
        viewBox="0 0 300 100"
        className="mt-2 h-24 w-full"
        role="img"
        aria-label={`${label} simulated observation history for the selected location`}
      >
        <line x1="10" x2="290" y1="90" y2="90" stroke="#cbd5e1" />
        {points ? (
          <polyline
            points={points}
            fill="none"
            stroke={chartColours[metricId]}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
    </div>
  );
}

export function ProductDemonstration() {
  const [hydrated, setHydrated] = useState(false);
  const [controller] = useState(
    () => new ReplayPlaybackController(publicDemonstrationScenario),
  );
  const [monitorId, setMonitorId] = useState(
    publicDemonstrationScenario.monitors[0].id,
  );
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  const monitor = publicDemonstrationScenario.monitors.find(
    ({ id }) => id === monitorId,
  );
  const visibleHistory = useMemo(
    () =>
      DEMONSTRATION_METRICS.map((metric) => ({
        ...metric,
        history: selectObservationHistory(
          publicDemonstrationScenario,
          snapshot.state,
          monitorId,
          metric.id,
        ),
      })),
    [monitorId, snapshot.state],
  );

  useEffect(() => {
    setHydrated(true);
    return () => controller.dispose();
  }, [controller]);

  return (
    <div
      data-testid="product-demonstration"
      data-hydrated={hydrated}
      className="overflow-hidden border border-slate-300 bg-white shadow-xl"
    >
      <header className="bg-slate-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
          Interactive product demonstration
        </p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">
              See a complete monitoring response unfold
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Replay simulated observations, review the incident record and see
              how readings, actions and evidence stay aligned in one timeline.
            </p>
          </div>
          <span className="border border-sky-400 bg-sky-950 px-3 py-2 text-xs font-black uppercase tracking-wide text-sky-200">
            Simulated demonstration data
          </span>
        </div>
      </header>

      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
        <div>
          <ReplayControls controller={controller} />

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-blue-700">
                Monitoring location
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {monitor?.name}
              </h2>
            </div>
            <label className="text-sm font-bold text-slate-800">
              Select location
              <select
                className="ml-3 min-h-11 border border-slate-300 bg-white px-3"
                value={monitorId}
                onChange={(event) => setMonitorId(event.currentTarget.value)}
              >
                {publicDemonstrationScenario.monitors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DEMONSTRATION_METRICS.map((metric) => (
              <MetricChart
                key={metric.id}
                controller={controller}
                monitorId={monitorId}
                metricId={metric.id}
                label={metric.label}
              />
            ))}
          </div>

          <details className="mt-4 border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-black text-slate-900">
              View accessible reading history
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-full table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="px-2 py-2">Metric</th>
                    <th className="px-2 py-2">Elapsed</th>
                    <th className="px-2 py-2">Reading</th>
                    <th className="px-2 py-2">Data status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleHistory.flatMap((metric) =>
                    metric.history.map((observation) => (
                      <tr key={observation.id} className="border-b border-slate-100">
                        <th className="px-2 py-2">{metric.label}</th>
                        <td className="px-2 py-2">{formatOffset(observation.offsetMs)}</td>
                        <td className="px-2 py-2">
                          {observation.reading.status === "available"
                            ? `${observation.reading.value} ${observation.unit}`
                            : "Unavailable"}
                        </td>
                        <td className="px-2 py-2">Simulated</td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </details>
        </div>

        <aside aria-label="Incident and evidence timeline" className="border border-slate-300 bg-slate-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">
            Coordinated record
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Incident timeline
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The timeline shows sequence only. It does not determine compliance,
            attribute a source or claim that an action caused later readings.
          </p>

          <ol className="mt-6 space-y-4">
            {snapshot.state.timelineEvents.map((event) => (
              <li key={event.id} className="border-l-4 border-blue-600 bg-white p-4">
                <p className="text-xs font-black text-blue-700">
                  {formatOffset(event.offsetMs)}
                </p>
                <p className="mt-1 font-bold text-slate-950">{event.title}</p>
                {event.description ? (
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    {event.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>

          {snapshot.state.incidents.length === 0 ? (
            <p className="mt-6 border border-slate-200 bg-white p-4 text-sm text-slate-700">
              No incident is open at this replay position.
            </p>
          ) : (
            <div className="mt-6 border border-slate-300 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                Current incident state
              </p>
              <p className="mt-2 font-black text-slate-950">
                {snapshot.state.incidents[0].status === "resolved"
                  ? "Closed after review"
                  : "Review in progress"}
              </p>
            </div>
          )}
        </aside>
      </div>

      <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600 sm:px-8">
        PM1, PM2.5, respirable dust and PM10 reflect the verified Dustlight
        payload fields. Respirable dust is not labelled PM4.0. All displayed
        values are frozen simulated records, not workplace or compliance
        measurements.
      </footer>
    </div>
  );
}

export function ProductDemonstrationPreview() {
  const initial = evaluateAt(publicDemonstrationScenario, 0);
  if (!initial.ok) return null;
  const state = initial.state;
  const monitor = state.monitorStates.find(
    ({ monitor: item }) => item.id === "WORK_ZONE_A",
  );

  return (
    <div className="overflow-hidden border border-slate-300 bg-white shadow-lg">
      <div className="flex items-center justify-between gap-4 bg-slate-950 px-5 py-4 text-white">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-sky-300">
            Simulated product demonstration
          </p>
          <h3 className="mt-1 text-lg font-black">Work Zone A</h3>
        </div>
        <span className="text-xs font-bold text-slate-300">Start position</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-slate-200">
        {DEMONSTRATION_METRICS.map((metric) => {
          const observation = monitor?.latestObservations.find(
            ({ metricId }) => metricId === metric.id,
          );
          return (
            <div key={metric.id} className="bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {observation?.reading.status === "available"
                  ? observation.reading.value
                  : "—"}{" "}
                <span className="text-xs font-bold text-slate-500">µg/m³</span>
              </p>
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <p className="text-sm leading-5 text-slate-600">
          Includes PM1, PM2.5, respirable dust and PM10. No compliance or source
          determination is made.
        </p>
        <Link
          href="/demonstration/monitoring-room"
          className="mt-3 inline-flex min-h-11 items-center font-black text-blue-700 hover:underline"
        >
          Open interactive demonstration →
        </Link>
      </div>
    </div>
  );
}
