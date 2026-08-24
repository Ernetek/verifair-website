"use client";

/**
 * Unified VerifAir Demonstration Experience
 * 
 * Single-page experience showing:
 * 1. Live Monitoring (normal → attention → action)
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
  type ReactNode,
} from "react";
import Image from "next/image";

import { classifyDemonstrationMetric } from "@/lib/demonstration/metric-status";
import { PARTICULATE_UNIT } from "@/lib/metrics";
import {
  type DustlightDeviceStatus,
  type VerifAirOperationalState,
  type VerifAirSystemHealth,
} from "@/lib/product-model";
import { resolveMonitoringPresentation } from "@/lib/demonstration/monitoring-view";
import {
  selectLatestObservation,
} from "@/lib/replay/selectors";
import {
  DemonstrationSession,
  getSharedDemonstrationSession,
} from "@/lib/demonstration/session";
import {
  selectIncidentTimeline,
  type WorkflowPhase,
} from "@/lib/demonstration/incident-domain";

const AEST_TIME_ZONE = "Australia/Sydney";

// Anchor the demo timeline to the moment the page loaded so displayed times track real AEST time.
const DEMONSTRATION_START_MS = Date.now();
const DEMONSTRATION_OPERATOR = "Operator";
const DEMONSTRATION_SYSTEM_HEALTH: VerifAirSystemHealth = "HEALTHY";
const customerWorkflowStages = [
  "CONFIGURED OPERATIONAL CONDITION",
  "ALERT",
  "NOTIFY",
  "ACKNOWLEDGE",
  "ASSIGN",
  "INVESTIGATE",
  "RECORD ACTION",
  "CONTINUE MONITORING",
  "REVIEW",
  "RESOLVE",
] as const;

function formatAEST(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const formatOptions = { ...options };
  const hasTimeStyle = Boolean(formatOptions.timeStyle);
  delete formatOptions.dateStyle;
  delete formatOptions.timeStyle;
  return date.toLocaleString(undefined, {
    timeZone: AEST_TIME_ZONE,
    timeZoneName: "short",
    ...(hasTimeStyle ? { hour: "numeric", minute: "2-digit", second: "2-digit" } : {}),
    ...formatOptions,
  });
}

function formatDemoTimestamp(offsetMs: number, options?: Intl.DateTimeFormatOptions): string {
  return formatAEST(new Date(DEMONSTRATION_START_MS + offsetMs), options);
}

function DeviceShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative overflow-hidden rounded-[1.5rem] border-4 border-slate-950 bg-slate-950 p-1.5 shadow-[0_25px_60px_rgba(15,23,42,0.25)] sm:rounded-[1.75rem] sm:border-[10px] sm:p-2">
        <div className="absolute left-1/2 top-1 z-10 flex -translate-x-1/2 items-center gap-1 sm:top-1.5" aria-hidden="true">
          <span className="h-1 w-8 rounded-full bg-slate-700 sm:w-12" />
          <span className="size-1.5 rounded-full bg-slate-600" />
        </div>
        <div className="overflow-hidden rounded-[1rem] bg-white pt-3 sm:rounded-[1.15rem] sm:pt-4">{children}</div>
        <span className="mx-auto mt-1.5 block h-1 w-16 rounded-full bg-slate-600 sm:hidden" aria-hidden="true" />
      </div>
      <div className="mx-auto hidden h-4 w-28 rounded-b-lg bg-slate-900 sm:block" aria-hidden="true" />
      <div className="mx-auto hidden h-2 w-44 rounded-b-full bg-slate-800 sm:block" aria-hidden="true" />
    </div>
  );
}

// ============================================================
// Live Monitoring Section
// ============================================================

interface MonitorStatus {
  id: string;
  name: string;
  site: string;
  zone: string;
  location: string;
  operationalState: VerifAirOperationalState;
  deviceStatus: DustlightDeviceStatus;
  systemHealth: VerifAirSystemHealth;
  pm25: number;
  pm1: number;
  pm10: number;
  respirableDust: number;
  readingTimestamp: string;
}

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

function determineOperationalState(pm25Value: number): VerifAirOperationalState {
  return classifyDemonstrationMetric("PM2_5", pm25Value).label;
}

const operationalStateStyles: Record<VerifAirOperationalState, string> = {
  NORMAL: "border-emerald-600 bg-emerald-700 text-white",
  ATTENTION: "border-amber-500 bg-amber-400 text-slate-950",
  ACTION: "border-red-600 bg-red-700 text-white",
};

const tileToneStyles: Record<VerifAirOperationalState, string> = {
  NORMAL: "border-t-4 border-emerald-600 bg-emerald-50",
  ATTENTION: "border-t-4 border-amber-500 bg-amber-50",
  ACTION: "border-t-4 border-red-600 bg-red-50",
};

const systemHealthStyles: Record<VerifAirSystemHealth, string> = {
  HEALTHY: "border-emerald-500 bg-emerald-50 text-emerald-900",
  DEGRADED: "border-amber-500 bg-amber-50 text-amber-950",
  STALE: "border-orange-600 bg-orange-50 text-orange-950",
  OFFLINE: "border-slate-600 bg-slate-100 text-slate-950",
};

function stateIcon(state: VerifAirOperationalState | VerifAirSystemHealth) {
  if (state === "NORMAL" || state === "HEALTHY") return "✓";
  if (state === "OFFLINE") return "×";
  return "!";
}

function MonitoringLocationCard({
  monitor,
  wallboard,
}: {
  readonly monitor: MonitorStatus;
  readonly wallboard: boolean;
}) {
  const presentation = resolveMonitoringPresentation(
    monitor.operationalState,
    monitor.systemHealth,
  );
  const freshnessLost = !presentation.observationIsCurrent;

  return (
    <article
      className={`min-w-0 border-x border-b shadow-sm ${
        wallboard ? "p-4 sm:p-5" : "rounded-xl p-4"
      } ${freshnessLost ? "border-t-4 border-slate-400 border-x-slate-200 border-b-slate-200 bg-slate-50" : `${tileToneStyles[monitor.operationalState]} border-x-slate-200 border-b-slate-200`}`}
      data-testid={`monitoring-location-${monitor.id}`}
    >
      <div className="border-b border-slate-200 pb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
          Site · {monitor.site}
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Zone · {monitor.zone}
        </p>
        <h3 className={`${wallboard ? "text-xl" : "text-base"} mt-1 font-black uppercase text-slate-950`}>
          {monitor.name}
        </h3>
        <p className="text-xs text-slate-500">Monitoring location · {monitor.location}</p>
      </div>

      {presentation.observationIsCurrent ? (
        <div className="mt-3">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            VerifAir Operational State
          </p>
          <span
            className={`mt-1 inline-flex min-h-9 items-center gap-2 border-l-4 px-3 text-xs font-black ${operationalStateStyles[monitor.operationalState]}`}
          >
            <span aria-hidden="true">{stateIcon(monitor.operationalState)}</span>
            {monitor.operationalState}
          </span>
        </div>
      ) : (
        <div className={`mt-3 border-l-4 p-3 ${systemHealthStyles[monitor.systemHealth]}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.14em]">Observation status</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-black">
            <span aria-hidden="true">{stateIcon(monitor.systemHealth)}</span>
            {monitor.systemHealth}
          </p>
          <p className="mt-1 text-xs">Last Sensor Reading · {monitor.readingTimestamp}</p>
        </div>
      )}

      <div className={freshnessLost ? "mt-4 opacity-40" : "mt-4"}>
        <div className="border border-blue-200 bg-blue-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-800">
            Respirable Dust
          </p>
          <p
            className={`${wallboard ? "text-4xl sm:text-5xl" : "text-3xl"} mt-1 font-black leading-none text-slate-950`}
            data-testid={`${monitor.id}-RESPIRABLE_DUST-reading`}
          >
            {monitor.respirableDust}{" "}
            <span className="text-xs font-bold text-slate-600">{PARTICULATE_UNIT}</span>
          </p>
        </div>

        <dl className="mt-2 grid grid-cols-3 gap-1.5">
          {[
            ["PM1", monitor.pm1],
            ["PM2.5", monitor.pm25],
            ["PM10", monitor.pm10],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 border border-slate-200 bg-slate-50 p-2 text-center">
              <dt className="text-[9px] font-black uppercase text-slate-500">{label}</dt>
              <dd className={`${wallboard ? "text-lg sm:text-xl" : "text-base"} mt-1 font-black text-slate-950`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-3 text-[10px] leading-4 text-slate-500">
        {freshnessLost ? "Previous operational state" : "Last Sensor Reading"}
        {freshnessLost && presentation.previousOperationalState
          ? ` · ${presentation.previousOperationalState}`
          : ` · ${monitor.readingTimestamp}`}
      </p>

      {!wallboard ? (
        <details className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-600">
          <summary className="min-h-11 cursor-pointer py-3 font-black text-blue-800">
            Monitoring details
          </summary>
          <dl className="grid gap-2 pb-2">
            <div className="flex items-center justify-between gap-3">
              <dt>Dustlight Device Status</dt>
              <dd className="font-black text-slate-950">{monitor.deviceStatus}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt>VerifAir System Health</dt>
              <dd className="font-black text-slate-950">{monitor.systemHealth}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt>Last Sensor Reading</dt>
              <dd className="text-right font-semibold text-slate-950">{monitor.readingTimestamp}</dd>
            </div>
          </dl>
        </details>
      ) : null}
    </article>
  );
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

  const [viewMode, setViewMode] = useState<"CONTROL_CENTRE" | "WALLBOARD">(
    "CONTROL_CENTRE",
  );
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1_000);
    return () => window.clearInterval(id);
  }, []);
  const liveTimeLabel = formatAEST(new Date(nowMs), { timeStyle: "medium" });
  const readingTimestamp = formatAEST(new Date(replayState.timestamp));

  const monitors: readonly MonitorStatus[] = useMemo(() => {
    return [
      {
        id: "WORK_ZONE_A",
        name: "Work Zone",
        site: "Demonstration Project",
        zone: "Zone 01",
        location: "Active work front",
        pm1: observationValue(replayState, "WORK_ZONE_A", "PM1"),
        pm25: observationValue(replayState, "WORK_ZONE_A", "PM2_5"),
        pm10: observationValue(replayState, "WORK_ZONE_A", "PM10"),
        respirableDust: observationValue(replayState, "WORK_ZONE_A", "RESPIRABLE_DUST"),
        operationalState: incidentState.opened ? "ACTION" : determineOperationalState(
          observationValue(replayState, "WORK_ZONE_A", "PM2_5")
        ),
        deviceStatus: "YELLOW",
        systemHealth: "HEALTHY",
        readingTimestamp,
      },
      {
        id: "OCCUPIED_INTERFACE",
        name: "Boundary",
        site: "Demonstration Project",
        zone: "Zone 02",
        location: "Work-zone boundary",
        pm1: observationValue(replayState, "OCCUPIED_INTERFACE", "PM1"),
        pm25: observationValue(replayState, "OCCUPIED_INTERFACE", "PM2_5"),
        pm10: observationValue(replayState, "OCCUPIED_INTERFACE", "PM10"),
        respirableDust: observationValue(replayState, "OCCUPIED_INTERFACE", "RESPIRABLE_DUST"),
        operationalState: determineOperationalState(
          observationValue(replayState, "OCCUPIED_INTERFACE", "PM2_5")
        ),
        deviceStatus: "GREEN",
        systemHealth: "HEALTHY",
        readingTimestamp,
      },
      {
        id: "SHARED_CORRIDOR",
        name: "Corridor",
        site: "Demonstration Project",
        zone: "Zone 03",
        location: "Adjacent corridor",
        pm1: observationValue(replayState, "SHARED_CORRIDOR", "PM1"),
        pm25: observationValue(replayState, "SHARED_CORRIDOR", "PM2_5"),
        pm10: observationValue(replayState, "SHARED_CORRIDOR", "PM10"),
        respirableDust: observationValue(replayState, "SHARED_CORRIDOR", "RESPIRABLE_DUST"),
        operationalState: determineOperationalState(
          observationValue(replayState, "SHARED_CORRIDOR", "PM2_5")
        ),
        deviceStatus: "GREEN",
        systemHealth: "HEALTHY",
        readingTimestamp,
      },
      {
        id: "EXTERNAL_BOUNDARY",
        name: "Occupied Area",
        site: "Demonstration Project",
        zone: "Zone 04",
        location: "Occupied/sensitive area",
        pm1: observationValue(replayState, "EXTERNAL_BOUNDARY", "PM1"),
        pm25: observationValue(replayState, "EXTERNAL_BOUNDARY", "PM2_5"),
        pm10: observationValue(replayState, "EXTERNAL_BOUNDARY", "PM10"),
        respirableDust: observationValue(replayState, "EXTERNAL_BOUNDARY", "RESPIRABLE_DUST"),
        operationalState: determineOperationalState(
          observationValue(replayState, "EXTERNAL_BOUNDARY", "PM2_5")
        ),
        deviceStatus: "GREEN",
        systemHealth: "HEALTHY",
        readingTimestamp,
      },
    ];
  }, [replayState, incidentState.opened, readingTimestamp]);

  const wallboard = viewMode === "WALLBOARD";

  return (
    <section
      id="monitoring"
      className="border-b border-slate-200 bg-[#dfe5eb] px-5 py-8 sm:px-8"
    >
      <div className="mx-auto mb-4 flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">Step 1 · ASSESS</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Control Centre monitoring</h2>
        </div>
        <div className="inline-flex border border-slate-300 bg-white p-1" aria-label="Monitoring view">
          {(["CONTROL_CENTRE", "WALLBOARD"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={viewMode === mode}
              onClick={() => setViewMode(mode)}
              className="min-h-11 px-3 text-xs font-black uppercase tracking-[0.08em] text-slate-700 aria-pressed:bg-blue-700 aria-pressed:text-white"
            >
              {mode === "CONTROL_CENTRE" ? "Control Centre" : "Wallboard / Display Mode"}
            </button>
          ))}
        </div>
      </div>

      <DeviceShell>
        <div className={`${wallboard ? "bg-slate-950" : "bg-[#0f6cab]"} px-4 py-4 text-white sm:px-5`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-300">
                {wallboard ? "Wallboard · VerifAir Platform browser view" : "Control Centre"}
              </p>
              <h3 className="mt-1 text-lg font-black sm:text-xl">Demonstration Project</h3>
              <p className="text-xs text-slate-300">Occupied Healthcare Refurbishment</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-black">{liveTimeLabel}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-sky-200 bg-sky-50 px-4 py-3 text-xs leading-5 text-slate-700 sm:px-5">
          <strong className="font-black text-slate-900">VerifAir Operational State:</strong> NORMAL, ATTENTION or ACTION from the project&apos;s configured operational trigger model.
        </div>

        <div className={`${wallboard ? "bg-slate-900" : "bg-[#edf2f7]"} p-3 sm:p-5`}>
          <div
            data-testid={wallboard ? "wallboard-monitor-grid" : "control-centre-monitor-grid"}
            className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
          >
            {monitors.map((monitor) => (
              <MonitoringLocationCard key={monitor.id} monitor={monitor} wallboard={wallboard} />
            ))}
          </div>

          <section
            aria-labelledby="system-health-title"
            className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-slate-300 bg-white p-3 text-xs shadow-sm sm:p-4"
          >
            <h3 id="system-health-title" className="flex items-center gap-2 font-black uppercase tracking-[0.08em] text-slate-950">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-emerald-500" />
              System Health · {DEMONSTRATION_SYSTEM_HEALTH}
            </h3>
            <span className="font-semibold text-slate-700">4/4 monitoring locations reporting</span>
          </section>
        </div>
      </DeviceShell>
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
    message: "Click Acknowledge, assign to me and start work to take ownership of the incident and begin the investigation in one step.",
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
    label: "Resolve and close",
    message: "Verification is sufficient to close. Select the closer and resolution category, add a summary, then resolve the incident.",
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

  const handleDemoImageAttach = () => {
    attachEvidence(
      "VerifAir site investigation reference",
      "/assets/workflow-site-investigation.webp",
    );
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
    session.dispatchIncidentEvent({
      type: "INVESTIGATION_STARTED",
      startedBy: DEMONSTRATION_OPERATOR,
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
      <section id="incident" className="border-b border-slate-200 bg-white px-5 py-8 sm:px-8">
        <span id="workflow" className="sr-only" aria-hidden="true" />
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-black uppercase tracking-wider text-blue-700">
            Step 2 · ACT
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
            Awaiting action condition
          </h2>
          <div className="mt-6">
            <DeviceShell>
              <div className="min-h-44 bg-slate-50 p-5 sm:p-8">
              <p className="text-sm text-slate-700">
                When a configured operational trigger is reached, an incident will be automatically opened here for response and investigation.
              </p>
              </div>
            </DeviceShell>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="incident"
      className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8"
    >
      <span id="workflow" className="sr-only" aria-hidden="true" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-wider text-blue-700">
            Step 2 · ACT
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
            Operational response workflow
          </h2>
        </div>

        <DeviceShell>
          <div className="p-3 sm:p-5">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-8">
          <main className="min-w-0 lg:max-w-4xl">
        {/* Incident Header Card */}
        <div className="max-w-3xl border-2 border-slate-300 bg-slate-50 p-4 mb-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mb-4 max-w-3xl">
          <p className="text-xs font-bold text-slate-700 uppercase mb-2">Workflow Progress</p>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 lg:grid-cols-10">
            {customerWorkflowStages.map((stage, index) => {
              const workflowIndex = !incidentState.acknowledged
                ? 3
                : !incidentState.assignedTo
                ? 4
                : !incidentState.investigationStarted
                ? 5
                : incidentState.investigationNotes.length === 0 && incidentState.responses.length === 0
                ? 5
                : !incidentState.verificationStarted && !incidentState.verificationRecord
                ? 7
                : !incidentState.verificationRecord
                ? 8
                : !incidentState.closed
                ? 9
                : 10;
              const isActive = index === workflowIndex;
              const isPast = index < workflowIndex;
              const isCompleted = incidentState.closed;
              return (
                <div
                  key={stage}
                  className={`border px-1 py-2 text-center text-[10px] font-bold leading-4 transition-all sm:text-xs ${
                    isActive
                      ? "border-blue-700 bg-blue-700 text-white"
                      : isPast || isCompleted
                      ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                      : "border-slate-300 bg-slate-100 text-slate-600"
                  }`}
                >
                  {stage}
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
                Acknowledge, assign to me and start work
              </h3>
              <p className="mt-1 text-sm text-slate-700">
                An action condition has been detected. Confirm receipt, take ownership and begin the investigation.
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
                Acknowledge, assign to me and start work
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

            {/* Website-hosted demonstration evidence */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-700 uppercase mb-3">
                Demonstration image evidence (optional)
              </p>
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center bg-sky-700 px-4 font-black text-white text-sm hover:bg-sky-800"
                onClick={handleDemoImageAttach}
              >
                Upload image
              </button>
              {photoEvidence && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Image
                    src={photoEvidence.dataUrl}
                    alt="VerifAir site investigation demonstration"
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
                    <option value="Further site review required">Further site review required</option>
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

            {/* Website-hosted demonstration evidence */}
            {!photoEvidence && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 uppercase mb-3">
                  Demonstration image evidence (optional)
                </p>
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center bg-slate-900 px-4 font-black text-white text-sm"
                  onClick={handleDemoImageAttach}
                >
                  Upload image
                </button>
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
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-800">Resolution required</p>
              <h3 className="mt-2 text-xl font-black text-slate-950">
                Resolve and close this incident
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Verification is complete and the incident is ready for its final resolution record. Confirm who resolved it, select the outcome category, and record the closing summary.
              </p>
            </div>
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
              Resolve incident
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
                {selectIncidentTimeline(incidentState).slice(-4).map((row, index) => (
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
        </DeviceShell>
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
  const { incidentState, replayState } = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
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
    }
  }, [incidentState.closed]);

  return (
    <section
      ref={reportingRef}
      id="evidence"
      className="border-b border-slate-200 bg-slate-50 px-5 py-6 sm:px-8"
    >
      <span id="reportpreview" className="sr-only" aria-hidden="true" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-wider text-sky-700">
            Step 3 · REPORT
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
            Connected operational history and generated report
          </h2>
        </div>

        <DeviceShell>
          <div className="p-3 sm:p-5">
          <div className="border-2 border-blue-300 bg-blue-50 p-3 sm:p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">GENERATED REPORT</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">Incident evidence and operational record</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              This report is generated from the same simulated monitoring event and response records progressed through ASSESS and ACT.
            </p>
          </div>

          <div className="mt-4 space-y-4">
            {/* Incident Summary */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Incident Summary</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Incident ID</p>
                  <p className="mt-1 text-sm font-mono text-slate-900">
                    {incidentState.incidentId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Status</p>
                  <p className="mt-1 text-sm text-slate-900">{incidentState.closed ? "Resolved" : incidentState.phase}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Report generated</p>
                  <p className="mt-1 text-sm text-slate-900">{formatAEST(new Date())}</p>
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
                    {incidentState.closedAtMs !== undefined ? formatDemoTimestamp(incidentState.closedAtMs) : "In progress"}
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

            {/* Monitoring history */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Monitoring history</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-500">Latest observation</p><p className="mt-1 text-sm font-bold text-slate-900">{formatDemoTimestamp(replayState.offsetMs, { timeStyle: "medium" })}</p></div>
                <div className="border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-500">Monitoring location</p><p className="mt-1 text-sm font-bold text-slate-900">Zone 04 — General Entry Door</p></div>
                <div className="border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-500">Monitoring state</p><p className="mt-1 text-sm font-bold text-slate-900">{incidentState.closed ? "Continuing after resolution" : "Current observations available"}</p></div>
              </div>
            </div>

            {/* Chronology */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Event timeline</h3>
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

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Observations", `${replayState.monitorStates.flatMap((monitor) => monitor.latestObservations).length} current scenario observations connected.`],
                ["Configured trigger / event", incidentState.triggerCondition || "Pending"],
                ["Notifications", timeline.filter((row) => /alert|notifi/i.test(`${row.action} ${row.details}`)).map((row) => `${row.actor}: ${row.details}`).join(" ") || "Recorded in event timeline."],
                ["Comments", incidentState.responseNotes.map((note) => note.note).join(" ") || "No additional comments recorded."],
                ["Continued monitoring", "Observations remain part of the operational record after the event."],
                ["Evidence", incidentState.evidence.length > 0 ? `${incidentState.evidence.length} evidence item(s) connected.` : "Pending"],
                ["Generated report", "Generated from this same deterministic operational event."],
              ].map(([title, value]) => (
                <div key={title} className="border border-slate-200 bg-slate-50 p-3">
                  <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-600">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Evidence */}
            {incidentState.evidence.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Evidence ({incidentState.evidence.length})
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
          </div>
        </DeviceShell>
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
  const workspaceScrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    return () => {
      if (workspaceScrollTimerRef.current !== null) {
        window.clearTimeout(workspaceScrollTimerRef.current);
      }
    };
  }, []);

  const handleStartDemo = () => {
    session.start();
    setDemoStarted(true);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("monitoring")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });

    if (workspaceScrollTimerRef.current !== null) {
      window.clearTimeout(workspaceScrollTimerRef.current);
    }
    // Hold on the monitoring screen for 5s so the status colour change is visible,
    // then move to the acknowledge-alert workspace.
    workspaceScrollTimerRef.current = window.setTimeout(() => {
      workspaceScrollTimerRef.current = null;
      const workspace = document.getElementById("incident");
      if (workspace?.contains(document.activeElement)) return;
      workspace?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 5_000);
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
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                SEE VERIFAIR IN ACTION.
              </h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
                One connected operational view from particulate readings through response and record.
              </p>
              <p className="mt-3 text-lg font-black tracking-[0.12em] text-sky-200">
                ASSESS → ACT → REPORT
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Demonstration only. Sites, events, people and readings shown are fictional and are used to demonstrate VerifAir functionality.
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
