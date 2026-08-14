"use client";

/**
 * Unified VerifAir Demonstration Experience
 * 
 * Single-page experience showing:
 * 1. Live Monitoring (baseline → review → action)
 * 2. Incident Workspace (realistic ticket-style workflow)
 * 3. Evidence & Reporting (incident report projection)
 * 
 * No replay controls exposed to user.
 * Deterministic progression based on scenario timeline.
 * All workflow actions are user-driven forms, not automatic.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";

import {
  selectLatestObservation,
} from "@/lib/replay/selectors";
import { publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";
import {
  DemonstrationSession,
  getSharedDemonstrationSession,
} from "@/lib/demonstration/session";
import {
  selectIncidentTimeline,
  type WorkflowPhase,
} from "@/lib/demonstration/incident-domain";

const DEMONSTRATION_START_MS = Date.parse(publicDemonstrationScenario.startTimestamp);
const DEMONSTRATION_OPERATOR = "Operator";

function formatDemoTimestamp(offsetMs: number, options?: Intl.DateTimeFormatOptions): string {
  return new Date(DEMONSTRATION_START_MS + offsetMs).toLocaleString(undefined, options);
}

// ============================================================
// Live Monitoring Section
// ============================================================

interface MonitorStatus {
  id: string;
  name: string;
  status: "normal" | "review" | "action";
  pm25: number;
  pm1: number;
  pm10: number;
  respirableDust: number;
  readingTimestamp: string;
}

const monitorTrendPoints: Record<string, string> = {
  WORK_ZONE_A: "0,48 12,44 24,46 36,38 48,40 60,31 72,34 84,23 96,28 108,16 120,20 132,8 144,12 156,4",
  OCCUPIED_INTERFACE: "0,30 12,28 24,31 36,27 48,29 60,25 72,27 84,23 96,26 108,22 120,24 132,20 144,22 156,19",
  SHARED_CORRIDOR: "0,35 12,39 24,32 36,34 48,27 60,31 72,24 84,29 96,21 108,25 120,18 132,23 144,16 156,20",
  EXTERNAL_BOUNDARY: "0,42 12,39 24,40 36,41 48,35 60,36 72,37 84,30 96,32 108,31 120,26 132,28 144,25 156,26",
};

function observationValue(
  replayState: ReturnType<DemonstrationSession["getSnapshot"]>["replayState"],
  monitorId: string,
  metricId: string,
): number {
  const observation = selectLatestObservation(replayState, monitorId, metricId);
  return observation?.reading.status === "available"
    ? Math.round(observation.reading.value)
    : 0;
}

function determineMonitorStatus(pm25Value: number): MonitorStatus["status"] {
  // Deterministic status based on configured operational triggers for this public demo.
  if (pm25Value >= 25) return "action";
  if (pm25Value >= 15) return "review";
  return "normal";
}

function LiveMonitoringSection({
  session,
}: {
  readonly session: DemonstrationSession;
}) {
  const { replayState, incidentState } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );

  const monitors: readonly MonitorStatus[] = useMemo(() => {
    return [
      {
        id: "WORK_ZONE_A",
        name: "Work Zone",
        pm1: observationValue(replayState, "WORK_ZONE_A", "PM1"),
        pm25: observationValue(replayState, "WORK_ZONE_A", "PM2_5"),
        pm10: observationValue(replayState, "WORK_ZONE_A", "PM10"),
        respirableDust: observationValue(replayState, "WORK_ZONE_A", "RESPIRABLE_DUST"),
        status: incidentState.opened ? "action" : determineMonitorStatus(
          observationValue(replayState, "WORK_ZONE_A", "PM2_5")
        ),
        readingTimestamp: new Date(replayState.timestamp).toLocaleTimeString(),
      },
      {
        id: "OCCUPIED_INTERFACE",
        name: "Work-Zone Boundary",
        pm1: observationValue(replayState, "OCCUPIED_INTERFACE", "PM1"),
        pm25: observationValue(replayState, "OCCUPIED_INTERFACE", "PM2_5"),
        pm10: observationValue(replayState, "OCCUPIED_INTERFACE", "PM10"),
        respirableDust: observationValue(replayState, "OCCUPIED_INTERFACE", "RESPIRABLE_DUST"),
        status: determineMonitorStatus(
          observationValue(replayState, "OCCUPIED_INTERFACE", "PM2_5")
        ),
        readingTimestamp: new Date(replayState.timestamp).toLocaleTimeString(),
      },
      {
        id: "SHARED_CORRIDOR",
        name: "Adjacent Corridor",
        pm1: observationValue(replayState, "SHARED_CORRIDOR", "PM1"),
        pm25: observationValue(replayState, "SHARED_CORRIDOR", "PM2_5"),
        pm10: observationValue(replayState, "SHARED_CORRIDOR", "PM10"),
        respirableDust: observationValue(replayState, "SHARED_CORRIDOR", "RESPIRABLE_DUST"),
        status: determineMonitorStatus(
          observationValue(replayState, "SHARED_CORRIDOR", "PM2_5")
        ),
        readingTimestamp: new Date(replayState.timestamp).toLocaleTimeString(),
      },
      {
        id: "EXTERNAL_BOUNDARY",
        name: "Occupied/Sensitive Area",
        pm1: observationValue(replayState, "EXTERNAL_BOUNDARY", "PM1"),
        pm25: observationValue(replayState, "EXTERNAL_BOUNDARY", "PM2_5"),
        pm10: observationValue(replayState, "EXTERNAL_BOUNDARY", "PM10"),
        respirableDust: observationValue(replayState, "EXTERNAL_BOUNDARY", "RESPIRABLE_DUST"),
        status: determineMonitorStatus(
          observationValue(replayState, "EXTERNAL_BOUNDARY", "PM2_5")
        ),
        readingTimestamp: new Date(replayState.timestamp).toLocaleTimeString(),
      },
    ];
  }, [replayState, incidentState.opened]);

  return (
    <section
      id="monitoring"
      className="border-b border-slate-200 bg-[#dfe5eb] px-5 py-8 sm:px-8"
    >
      <div className="max-w-6xl mx-auto overflow-hidden rounded-[1.5rem] border-[10px] border-slate-950 bg-[#dfe5eb] shadow-[0_25px_60px_rgba(15,23,42,0.25)]">
        <div className="flex items-center justify-between bg-[#0f6cab] px-4 py-3 text-white sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/10 text-lg font-black">
              ≡
            </div>
            <div className="text-sm font-medium tracking-[0.18em] text-sky-100 uppercase">
              Monitoring Overview
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            Live
          </div>
        </div>

        <div className="border-b border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700 sm:px-5">
          <strong className="font-black text-slate-900">Demonstration labels:</strong> PM2.5 values are configured operational triggers for demonstration purposes. They are not WEL values, regulatory limits, universal safety thresholds, or compliance criteria.
        </div>

        <div className="flex min-h-[640px] bg-[#edf2f7]">
          <aside className="flex w-20 flex-col items-center justify-start gap-4 border-r border-slate-300 bg-[#dfe5eb] py-6">
            {[
              "◫",
              "↗",
              "▤",
              "◔",
              "⚑",
            ].map((icon, index) => (
              <div
                key={icon + index}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border text-lg ${
                  index === 0
                    ? "border-sky-500 bg-sky-100 text-sky-700 shadow-inner"
                    : "border-slate-300 bg-white/60 text-slate-500"
                }`}
              >
                {icon}
              </div>
            ))}
          </aside>

          <div className="flex-1 p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {monitors.map((monitor) => (
                <div
                  key={monitor.id}
                  className={`rounded-[1rem] border bg-white p-4 shadow-sm ${
                    monitor.status === "action"
                      ? "border-red-300 bg-red-50"
                      : monitor.status === "review"
                      ? "border-amber-300 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                      {monitor.name}
                    </span>
                    {monitor.status === "action" ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                        !
                      </span>
                    ) : monitor.status === "review" ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-amber-950">
                        !
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="mb-1 text-[12px] font-medium text-slate-600">
                    Airborne Particulates
                  </div>

                  <div className="mb-3 flex items-end gap-2">
                    <div className="text-[28px] font-black leading-none text-slate-900">
                      {monitor.pm25}
                    </div>
                    <div className="pb-1 text-[11px] font-semibold text-slate-500">
                      µg/m³
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <span>PM1: {monitor.pm1} µg/m³</span>
                    <span>PM2.5: {monitor.pm25} µg/m³</span>
                    <span>Respirable dust: {monitor.respirableDust} µg/m³</span>
                    <span>PM10: {monitor.pm10} µg/m³</span>
                  </div>

                  <div className="mb-4 h-16 overflow-hidden rounded-md border border-slate-200 bg-slate-100 px-1 py-1">
                    <svg
                      viewBox="0 0 156 52"
                      role="img"
                      aria-label={`${monitor.name} PM2.5 trend`}
                      className="size-full"
                      preserveAspectRatio="none"
                    >
                      {[12, 24, 36, 48].map((y) => (
                        <line key={y} x1="0" x2="156" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.7" />
                      ))}
                      {[24, 48, 72, 96, 120, 144].map((x) => (
                        <line key={x} x1={x} x2={x} y1="0" y2="52" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.7" />
                      ))}
                      <polyline
                        points={monitorTrendPoints[monitor.id]}
                        fill="none"
                        stroke={monitor.status === "action" ? "#dc2626" : monitor.status === "review" ? "#d97706" : "#059669"}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle
                        cx="156"
                        cy={monitorTrendPoints[monitor.id].split(" ").at(-1)?.split(",")[1] ?? "20"}
                        r="2.6"
                        fill={monitor.status === "action" ? "#dc2626" : monitor.status === "review" ? "#d97706" : "#059669"}
                      />
                    </svg>
                  </div>

                  <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500">
                    {monitor.status === "normal" ? "Normal condition" : monitor.status === "review" ? "Review condition" : "Action condition"}
                    <span className="ml-2">Last observation {monitor.readingTimestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <section
              aria-labelledby="system-health-title"
              className="mt-5 border border-slate-300 bg-white px-4 py-3 shadow-sm"
            >
              <h2 id="system-health-title" className="sr-only">System health</h2>
              <div className="grid gap-3 border-t border-slate-200 pt-3 text-[11px] text-slate-500 sm:grid-cols-3 sm:items-center sm:justify-items-center">
                <span>Gateway health: Healthy</span>
                <span>Last observation: {new Date(replayState.timestamp).toLocaleTimeString()}</span>
                <span>Communications: Connected · Monitors: 4/4 online</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Incident Workspace Section
// ============================================================

interface WorkflowFormState {
  assignedTo?: string;
  priority?: "Normal" | "High" | "Urgent";
  investigationStatus?: string;
  investigationNotes?: string;
  observedConditions?: string;
  actionTaken?: string;
  escalationReason?: string;
  escalationTarget?: string;
  escalationDetails?: string;
  responseType?: string;
  responseDetails?: string;
  performedBy?: string;
  verificationOutcome?: "sufficient_to_close" | "further_action_required";
  verificationRequestedBy?: string;
  verificationVerifier?: string;
  verificationNotes?: string;
  closureCategory?: string;
  closureDetails?: string;
  closureBy?: string;
}

const workflowGuidance: Record<string, { label: string; message: string }> = {
  Alert: {
    label: "Acknowledge",
    message: "Confirm that you have received the alert, then continue to the assignment step.",
  },
  Acknowledge: {
    label: "Acknowledge and assign",
    message: "Click Acknowledge and assign to me to confirm receipt and take ownership of the incident in one step.",
  },
  Assign: {
    label: "Investigate",
    message: "Click Begin site investigation to open the investigation record and continue the workflow.",
  },
  Investigate: {
    label: "Record",
    message: "Select an investigation status, add what was observed and what was done, then save the update.",
  },
  Verify: {
    label: "Verify",
    message: "Select a verifier and outcome, add any notes, then complete verification.",
  },
  Close: {
    label: "Resolve",
    message: "Select the closer and closure category, add a summary, then close the incident.",
  },
};

function WorkflowGuide({ phase }: { readonly phase: WorkflowPhase }) {
  const guidance = workflowGuidance[phase];
  if (!guidance) return null;

  return (
    <div
      className="mb-6 flex max-w-3xl items-start gap-3 border-2 border-dashed border-sky-400 bg-sky-50 p-4 shadow-[0_0_0_4px_rgba(56,189,248,0.12)] motion-safe:animate-pulse"
      role="status"
      aria-live="polite"
    >
      <span className="shrink-0 text-xl" aria-hidden="true">📎</span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-800">
          Next step: {guidance.label}
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-800">{guidance.message}</p>
      </div>
    </div>
  );
}

function IncidentWorkspaceSection({
  session,
}: {
  readonly session: DemonstrationSession;
}) {
  const { incidentState, replayState } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );

  const [formState, setFormState] = useState<WorkflowFormState>({});
  const [photoEvidence, setPhotoEvidence] = useState<
    { name: string; dataUrl: string } | null
  >(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<number | null>(null);

  const cancelPendingIncidentScroll = () => {
    if (autoScrollTimerRef.current !== null) {
      window.clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  };

  // Bring the newly opened ticket into view after React commits the state transition.
  useEffect(() => {
    if (incidentState.opened && workspaceRef.current) {
      cancelPendingIncidentScroll();
      autoScrollTimerRef.current = window.setTimeout(() => {
        autoScrollTimerRef.current = null;
        if (workspaceRef.current?.contains(document.activeElement)) return;
        requestAnimationFrame(() => {
          workspaceRef.current?.scrollIntoView({
            behavior: "auto",
            block: "start",
          });
        });
      }, 1800);
      return cancelPendingIncidentScroll;
    }
  }, [incidentState.opened]);

  const attachEvidence = (name: string, previewUrl: string) => {
    const evidenceId = `EVD-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
    setPhotoEvidence({ name, dataUrl: previewUrl });
    session.registerEvidenceAsset({ evidenceId, name, previewUrl });
    session.dispatchIncidentEvent({
      type: "EVIDENCE_ATTACHED",
      evidenceId,
      name,
      category: "Site Inspection Photo",
      details: "Situational inspection image attached from the demonstration library.",
      actor: formState.assignedTo || DEMONSTRATION_OPERATOR,
      context: "Investigation evidence",
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const dataUrl = reader.result;
      attachEvidence(file.name, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAcknowledgeAndAssign = () => {
    session.dispatchIncidentEvent({
      type: "ACKNOWLEDGED",
      acknowledgedBy: DEMONSTRATION_OPERATOR,
    });
    session.dispatchIncidentEvent({
      type: "ASSIGNED",
      assignee: DEMONSTRATION_OPERATOR,
      priority: formState.priority || "Normal",
    });
  };

  const handleStartInvestigation = () => {
    session.dispatchIncidentEvent({
      type: "INVESTIGATION_STARTED",
      startedBy: formState.assignedTo || DEMONSTRATION_OPERATOR,
    });
  };

  const handleUpdateInvestigation = () => {
    if (!formState.investigationStatus) return;
    session.dispatchIncidentEvent({
      type: "INVESTIGATION_UPDATED",
      status: formState.investigationStatus,
      notes: formState.investigationNotes || "Investigation update recorded.",
      observedConditions: formState.observedConditions || "No additional conditions recorded.",
      actionTaken: formState.actionTaken || "No action recorded.",
      actor: incidentState.assignedTo || DEMONSTRATION_OPERATOR,
    });
  };

  const handleEscalate = () => {
    if (!formState.escalationTarget || !formState.escalationReason) return;
    session.dispatchIncidentEvent({
      type: "ESCALATED",
      escalatedBy: incidentState.assignedTo || DEMONSTRATION_OPERATOR,
      reason: formState.escalationReason,
      target: formState.escalationTarget,
      details: formState.escalationDetails || "No additional escalation details.",
    });
    session.dispatchIncidentEvent({
      type: "RESPONSE_NOTE_ADDED",
      author: incidentState.assignedTo || DEMONSTRATION_OPERATOR,
      note: `Email sent to supervisor: ${formState.escalationTarget}.`,
    });
  };

  const handleSubmitForVerification = () => {
    if (!formState.verificationVerifier) return;
    session.dispatchIncidentEvent({
      type: "VERIFICATION_STARTED",
      verifier: formState.verificationVerifier,
      requestedBy: incidentState.assignedTo || DEMONSTRATION_OPERATOR,
    });
  };

  const handleRecordResponse = () => {
    if (!formState.responseType || !formState.performedBy) return;
    session.dispatchIncidentEvent({
      type: "RESPONSE_RECORDED",
      responseType: formState.responseType,
      details: formState.responseDetails || "No additional response details.",
      performedBy: formState.performedBy,
    });
  };

  const handleCompleteVerification = () => {
    if (!formState.verificationOutcome || !formState.verificationVerifier) return;
    const result = session.dispatchIncidentEvent({
      type: "VERIFICATION_COMPLETED",
      verifier: formState.verificationVerifier,
      outcome: formState.verificationOutcome,
      notes: formState.verificationNotes || "Verification complete",
    });
    
    if (result.ok && formState.verificationOutcome === "further_action_required") {
      // Verification will return incident to Investigate phase
    }
  };

  const handleCloseIncident = () => {
    if (!formState.closureCategory) return;
    session.dispatchIncidentEvent({
      type: "INCIDENT_CLOSED",
      category: formState.closureCategory,
      details: formState.closureDetails || "No additional details",
      closedBy: formState.closureBy || incidentState.verificationRecord?.verifier || "Maria Chen",
    });
  };

  if (!incidentState.opened) {
    return (
      <section className="border-b border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-black uppercase tracking-wider text-blue-700">
            Step 2 · Incident Workspace
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
            Awaiting action condition
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            When particulate readings exceed the configured threshold, an incident will be automatically opened here for response and investigation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={workspaceRef}
      id="incident"
      onPointerDown={cancelPendingIncidentScroll}
      onFocusCapture={cancelPendingIncidentScroll}
      className="border-b border-slate-200 bg-white px-5 py-8 sm:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-wider text-blue-700">
            Step 2 · Incident Workspace
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
            Operational incident management
          </h2>
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-8">
          <main className="min-w-0 lg:max-w-4xl">
        {/* Incident Header Card */}
        <div className="max-w-3xl border-2 border-slate-300 bg-slate-50 p-6 mb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Incident ID</p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {incidentState.incidentId}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Status</p>
              <span className="mt-1 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-black text-red-800">
                {incidentState.closed ? "CLOSED" : incidentState.phase.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Location</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                Zone 04 — General Entry Door
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Opened</p>
              <p className="mt-1 text-sm font-mono text-slate-700">
                {incidentState.openedAtMs
                  ? formatDemoTimestamp(incidentState.openedAtMs)
                  : "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Owner</p>
              <p className="mt-1 text-sm text-slate-900">
                {incidentState.assignedTo || "Unassigned"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Priority</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {incidentState.priority || "Unassigned"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Age / duration</p>
              <p className="mt-1 text-sm font-mono text-slate-700">
                {incidentState.openedAtMs === undefined
                  ? "Pending"
                  : `${Math.max(0, Math.round((replayState.offsetMs - incidentState.openedAtMs) / 1000))}s`}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase">Trigger Condition</p>
              <p className="mt-1 text-sm text-slate-700">
                {incidentState.triggerCondition}
              </p>
            </div>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-bold text-slate-700 uppercase mb-2">Workflow Progress</p>
          <div className="grid gap-1 grid-cols-6 auto-cols-fr">
            {["Alert", "Acknowledge", "Assign", "Investigate", "Verify", "Close"].map((p) => {
              const isActive = incidentState.phase === p;
              const isPast = ["Alert", "Acknowledge", "Assign", "Investigate", "Verify", "Close"].indexOf(incidentState.phase) > ["Alert", "Acknowledge", "Assign", "Investigate", "Verify", "Close"].indexOf(p as WorkflowPhase);
              const isCompleted = incidentState.closed;
              return (
                <div
                  key={p}
                  className={`border px-2 py-2 text-xs font-bold text-center transition-all ${
                    isActive
                      ? "border-blue-700 bg-blue-700 text-white"
                      : isPast || isCompleted
                      ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                      : "border-slate-300 bg-slate-100 text-slate-600"
                  }`}
                >
                  {p}
                </div>
              );
            })}
          </div>
        </div>

        <WorkflowGuide phase={incidentState.phase} />

        {/* Acknowledgement Phase */}
        {incidentState.phase === "Alert" && !incidentState.acknowledged && (
          <div className="mb-6 max-w-3xl border-2 border-red-300 bg-red-50 p-6 shadow-[0_0_0_4px_rgba(248,113,113,0.16)]">
            <div className="mb-4">
              <p className="text-sm font-black text-red-900 uppercase">⚠ Action Required</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Acknowledge and assign to me
              </h3>
              <p className="mt-1 text-sm text-slate-700">
                An action condition has been detected. Confirm receipt and begin response procedures.
              </p>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">Priority</span>
                <select
                  className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                  value={formState.priority || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      priority: e.target.value as WorkflowFormState["priority"],
                    })
                  }
                >
                  <option value="">Select priority…</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </label>
              <button
                type="button"
                className="inline-block bg-red-600 text-white px-4 py-2 font-black text-sm hover:bg-red-700"
                onClick={handleAcknowledgeAndAssign}
              >
                Acknowledge and assign to me
              </button>
            </div>
          </div>
        )}

        {incidentState.acknowledged && (
          <div className="mb-4 p-3 border border-emerald-300 bg-emerald-50 text-sm text-emerald-900">
            ✓ Acknowledged by {incidentState.acknowledgedBy}
          </div>
        )}

        {incidentState.assignedTo && (
          <div className="mb-4 p-3 border border-emerald-300 bg-emerald-50 text-sm text-emerald-900">
            ✓ Assigned to {incidentState.assignedTo}
          </div>
        )}

        {/* Investigation Phase */}
        {incidentState.assignedTo && incidentState.phase === "Assign" && !incidentState.investigationStarted && (
          <div className="mb-6 max-w-3xl border-2 border-blue-300 bg-blue-50 p-6 shadow-[0_0_0_4px_rgba(96,165,250,0.16)]">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Start investigation
            </h3>
            <button
              type="button"
              className="inline-block bg-blue-600 text-white px-4 py-2 font-black text-sm hover:bg-blue-700"
              onClick={handleStartInvestigation}
            >
              Begin site investigation
            </button>
          </div>
        )}

        {incidentState.investigationStarted && incidentState.phase === "Investigate" && (
          <div className="mb-6 max-w-3xl border border-slate-300 bg-white p-6 shadow-[0_0_0_4px_rgba(96,165,250,0.12)] space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Investigation in progress
            </h3>

            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Investigation status
                </span>
                <select
                  className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                  value={formState.investigationStatus || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      investigationStatus: e.target.value,
                    })
                  }
                >
                  <option value="">Select status…</option>
                  <option value="In progress">In progress</option>
                  <option value="Controls being checked">Controls being checked</option>
                  <option value="Site inspection underway">Site inspection underway</option>
                  <option value="Awaiting additional information">Awaiting additional information</option>
                  <option value="Awaiting verification">Awaiting verification</option>
                </select>
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Investigation notes
                </span>
                <textarea
                  className="mt-1 w-full min-h-20 border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
                  placeholder="Document findings, observations, and actions taken..."
                  value={formState.investigationNotes || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      investigationNotes: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Observed conditions
                </span>
                <textarea
                  className="mt-1 w-full min-h-16 border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="Describe what was observed at the site…"
                  value={formState.observedConditions || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      observedConditions: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Action taken
                </span>
                <textarea
                  className="mt-1 w-full min-h-16 border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="Record any corrective actions performed…"
                  value={formState.actionTaken || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      actionTaken: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <button
              type="button"
              className="inline-block bg-slate-700 text-white px-4 py-2 font-black text-sm hover:bg-slate-800"
              onClick={handleUpdateInvestigation}
            >
              Save investigation update
            </button>

            <div className="border-t border-slate-200 pt-5">
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Verification requested from
                </span>
                <select
                  className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                  value={formState.verificationVerifier || ""}
                  onChange={(e) =>
                    setFormState({ ...formState, verificationVerifier: e.target.value })
                  }
                >
                  <option value="">Select verifier…</option>
                  <option value="Maria Chen">Maria Chen</option>
                  <option value="HSE Lead">HSE Lead</option>
                  <option value="Site Supervisor">Site Supervisor</option>
                </select>
              </label>
              <button
                type="button"
                className="mt-3 inline-block bg-blue-700 text-white px-4 py-2 font-black text-sm hover:bg-blue-800 disabled:opacity-50"
                disabled={!formState.verificationVerifier}
                onClick={handleSubmitForVerification}
              >
                Submit for verification
              </button>
            </div>

            {/* Photo Evidence Upload */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-700 uppercase mb-3">
                Photo evidence (optional)
              </p>
              <label className="inline-flex min-h-10 cursor-pointer items-center justify-center bg-sky-700 px-4 font-black text-white text-sm hover:bg-sky-800">
                Upload image(s)
                <input
                  type="file"
                  aria-label="Upload image(s)"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={handlePhotoUpload}
                />
              </label>
              {photoEvidence && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Image
                    src={photoEvidence.dataUrl}
                    alt="Uploaded evidence"
                    width={100}
                    height={75}
                    unoptimized
                    className="h-16 w-24 object-cover border border-slate-300"
                  />
                  <div className="text-sm">
                    <p className="font-bold text-slate-900">{photoEvidence.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Response Recording */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Record Response</h4>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Response type
                  </span>
                  <select
                    className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                    value={formState.responseType || ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        responseType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select response type…</option>
                    <option value="Local control adjustment">Local control adjustment</option>
                    <option value="Work activity paused">Work activity paused</option>
                    <option value="Suppression applied">Suppression applied</option>
                    <option value="Area inspected">Area inspected</option>
                    <option value="Equipment checked">Equipment checked</option>
                    <option value="Housekeeping action">Housekeeping action</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Response details
                  </span>
                  <textarea
                    className="mt-1 w-full min-h-16 border border-slate-300 bg-white px-3 py-2 text-sm"
                    placeholder="Describe the response action in detail…"
                    value={formState.responseDetails || ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        responseDetails: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Performed by
                  </span>
                  <input
                    type="text"
                    className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                    placeholder="Name or role"
                    value={formState.performedBy || ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        performedBy: e.target.value,
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className="inline-block bg-slate-600 text-white px-4 py-2 font-black text-sm hover:bg-slate-700"
                  onClick={handleRecordResponse}
                >
                  Record response
                </button>
              </div>
            </div>

            {/* Escalation */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Escalation (optional)</h4>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Escalation reason
                  </span>
                  <select
                    className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                    value={formState.escalationReason || ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        escalationReason: e.target.value,
                      })
                    }
                  >
                    <option value="">No escalation</option>
                    <option value="Ongoing elevated readings">Ongoing elevated readings</option>
                    <option value="Additional management review required">Additional management review required</option>
                    <option value="Control effectiveness requires review">Control effectiveness requires review</option>
                    <option value="Additional site investigation required">Additional site investigation required</option>
                    <option value="Work coordination required">Work coordination required</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                {formState.escalationReason && (
                  <>
                    <label className="block">
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        Escalate to
                      </span>
                      <select
                        className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                        value={formState.escalationTarget || ""}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            escalationTarget: e.target.value,
                          })
                        }
                      >
                        <option value="">Select recipient…</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="HSE Lead">HSE Lead</option>
                        <option value="Facilities Manager">Facilities Manager</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        Escalation details
                      </span>
                      <textarea
                        className="mt-1 w-full min-h-16 border border-slate-300 bg-white px-3 py-2 text-sm"
                        placeholder="Provide context for escalation…"
                        value={formState.escalationDetails || ""}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            escalationDetails: e.target.value,
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="inline-block bg-red-600 text-white px-4 py-2 font-black text-sm hover:bg-red-700"
                      onClick={handleEscalate}
                    >
                      Escalate incident
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verification Phase */}
        {incidentState.phase === "Verify" && !incidentState.verificationRecord && (
          <div className="mb-6 max-w-3xl border border-slate-300 bg-white p-6 shadow-[0_0_0_4px_rgba(96,165,250,0.12)] space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Verify investigation and controls
            </h3>
            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Verifier
                </span>
                <select
                  className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                  value={formState.verificationVerifier || ""}
                  onChange={(e) =>
                    setFormState({ ...formState, verificationVerifier: e.target.value })
                  }
                >
                  <option value="">Select verifier…</option>
                  <option value="Maria Chen">Maria Chen</option>
                  <option value="HSE Lead">HSE Lead</option>
                  <option value="Site Supervisor">Site Supervisor</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Verification outcome
                </span>
                <select
                  className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                  value={formState.verificationOutcome || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      verificationOutcome: e.target.value as WorkflowFormState["verificationOutcome"],
                    })
                  }
                >
                  <option value="">Select outcome…</option>
                  <option value="sufficient_to_close">Sufficient to close</option>
                  <option value="further_action_required">Further action required</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Verification notes
                </span>
                <textarea
                  className="mt-1 w-full min-h-16 border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="Document verification findings…"
                  value={formState.verificationNotes || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      verificationNotes: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            {/* Photo Evidence Upload */}
            {!photoEvidence && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 uppercase mb-3">
                  Photo evidence (optional)
                </p>
                <label className="inline-flex min-h-10 cursor-pointer items-center justify-center bg-slate-900 px-4 font-black text-white text-sm">
                  Upload image(s)
                  <input
                    type="file"
                    aria-label="Upload image(s)"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            )}

            <button
              type="button"
              className="inline-block bg-blue-600 text-white px-4 py-2 font-black text-sm hover:bg-blue-700 disabled:opacity-50"
              disabled={!formState.verificationOutcome || !formState.verificationVerifier}
              onClick={handleCompleteVerification}
            >
              Complete verification
            </button>
          </div>
        )}

        {incidentState.verificationRecord && (
          <div className="mb-4 p-3 border border-emerald-300 bg-emerald-50 text-sm text-emerald-900">
            ✓ Verified by {incidentState.verificationRecord.verifier}. Outcome:{" "}
            {incidentState.verificationRecord.outcome === "sufficient_to_close"
              ? "Sufficient to close"
              : "Further action required"}
          </div>
        )}

        {/* Closure Phase */}
        {incidentState.phase === "Close" && incidentState.verificationRecord?.outcome === "sufficient_to_close" && !incidentState.closed && (
          <div className="mb-6 max-w-3xl border-2 border-emerald-400 bg-emerald-50 p-6 shadow-[0_0_0_4px_rgba(52,211,153,0.16)] space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Close this incident
            </h3>
            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Closed by
                </span>
                <select
                  className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                  value={formState.closureBy || ""}
                  onChange={(e) => setFormState({ ...formState, closureBy: e.target.value })}
                >
                  <option value="">Select closer…</option>
                  <option value="Maria Chen">Maria Chen</option>
                  <option value="Operator">Operator</option>
                  <option value="HSE Lead">HSE Lead</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Closure category
                </span>
                <select
                  className="mt-1 w-full min-h-10 border border-slate-300 bg-white px-3"
                  value={formState.closureCategory || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      closureCategory: e.target.value,
                    })
                  }
                >
                  <option value="">Select category…</option>
                  <option value="Controls adjusted">Controls adjusted</option>
                  <option value="Work activity completed">Work activity completed</option>
                  <option value="Device or data issue">Device or data issue</option>
                  <option value="False positive">False positive</option>
                  <option value="No further action required">No further action required</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Closure details
                </span>
                <textarea
                  className="mt-1 w-full min-h-16 border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="Provide closure summary…"
                  value={formState.closureDetails || ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      closureDetails: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <button
              type="button"
              className="inline-block bg-emerald-600 text-white px-4 py-2 font-black text-sm hover:bg-emerald-700 disabled:opacity-50"
              disabled={!formState.closureCategory || !formState.closureBy}
              onClick={handleCloseIncident}
            >
              Close incident
            </button>
          </div>
        )}

        {incidentState.closed && (
          <div className="mb-4 p-4 border-2 border-emerald-400 bg-emerald-50">
            <p className="text-sm font-bold text-emerald-900">
              ✓ Incident closed by {incidentState.closedBy}
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Category: {incidentState.closureCategory}
            </p>
          </div>
        )}
          </main>

          <aside className="mt-8 lg:sticky lg:top-6 lg:mt-0 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <div className="border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-600">Activity</h3>
              <div className="mt-3 space-y-3">
                {selectIncidentTimeline(incidentState).slice(-8).map((row, index) => (
                  <div
                    key={`${row.timestampMs}-${row.actor}-${row.action}-${row.details}-${index}`}
                    className="border-l-2 border-sky-400 pl-3 text-sm"
                  >
                    <p className="font-mono text-[11px] text-slate-500">{formatDemoTimestamp(row.timestampMs, { timeStyle: "medium" })}</p>
                    <p className="mt-1 font-bold text-slate-700">{row.actor}</p>
                    <p className="mt-0.5 text-slate-900">{row.action}: {row.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Evidence & Reporting Section
// ============================================================

function EvidenceAndReportingSection({
  session,
}: {
  readonly session: DemonstrationSession;
}) {
  const { incidentState } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );

  const [reportType, setReportType] = useState<string>(
    incidentState.closed ? "Incident report" : ""
  );

  const reportingRef = useRef<HTMLDivElement>(null);
  const timeline = selectIncidentTimeline(incidentState);

  // Auto-scroll to reporting when incident closes
  useEffect(() => {
    if (incidentState.closed && reportingRef.current) {
      requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        reportingRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
      setReportType("Incident report");
    }
  }, [incidentState.closed]);

  return (
    <section
      ref={reportingRef}
      id="evidence"
      className="border-b border-slate-200 bg-slate-50 px-5 py-8 sm:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-wider text-sky-700">
            Step 3 · Evidence & Reporting
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
            Evidence pack and operational record
          </h2>
        </div>

        <div className="mb-6">
          <label className="block mb-4">
            <span className="text-xs font-bold text-slate-700 uppercase">
              Report type
            </span>
            <select
              className="mt-2 w-full sm:w-64 min-h-10 border border-slate-300 bg-white px-3"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="">Choose a report…</option>
              <option value="Incident report">Incident report</option>
              <option value="Alert & response register">Alert & response register</option>
              <option value="Monitoring period summary">Monitoring period summary</option>
              <option value="Evidence pack">Evidence pack</option>
            </select>
          </label>
        </div>

        {reportType === "Incident report" && incidentState.closed && (
          <div className="border border-slate-300 bg-white p-6 space-y-6">
            {/* Incident Summary */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Incident Summary</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Incident ID</p>
                  <p className="mt-1 text-sm font-mono text-slate-900">
                    {incidentState.incidentId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Status</p>
                  <p className="mt-1 text-sm text-slate-900">Closed</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Report generated</p>
                  <p className="mt-1 text-sm text-slate-900">{new Date().toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Opened</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {incidentState.openedAtMs !== undefined ? formatDemoTimestamp(incidentState.openedAtMs) : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Closed</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {incidentState.closedAtMs !== undefined ? formatDemoTimestamp(incidentState.closedAtMs) : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Location</p>
                  <p className="mt-1 text-sm text-slate-900">Zone 04 — General Entry Door</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Trigger Condition</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {incidentState.triggerCondition}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Assigned To</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {incidentState.assignedTo || "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Priority</p>
                  <p className="mt-1 text-sm text-slate-900">{incidentState.priority || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Duration</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {incidentState.openedAtMs !== undefined && incidentState.closedAtMs !== undefined
                      ? `${Math.max(0, Math.round((incidentState.closedAtMs - incidentState.openedAtMs) / 1000))}s`
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Verified By</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {incidentState.verificationRecord?.verifier || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Closure Category</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {incidentState.closureCategory || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Chronology */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Event Chronology</h3>
              <div className="space-y-2 text-sm">
                {timeline.map((row) => (
                  <div key={`${row.timestampMs}-${row.action}`} className="border-l-4 border-blue-300 pl-4 py-2">
                    <div className="grid gap-1 sm:grid-cols-[8rem_7rem_1fr]">
                      <p className="text-xs font-mono text-slate-500">
                        {formatDemoTimestamp(row.timestampMs, { timeStyle: "medium" })}
                      </p>
                      <p className="text-xs font-bold uppercase text-slate-600">{row.stage}</p>
                      <div>
                        <p className="font-bold text-slate-900">{row.actor} · {row.action}</p>
                        <p className="text-sm text-slate-700">{row.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence */}
            {incidentState.evidence.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Attached Evidence ({incidentState.evidence.length})
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {incidentState.evidence.map((evd) => (
                    <div key={evd.id} className="border border-slate-300 p-3">
                      <p className="text-xs font-bold text-slate-600 uppercase">
                        {evd.category}
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {evd.name}
                      </p>
                      {session.getEvidenceAsset(evd.id) && (
                        <Image
                          src={session.getEvidenceAsset(evd.id)!.previewUrl}
                          alt={`Preview of ${evd.name}`}
                          width={240}
                          height={160}
                          unoptimized
                          className="mt-3 h-32 w-full object-cover"
                        />
                      )}
                      <p className="mt-1 text-xs text-slate-600">
                        {formatDemoTimestamp(evd.timestampMs)}
                      </p>
                      {evd.details && (
                        <p className="mt-2 text-xs text-slate-700">
                          {evd.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!reportType && (
          <div className="border border-slate-300 bg-white p-6 text-center text-slate-600">
            <p>Select a report type to view details.</p>
          </div>
        )}

        {reportType && reportType !== "Incident report" && (
          <div className="border border-slate-300 bg-white p-6 text-center text-slate-600">
            <p>Report type &ldquo;{reportType}&rdquo; not yet configured for this demonstration.</p>
          </div>
        )}

        {reportType === "Incident report" && !incidentState.closed && (
          <div className="border border-slate-300 bg-white p-6 text-center text-slate-600">
            <p>Incident report will be available after the incident is closed.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// Main Unified Demonstration Component
// ============================================================

export function UnifiedDemonstration({
  session: sessionProp,
}: {
  readonly session?: DemonstrationSession;
}) {
  const session = sessionProp ?? getSharedDemonstrationSession();
  const [hydrated, setHydrated] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleStartDemo = () => {
    session.start();
    setDemoStarted(true);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading demonstration…</p>
      </div>
    );
  }

  return (
    <div
      data-testid="unified-demonstration"
      className="bg-white"
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-950 px-5 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div>
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-sky-400">
                End-to-End Demonstration
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black">
                VerifAir Operational Workflow
              </h1>
              <p className="mt-4 max-w-3xl text-base text-slate-300">
                Watch how VerifAir brings multiple particulate monitoring points into one operational view, alerts the team when a configured operational trigger is reached, records actions and tracks subsequent conditions, then keeps the evidence together for review.
              </p>
              <p className="mt-3 text-sm text-slate-400">
                💡 This is a simulated demonstration. All readings are demonstration values only.
              </p>
            </div>

          </div>
        </div>
      </header>

      {/* Three-Part Experience */}
      <LiveMonitoringSection
        session={session}
      />
      <section className="border-b border-slate-200 bg-white px-5 py-7 sm:px-8" aria-labelledby="start-demonstration-title">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 border border-sky-200 bg-sky-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-800">Ready when you are</p>
            <h2 id="start-demonstration-title" className="mt-2 text-xl font-black text-slate-950">Follow the alert through the workflow</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">Notice the alert appear on the monitoring hub, then simulate your way through acknowledgement, ownership, response and resolution.</p>
          </div>
          <button
            type="button"
            onClick={handleStartDemo}
            disabled={demoStarted}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-red-900/25 transition hover:bg-red-700 disabled:cursor-default disabled:bg-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            {demoStarted ? "Demo running" : "Start demo"}
          </button>
        </div>
      </section>
      <IncidentWorkspaceSection session={session} />
      <EvidenceAndReportingSection session={session} />

      <footer className="bg-slate-900 px-5 py-6 text-center text-xs text-slate-400 sm:px-8">
        <p>VerifAir Unified Demonstration • No external replay controls</p>
      </footer>
    </div>
  );
}
