"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

import {
  selectLatestObservation,
} from "@/lib/replay/selectors";
import {
  DemonstrationSession,
  getSharedDemonstrationSession,
  MEANINGFUL_SCENARIO_MARKERS,
} from "@/lib/demonstration/session";
import { DEMONSTRATION_METRICS } from "@/lib/replay/demonstration-scenario";
import type { WorkflowPhase } from "@/lib/demonstration/incident-domain";
import { ReplayControls } from "@/components/demonstration/ReplayControls";
import {
  DEMO_DISCLOSURE,
  DEMO_DISCLOSURE_WITH_CONTEXT,
} from "@/lib/product-model";

export const CANONICAL_WORKFLOW_PHASES: readonly WorkflowPhase[] = [
  "Alert",
  "Acknowledge",
  "Assign",
  "Investigate",
  "Verify",
  "Close",
];

function observationValue(
  state: ReturnType<DemonstrationSession["getSnapshot"]>["replayState"],
  monitorId: string,
  metricId: string,
): string {
  const observation = selectLatestObservation(state, monitorId, metricId);
  return observation?.reading.status === "available"
    ? String(Math.round(observation.reading.value))
    : "—";
}

function CompactMetricDisplay({
  session,
  monitorId,
  metricId,
  label,
}: {
  readonly session: DemonstrationSession;
  readonly monitorId: string;
  readonly metricId: string;
  readonly label: string;
}) {
  const { replayState } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );

  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs font-bold text-slate-600">{label}:</span>
      <span className="text-sm font-black text-slate-900">
        {observationValue(replayState, monitorId, metricId)} <span className="text-xs">µg/m³</span>
      </span>
    </div>
  );
}

function AutomatedWorkflow({ session }: { readonly session: DemonstrationSession }) {
  const { incidentState, replayState } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );

  const { phase, closed, isEscalated, progressStatus } = incidentState;
  const workflowRef = useRef<HTMLDivElement>(null);
  const [photoEvidence, setPhotoEvidence] = useState<{ name: string; dataUrl: string } | null>(null);

  // Auto-scroll workflow section into view when phase changes
  useEffect(() => {
    if (workflowRef.current) {
      setTimeout(() => {
        workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [phase]);

  const handleUploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const dataUrl = reader.result;
      const evidenceObj = { name: file.name, dataUrl };
      setPhotoEvidence(evidenceObj);

      session.dispatchIncidentEvent({
        type: "EVIDENCE_ATTACHED",
        evidenceId: `EVD-${Date.now()}`,
        name: file.name,
        category: "Site Inspection Photo",
        details: "Photo evidence attached during operational workflow review",
      });

      try {
        window.localStorage.setItem("verifair-demo-photo-evidence", JSON.stringify(evidenceObj));
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  // Auto-advance through workflow when scenario position changes
  useEffect(() => {
    if (!session || closed) return;

    const advanceWorkflow = () => {
      // Automatically dispatch events based on scenario progress
      const markerIndex = Math.floor((replayState.offsetMs / session.durationMs) * 100);

      if (phase === "Alert" && markerIndex > 5) {
        session.dispatchIncidentEvent({
          type: "ACKNOWLEDGED",
          acknowledgedBy: "Automated Workflow",
        });
      } else if (phase === "Acknowledge" && markerIndex > 20) {
        session.dispatchIncidentEvent({
          type: "ASSIGNED",
          assignee: "Jordan Lee",
        });
      } else if (phase === "Assign" && markerIndex > 35) {
        session.dispatchIncidentEvent({
          type: "INVESTIGATION_STARTED",
          startedBy: "Jordan Lee",
        });
      } else if (phase === "Investigate" && markerIndex > 60) {
        session.dispatchIncidentEvent({
          type: "VERIFICATION_STARTED",
          verifier: "Maria Chen",
        });
      } else if (phase === "Verify" && markerIndex > 80) {
        session.dispatchIncidentEvent({
          type: "VERIFICATION_COMPLETED",
          verifier: "Maria Chen",
          outcome: "sufficient_to_close",
          notes: "Area inspected; local control misting confirmed effective.",
        });
      } else if (phase === "Close" && markerIndex > 90) {
        session.dispatchIncidentEvent({
          type: "INCIDENT_CLOSED",
          category: "False positive",
          details: "Area inspected; temporary flare resolved.",
          closedBy: "Maria Chen",
        });
      }
    };

    advanceWorkflow();
  }, [replayState.offsetMs, phase, closed, session]);

  return (
    <section
      ref={workflowRef}
      aria-labelledby="operational-workflow-title"
      className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <p id="operational-workflow-title" className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            Workflow progress
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-950">
            {closed ? "Incident closed with evidence retained" : `${phase}: ${progressStatus}`}
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Incident INC-0042 · General Entry Door · Action condition
          </p>
        </div>
        <div
          className={`px-3 py-2 text-xs font-black uppercase min-w-fit ${
            closed
              ? "bg-emerald-700 text-white"
              : phase === "Alert"
              ? "bg-red-600 text-white animate-pulse ring-2 ring-red-400"
              : isEscalated
              ? "bg-red-700 text-white"
              : "bg-amber-300 text-amber-950"
          }`}
        >
          {closed ? "Closed" : isEscalated ? "Escalated" : phase === "Alert" ? "ACTION REQUIRED" : progressStatus}
        </div>
      </div>

      {/* Workflow phase progress */}
      <ol className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6" aria-label="Workflow progress">
        {CANONICAL_WORKFLOW_PHASES.map((p, index) => {
          const isActive = phase === p && !closed;
          const isPast = closed || CANONICAL_WORKFLOW_PHASES.indexOf(phase) > index;
          return (
            <li
              key={p}
              className={`border px-3 py-2 text-xs font-bold text-center transition-colors ${
                isActive
                  ? "border-blue-700 bg-blue-700 text-white"
                  : isPast
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : "border-slate-300 bg-white text-slate-500"
              }`}
            >
              {index + 1}. {p}
            </li>
          );
        })}
      </ol>

      {/* Photo evidence upload - only in Investigation and Close */}
      {(phase === "Investigate" || phase === "Close") && !closed && (
        <div className="mt-4 border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-slate-700">Photo evidence</p>
              <p className="mt-1 text-sm text-slate-600">
                Attach a site photo during investigation or closure.
              </p>
            </div>
            <label className="inline-flex min-h-10 cursor-pointer items-center justify-center bg-slate-900 px-4 font-black text-white text-sm whitespace-nowrap">
              Upload photo
              <input
                type="file"
                aria-label="Upload photo evidence"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleUploadPhoto}
              />
            </label>
          </div>
          {photoEvidence && (
            <div className="mt-3 flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200">
              <Image
                src={photoEvidence.dataUrl}
                alt="Uploaded incident evidence"
                width={100}
                height={75}
                unoptimized
                className="h-16 w-24 object-cover"
              />
              <div className="text-sm">
                <p className="font-bold text-slate-900">{photoEvidence.name}</p>
                <a
                  href={photoEvidence.dataUrl}
                  download={photoEvidence.name}
                  className="text-xs font-black text-blue-700 hover:underline"
                >
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Closed state */}
      {closed && (
        <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50">
          <p className="text-sm font-semibold text-emerald-900">
            ✓ Closed by {incidentState.closedBy}. Category: {incidentState.closureCategory}.
          </p>
        </div>
      )}
    </section>
  );
}

export function ProductDemonstration({
  session: sessionProp,
}: {
  readonly session?: DemonstrationSession;
}) {
  const session = sessionProp ?? getSharedDemonstrationSession();
  const [hydrated, setHydrated] = useState(false);

  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );

  const { incidentState, currentMarkerIndex } = snapshot;

  const alertMonitorId = "MON-GED"; // General Entry Door

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div
      data-testid="product-demonstration"
      data-hydrated={hydrated}
      className="overflow-hidden border border-slate-300 bg-white shadow-xl"
    >
      <header className="bg-slate-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
          Guided workflow demonstration
        </p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Watch the alert-to-evidence workflow
            </h1>
            <p className="mt-2 max-w-3xl text-xs sm:text-sm leading-6 text-slate-300">
              The simulation automatically advances through monitoring, alert, investigation, verification and closure stages.
            </p>
          </div>
          {incidentState.phase === "Alert" && (
            <div className="rounded bg-red-600 px-3 py-2 text-right animate-pulse">
              <p className="text-[10px] font-bold uppercase text-red-100">Alert Status</p>
              <p className="text-lg font-black text-white">Action Required</p>
            </div>
          )}
        </div>
      </header>

      <AutomatedWorkflow session={session} />

      {/* Playback controls - simplified */}
      <section aria-labelledby="replay-controls-heading" className="border-t border-slate-200 bg-slate-50 p-5 sm:p-8">
        <h2 id="replay-controls-heading" className="text-xs font-black uppercase tracking-wide text-slate-700 mb-3">
          Playback
        </h2>
        <ReplayControls session={session} />
      </section>

      {/* Current scenario step */}
      <section aria-labelledby="scenario-step-heading" className="border-t border-slate-200 p-5 sm:p-8 bg-sky-50">
        <div className="border border-sky-200 bg-white p-4 rounded">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">
            Scenario Marker {currentMarkerIndex + 1} of {MEANINGFUL_SCENARIO_MARKERS.length}
          </p>
          <h2 id="scenario-step-heading" className="mt-2 text-lg font-black text-slate-950">
            {MEANINGFUL_SCENARIO_MARKERS[currentMarkerIndex]?.label}
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            {MEANINGFUL_SCENARIO_MARKERS[currentMarkerIndex]?.description}
          </p>
        </div>
      </section>

      {/* Compact PM readings - location is known from alert */}
      <section aria-labelledby="pm-readings-heading" className="border-t border-slate-200 p-5 sm:p-8">
        <div>
          <p id="pm-readings-heading" className="text-xs font-black uppercase tracking-[0.16em] text-blue-700 mb-2">
            Live readings - General Entry Door
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DEMONSTRATION_METRICS.map((metric) => (
              <CompactMetricDisplay
                key={metric.id}
                session={session}
                monitorId={alertMonitorId}
                metricId={metric.id}
                label={metric.label}
              />
            ))}
          </div>
          <p className="mt-3 text-[10px] text-slate-500">
            {DEMO_DISCLOSURE} Location identified from alert context.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
        {DEMO_DISCLOSURE} {DEMO_DISCLOSURE_WITH_CONTEXT}
      </footer>
    </div>
  );
}


export function ProductDemonstrationPreview() {
  return <ProductDemonstration />;
}
