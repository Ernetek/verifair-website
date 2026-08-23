/**
 * VerifAir Canonical Incident Domain Model
 * 
 * Defines deterministic event types, incident state, reducer logic,
 * invalid transition safety rules, and selectors for the operational workflow.
 * 
 * Rules:
 * - 6 canonical visible workflow phases: Alert -> Acknowledge -> Assign -> Investigate -> Verify -> Close (-> Closed)
 * - Escalation is non-linear and does not alter the primary workflow phase.
 * - Verification must yield "sufficient_to_close" before Closure is permitted.
 * - Verification with "further_action_required" reverts phase to Investigate.
 * - Dispatches on closed incidents or invalid phase transitions yield typed errors.
 * - Canonical evidence models store metadata references only; browser dataUrls remain in UI layer.
 */

export type WorkflowPhase =
  | "Alert"
  | "Acknowledge"
  | "Assign"
  | "Investigate"
  | "Verify"
  | "Close"
  | "Closed";

export interface CanonicalEvidence {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly details?: string;
  readonly actor?: string;
  readonly context?: string;
  readonly timestampMs: number;
}

export interface VerificationRecord {
  readonly verifier: string;
  readonly outcome: "sufficient_to_close" | "further_action_required";
  readonly notes: string;
  readonly timestampMs: number;
}

export type IncidentEvent =
  | {
      readonly type: "INCIDENT_OPENED";
      readonly incidentId: string;
      readonly monitorId: string;
      readonly triggerCondition: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "ACKNOWLEDGED";
      readonly incidentId: string;
      readonly acknowledgedBy: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "ASSIGNED";
      readonly incidentId: string;
      readonly assigneeGroup?: string;
      readonly assignee: string;
      readonly priority?: "Normal" | "High" | "Urgent";
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "INVESTIGATION_STARTED";
      readonly incidentId: string;
      readonly startedBy: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "RESPONSE_NOTE_ADDED";
      readonly incidentId: string;
      readonly author: string;
      readonly note: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "PROGRESS_UPDATED";
      readonly incidentId: string;
      readonly status: string;
      readonly details?: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "INVESTIGATION_UPDATED";
      readonly incidentId: string;
      readonly status: string;
      readonly notes: string;
      readonly observedConditions: string;
      readonly actionTaken: string;
      readonly actor: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "RESPONSE_RECORDED";
      readonly incidentId: string;
      readonly responseType: string;
      readonly details: string;
      readonly performedBy: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "EVIDENCE_ATTACHED";
      readonly incidentId: string;
      readonly evidenceId: string;
      readonly name: string;
      readonly category: string;
      readonly details?: string;
      readonly actor?: string;
      readonly context?: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "ESCALATED";
      readonly incidentId: string;
      readonly escalatedBy: string;
      readonly reason: string;
      readonly target?: string;
      readonly details?: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "VERIFICATION_STARTED";
      readonly incidentId: string;
      readonly verifier: string;
      readonly requestedBy?: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "VERIFICATION_COMPLETED";
      readonly incidentId: string;
      readonly verifier: string;
      readonly outcome: "sufficient_to_close" | "further_action_required";
      readonly notes: string;
      readonly timestampMs: number;
      readonly sequence: number;
    }
  | {
      readonly type: "INCIDENT_CLOSED";
      readonly incidentId: string;
      readonly category: string;
      readonly details: string;
      readonly closedBy: string;
      readonly timestampMs: number;
      readonly sequence: number;
    };

export interface IncidentState {
  readonly incidentId: string;
  readonly monitorId: string;
  readonly triggerCondition: string;
  readonly opened: boolean;
  readonly acknowledged: boolean;
  readonly acknowledgedBy?: string;
  readonly assignedGroup?: string;
  readonly assignedTo?: string;
  readonly priority?: "Normal" | "High" | "Urgent";
  readonly openedAtMs?: number;
  readonly closedAtMs?: number;
  readonly investigationStarted: boolean;
  readonly investigationStatus?: string;
  readonly investigationNotes: readonly {
    readonly actor: string;
    readonly status: string;
    readonly notes: string;
    readonly observedConditions: string;
    readonly actionTaken: string;
    readonly timestampMs: number;
  }[];
  readonly isEscalated: boolean;
  readonly escalationReason?: string;
  readonly escalationTarget?: string;
  readonly escalationDetails?: string;
  readonly progressStatus: string;
  readonly responseNotes: readonly { author: string; note: string; timestampMs: number }[];
  readonly responses: readonly {
    readonly responseType: string;
    readonly details: string;
    readonly performedBy: string;
    readonly timestampMs: number;
  }[];
  readonly verificationStarted: boolean;
  readonly verificationRecord?: VerificationRecord;
  readonly closed: boolean;
  readonly closureCategory?: string;
  readonly closureDetails?: string;
  readonly closedBy?: string;
  readonly phase: WorkflowPhase;
  readonly evidence: readonly CanonicalEvidence[];
  readonly events: readonly IncidentEvent[];
  readonly permittedActions: readonly string[];
}

export type DomainResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string };

export function createInitialIncidentState(
  incidentId: string = "INC-0042",
  monitorId: string = "MON-004",
  triggerCondition: string = "Action condition detected",
): IncidentState {
  return {
    incidentId,
    monitorId,
    triggerCondition,
    opened: false,
    acknowledged: false,
    investigationNotes: [],
    investigationStarted: false,
    isEscalated: false,
    progressStatus: "Unopened",
    responseNotes: [],
    responses: [],
    verificationStarted: false,
    closed: false,
    phase: "Alert",
    evidence: [],
    events: [],
    permittedActions: ["INCIDENT_OPENED"],
  };
}

function derivePermittedActions(
  closed: boolean,
  phase: WorkflowPhase,
  verificationRecord?: VerificationRecord,
): readonly string[] {
  if (closed) return [];

  switch (phase) {
    case "Alert":
      return ["ACKNOWLEDGE"];
    case "Acknowledge":
      return ["ASSIGN"];
    case "Assign":
      return ["INVESTIGATION_STARTED"];
    case "Investigate":
      return [
        "PROGRESS_UPDATED",
        "RESPONSE_NOTE_ADDED",
        "EVIDENCE_ATTACHED",
        "ESCALATED",
        "VERIFICATION_STARTED",
      ];
    case "Verify":
      return [
        "VERIFICATION_COMPLETED",
        "RESPONSE_NOTE_ADDED",
        "EVIDENCE_ATTACHED",
      ];
    case "Close":
      if (verificationRecord?.outcome === "sufficient_to_close") {
        return ["INCIDENT_CLOSED", "EVIDENCE_ATTACHED", "RESPONSE_NOTE_ADDED"];
      }
      return ["EVIDENCE_ATTACHED"];
    default:
      return [];
  }
}

export function reduceIncidentEvent(
  state: IncidentState,
  event: IncidentEvent,
): DomainResult<IncidentState> {
  if (state.closed) {
    return {
      ok: false,
      error: `Cannot process event '${event.type}' on closed incident '${state.incidentId}'.`,
    };
  }

  // Ensure deterministic sequence check
  const updatedEvents = [...state.events, event].sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    return a.sequence - b.sequence;
  });

  switch (event.type) {
    case "INCIDENT_OPENED": {
      if (state.opened) {
        return { ok: false, error: "Incident is already opened." };
      }
      const nextState: IncidentState = {
        ...state,
        incidentId: event.incidentId,
        monitorId: event.monitorId,
        triggerCondition: event.triggerCondition,
        opened: true,
        openedAtMs: event.timestampMs,
        progressStatus: "Alert opened",
        phase: "Alert",
        events: updatedEvents,
        permittedActions: derivePermittedActions(false, "Alert"),
      };
      return { ok: true, value: nextState };
    }

    case "ACKNOWLEDGED": {
      if (!state.opened) {
        return { ok: false, error: "Cannot acknowledge unopened incident." };
      }
      if (state.acknowledged) {
        return { ok: false, error: "Incident is already acknowledged." };
      }
      const nextState: IncidentState = {
        ...state,
        acknowledged: true,
        acknowledgedBy: event.acknowledgedBy,
        progressStatus: "Acknowledged",
        phase: "Acknowledge",
        events: updatedEvents,
        permittedActions: derivePermittedActions(false, "Acknowledge"),
      };
      return { ok: true, value: nextState };
    }

    case "ASSIGNED": {
      if (!state.acknowledged) {
        return { ok: false, error: "Cannot assign incident before acknowledgement." };
      }
      const nextState: IncidentState = {
        ...state,
        assignedGroup: event.assigneeGroup ?? state.assignedGroup,
        assignedTo: event.assignee,
        priority: event.priority ?? state.priority,
        progressStatus: `Assigned to ${event.assignee}`,
        phase: "Assign",
        events: updatedEvents,
        permittedActions: derivePermittedActions(false, "Assign"),
      };
      return { ok: true, value: nextState };
    }

    case "INVESTIGATION_STARTED": {
      if (!state.assignedTo) {
        return { ok: false, error: "Cannot start investigation before assignment." };
      }
      const nextState: IncidentState = {
        ...state,
        investigationStarted: true,
        progressStatus: "Investigation in progress",
        phase: "Investigate",
        events: updatedEvents,
        permittedActions: derivePermittedActions(false, "Investigate"),
      };
      return { ok: true, value: nextState };
    }

    case "RESPONSE_NOTE_ADDED": {
      if (!state.investigationStarted && state.phase === "Alert") {
        return { ok: false, error: "Cannot add response note before incident is in progress." };
      }
      const newNote = {
        author: event.author,
        note: event.note,
        timestampMs: event.timestampMs,
      };
      const nextState: IncidentState = {
        ...state,
        responseNotes: [...state.responseNotes, newNote],
        events: updatedEvents,
      };
      return { ok: true, value: nextState };
    }

    case "INVESTIGATION_UPDATED": {
      if (state.phase !== "Investigate") {
        return { ok: false, error: "Cannot update investigation outside investigation phase." };
      }
      const nextState: IncidentState = {
        ...state,
        investigationStatus: event.status,
        investigationNotes: [
          ...state.investigationNotes,
          {
            actor: event.actor,
            status: event.status,
            notes: event.notes,
            observedConditions: event.observedConditions,
            actionTaken: event.actionTaken,
            timestampMs: event.timestampMs,
          },
        ],
        progressStatus: event.status,
        events: updatedEvents,
      };
      return { ok: true, value: nextState };
    }

    case "RESPONSE_RECORDED": {
      if (state.phase !== "Investigate" && state.phase !== "Verify") {
        return { ok: false, error: "Cannot record a response outside an active investigation." };
      }
      const nextState: IncidentState = {
        ...state,
        responses: [
          ...state.responses,
          {
            responseType: event.responseType,
            details: event.details,
            performedBy: event.performedBy,
            timestampMs: event.timestampMs,
          },
        ],
        events: updatedEvents,
      };
      return { ok: true, value: nextState };
    }

    case "PROGRESS_UPDATED": {
      if (state.phase !== "Investigate") {
        return { ok: false, error: "Cannot update progress outside investigation phase." };
      }
      const nextState: IncidentState = {
        ...state,
        progressStatus: event.status,
        events: updatedEvents,
        permittedActions: derivePermittedActions(false, state.phase, state.verificationRecord),
      };
      return { ok: true, value: nextState };
    }

    case "EVIDENCE_ATTACHED": {
      const newEvidence: CanonicalEvidence = {
        id: event.evidenceId,
        name: event.name,
        category: event.category,
        details: event.details,
        actor: event.actor,
        context: event.context,
        timestampMs: event.timestampMs,
      };
      const nextState: IncidentState = {
        ...state,
        evidence: [...state.evidence, newEvidence],
        events: updatedEvents,
      };
      return { ok: true, value: nextState };
    }

    case "ESCALATED": {
      if (!state.opened) {
        return { ok: false, error: "Cannot escalate unopened incident." };
      }
      // Escalation does not change primary workflow phase
      const nextState: IncidentState = {
        ...state,
        isEscalated: true,
        escalationReason: event.reason,
        escalationTarget: event.target,
        escalationDetails: event.details,
        events: updatedEvents,
      };
      return { ok: true, value: nextState };
    }

    case "VERIFICATION_STARTED": {
      if (state.phase !== "Investigate") {
        return { ok: false, error: "Verification can only be started from investigation phase." };
      }
      const nextState: IncidentState = {
        ...state,
        verificationStarted: true,
        progressStatus: "Verification in progress",
        phase: "Verify",
        events: updatedEvents,
        permittedActions: derivePermittedActions(false, "Verify"),
      };
      return { ok: true, value: nextState };
    }

    case "VERIFICATION_COMPLETED": {
      if (state.phase !== "Verify") {
        return { ok: false, error: "Cannot complete verification outside verification phase." };
      }
      const record: VerificationRecord = {
        verifier: event.verifier,
        outcome: event.outcome,
        notes: event.notes,
        timestampMs: event.timestampMs,
      };

      if (event.outcome === "sufficient_to_close") {
        const nextState: IncidentState = {
          ...state,
          verificationRecord: record,
          progressStatus: "Verified — Ready to close",
          phase: "Close",
          events: updatedEvents,
          permittedActions: derivePermittedActions(false, "Close", record),
        };
        return { ok: true, value: nextState };
      } else {
        // further_action_required: loop back to Investigate phase
        const nextState: IncidentState = {
          ...state,
          verificationRecord: record,
          progressStatus: "Further action required — Re-investigating",
          phase: "Investigate",
          events: updatedEvents,
          permittedActions: derivePermittedActions(false, "Investigate"),
        };
        return { ok: true, value: nextState };
      }
    }

    case "INCIDENT_CLOSED": {
      if (state.phase !== "Close") {
        return {
          ok: false,
          error: `Cannot close incident in '${state.phase}' phase. Successful verification is required.`,
        };
      }
      if (state.verificationRecord?.outcome !== "sufficient_to_close") {
        return {
          ok: false,
          error: "Closure requires a verification outcome of 'sufficient_to_close'.",
        };
      }

      const nextState: IncidentState = {
        ...state,
        closed: true,
        closedAtMs: event.timestampMs,
        closureCategory: event.category,
        closureDetails: event.details,
        closedBy: event.closedBy,
        progressStatus: "Incident closed",
        phase: "Closed",
        events: updatedEvents,
        permittedActions: [],
      };
      return { ok: true, value: nextState };
    }

    default:
      return { ok: false, error: "Unknown event type." };
  }
}

/**
 * Pure helper to compute IncidentState from a list of events starting from initial state
 */
export function reduceIncident(
  events: readonly IncidentEvent[],
  initialState: IncidentState = createInitialIncidentState(),
): IncidentState {
  const sorted = [...events].sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    return a.sequence - b.sequence;
  });

  let current = initialState;
  for (const event of sorted) {
    const res = reduceIncidentEvent(current, event);
    if (res.ok) {
      current = res.value;
    }
  }
  return current;
}

export interface IncidentTimelineRow {
  readonly timestampMs: number;
  readonly stage: string;
  readonly actor: string;
  readonly action: string;
  readonly details: string;
}

export function selectIncidentTimeline(
  state: IncidentState,
): readonly IncidentTimelineRow[] {
  return state.events.map((event) => {
    switch (event.type) {
      case "INCIDENT_OPENED":
        return { timestampMs: event.timestampMs, stage: "Alert", actor: "VerifAir", action: "Incident opened", details: event.triggerCondition };
      case "ACKNOWLEDGED":
        return { timestampMs: event.timestampMs, stage: "Acknowledge", actor: event.acknowledgedBy, action: "Alert acknowledged", details: "Operator confirmed receipt." };
      case "ASSIGNED":
        return { timestampMs: event.timestampMs, stage: "Assign", actor: event.assignee, action: `Assigned to ${event.assignee}`, details: event.priority ? `Priority: ${event.priority}` : "Incident assignment" };
      case "INVESTIGATION_STARTED":
        return { timestampMs: event.timestampMs, stage: "Investigate", actor: event.startedBy, action: "Investigation started", details: "Site investigation opened." };
      case "INVESTIGATION_UPDATED":
        return { timestampMs: event.timestampMs, stage: "Investigate", actor: event.actor, action: "Investigation updated", details: `${event.status}. ${event.notes}` };
      case "RESPONSE_RECORDED":
        return { timestampMs: event.timestampMs, stage: "Investigate", actor: event.performedBy, action: event.responseType, details: event.details };
      case "RESPONSE_NOTE_ADDED":
        return { timestampMs: event.timestampMs, stage: "Investigate", actor: event.author, action: "Response note added", details: event.note };
      case "PROGRESS_UPDATED":
        return { timestampMs: event.timestampMs, stage: "Investigate", actor: "Operator", action: "Progress updated", details: event.details ? `${event.status}. ${event.details}` : event.status };
      case "ESCALATED":
        return { timestampMs: event.timestampMs, stage: "Investigate", actor: event.escalatedBy, action: "Incident escalated", details: `${event.reason}${event.target ? ` to ${event.target}` : ""}${event.details ? `. ${event.details}` : ""}` };
      case "EVIDENCE_ATTACHED":
        return { timestampMs: event.timestampMs, stage: "Evidence", actor: event.actor ?? "Operator", action: "Evidence attached", details: `${event.name}${event.context ? `. ${event.context}` : ""}` };
      case "VERIFICATION_STARTED":
        return { timestampMs: event.timestampMs, stage: "Verify", actor: event.requestedBy ?? "Operator", action: "Verification requested", details: `Verification assigned to ${event.verifier}.` };
      case "VERIFICATION_COMPLETED":
        return { timestampMs: event.timestampMs, stage: "Verify", actor: event.verifier, action: "Verification completed", details: `${event.outcome}. ${event.notes}` };
      case "INCIDENT_CLOSED":
        return { timestampMs: event.timestampMs, stage: "Close", actor: event.closedBy, action: "Incident closed", details: `${event.category}. ${event.details}` };
    }
  });
}
