import { describe, expect, it } from "vitest";

import {
  createInitialIncidentState,
  reduceIncident,
  reduceIncidentEvent,
  type IncidentEvent,
} from "@/lib/demonstration/incident-domain";

describe("Incident Domain", () => {
  it("executes happy-path lifecycle", () => {
    let state = createInitialIncidentState("INC-0042", "MON-004");
    expect(state.phase).toBe("Alert");

    const e1: IncidentEvent = {
      type: "INCIDENT_OPENED",
      incidentId: "INC-0042",
      monitorId: "MON-004",
      triggerCondition: "Action condition detected",
      timestampMs: 120_000,
      sequence: 1,
    };
    let res = reduceIncidentEvent(state, e1);
    expect(res.ok).toBe(true);
    if (res.ok) state = res.value;
    expect(state.opened).toBe(true);
    expect(state.phase).toBe("Alert");

    const e2: IncidentEvent = {
      type: "ACKNOWLEDGED",
      incidentId: "INC-0042",
      acknowledgedBy: "Jordan Lee",
      timestampMs: 125_000,
      sequence: 2,
    };
    res = reduceIncidentEvent(state, e2);
    expect(res.ok).toBe(true);
    if (res.ok) state = res.value;
    expect(state.acknowledged).toBe(true);
    expect(state.phase).toBe("Acknowledge");

    const e3: IncidentEvent = {
      type: "ASSIGNED",
      incidentId: "INC-0042",
      assignee: "Jordan Lee",
      timestampMs: 130_000,
      sequence: 3,
    };
    res = reduceIncidentEvent(state, e3);
    expect(res.ok).toBe(true);
    if (res.ok) state = res.value;
    expect(state.assignedTo).toBe("Jordan Lee");
    expect(state.phase).toBe("Assign");

    const e4: IncidentEvent = {
      type: "INVESTIGATION_STARTED",
      incidentId: "INC-0042",
      startedBy: "Jordan Lee",
      timestampMs: 140_000,
      sequence: 4,
    };
    res = reduceIncidentEvent(state, e4);
    expect(res.ok).toBe(true);
    if (res.ok) state = res.value;
    expect(state.investigationStarted).toBe(true);
    expect(state.phase).toBe("Investigate");

    const e5: IncidentEvent = {
      type: "VERIFICATION_STARTED",
      incidentId: "INC-0042",
      verifier: "Maria Chen",
      timestampMs: 240_000,
      sequence: 5,
    };
    res = reduceIncidentEvent(state, e5);
    expect(res.ok).toBe(true);
    if (res.ok) state = res.value;
    expect(state.phase).toBe("Verify");

    const e6: IncidentEvent = {
      type: "VERIFICATION_COMPLETED",
      incidentId: "INC-0042",
      verifier: "Maria Chen",
      outcome: "sufficient_to_close",
      notes: "Area checked and control measures verified.",
      timestampMs: 300_000,
      sequence: 6,
    };
    res = reduceIncidentEvent(state, e6);
    expect(res.ok).toBe(true);
    if (res.ok) state = res.value;
    expect(state.phase).toBe("Close");

    const e7: IncidentEvent = {
      type: "INCIDENT_CLOSED",
      incidentId: "INC-0042",
      category: "False positive",
      details: "Temporary dust flare resolved upon water misting.",
      closedBy: "Maria Chen",
      timestampMs: 360_000,
      sequence: 7,
    };
    res = reduceIncidentEvent(state, e7);
    expect(res.ok).toBe(true);
    if (res.ok) state = res.value;
    expect(state.closed).toBe(true);
    expect(state.phase).toBe("Closed");
  });

  it("rejects closure before verification", () => {
    let state = createInitialIncidentState();
    const open: IncidentEvent = { type: "INCIDENT_OPENED", incidentId: "INC-0042", monitorId: "MON-004", triggerCondition: "Action", timestampMs: 100, sequence: 1 };
    const ack: IncidentEvent = { type: "ACKNOWLEDGED", incidentId: "INC-0042", acknowledgedBy: "Jordan", timestampMs: 200, sequence: 2 };
    const assign: IncidentEvent = { type: "ASSIGNED", incidentId: "INC-0042", assignee: "Jordan", timestampMs: 300, sequence: 3 };
    const inv: IncidentEvent = { type: "INVESTIGATION_STARTED", incidentId: "INC-0042", startedBy: "Jordan", timestampMs: 400, sequence: 4 };

    state = reduceIncident([open, ack, assign, inv]);
    expect(state.phase).toBe("Investigate");

    const closeAttempt: IncidentEvent = {
      type: "INCIDENT_CLOSED",
      incidentId: "INC-0042",
      category: "Controls adjusted",
      details: "Premature close",
      closedBy: "Jordan",
      timestampMs: 500,
      sequence: 5,
    };

    const res = reduceIncidentEvent(state, closeAttempt);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toContain("Cannot close incident in 'Investigate' phase");
    }
  });

  it("handles verification further-action loop", () => {
    const events: IncidentEvent[] = [
      { type: "INCIDENT_OPENED", incidentId: "INC-0042", monitorId: "MON-004", triggerCondition: "Action", timestampMs: 100, sequence: 1 },
      { type: "ACKNOWLEDGED", incidentId: "INC-0042", acknowledgedBy: "Jordan", timestampMs: 200, sequence: 2 },
      { type: "ASSIGNED", incidentId: "INC-0042", assignee: "Jordan", timestampMs: 300, sequence: 3 },
      { type: "INVESTIGATION_STARTED", incidentId: "INC-0042", startedBy: "Jordan", timestampMs: 400, sequence: 4 },
      { type: "VERIFICATION_STARTED", incidentId: "INC-0042", verifier: "Maria", timestampMs: 500, sequence: 5 },
      { type: "VERIFICATION_COMPLETED", incidentId: "INC-0042", verifier: "Maria", outcome: "further_action_required", notes: "Dust still rising", timestampMs: 600, sequence: 6 },
    ];

    const state = reduceIncident(events);
    expect(state.phase).toBe("Investigate");
    expect(state.progressStatus).toContain("Further action required");
    expect(state.verificationRecord?.outcome).toBe("further_action_required");
  });

  it("handles escalation without changing workflow phase", () => {
    const events: IncidentEvent[] = [
      { type: "INCIDENT_OPENED", incidentId: "INC-0042", monitorId: "MON-004", triggerCondition: "Action", timestampMs: 100, sequence: 1 },
      { type: "ACKNOWLEDGED", incidentId: "INC-0042", acknowledgedBy: "Jordan", timestampMs: 200, sequence: 2 },
      { type: "ASSIGNED", incidentId: "INC-0042", assignee: "Jordan", timestampMs: 300, sequence: 3 },
      { type: "INVESTIGATION_STARTED", incidentId: "INC-0042", startedBy: "Jordan", timestampMs: 400, sequence: 4 },
      { type: "ESCALATED", incidentId: "INC-0042", escalatedBy: "Jordan", reason: "Wind speed increasing", timestampMs: 450, sequence: 5 },
    ];

    const state = reduceIncident(events);
    expect(state.phase).toBe("Investigate");
    expect(state.isEscalated).toBe(true);
    expect(state.escalationReason).toBe("Wind speed increasing");
  });

  it("rejects events after closure", () => {
    const events: IncidentEvent[] = [
      { type: "INCIDENT_OPENED", incidentId: "INC-0042", monitorId: "MON-004", triggerCondition: "Action", timestampMs: 100, sequence: 1 },
      { type: "ACKNOWLEDGED", incidentId: "INC-0042", acknowledgedBy: "Jordan", timestampMs: 200, sequence: 2 },
      { type: "ASSIGNED", incidentId: "INC-0042", assignee: "Jordan", timestampMs: 300, sequence: 3 },
      { type: "INVESTIGATION_STARTED", incidentId: "INC-0042", startedBy: "Jordan", timestampMs: 400, sequence: 4 },
      { type: "VERIFICATION_STARTED", incidentId: "INC-0042", verifier: "Maria", timestampMs: 500, sequence: 5 },
      { type: "VERIFICATION_COMPLETED", incidentId: "INC-0042", verifier: "Maria", outcome: "sufficient_to_close", notes: "Clear", timestampMs: 600, sequence: 6 },
      { type: "INCIDENT_CLOSED", incidentId: "INC-0042", category: "False positive", details: "Done", closedBy: "Maria", timestampMs: 700, sequence: 7 },
    ];

    const closedState = reduceIncident(events);
    expect(closedState.closed).toBe(true);

    const postCloseEvent: IncidentEvent = {
      type: "RESPONSE_NOTE_ADDED",
      incidentId: "INC-0042",
      author: "Jordan",
      note: "Late note",
      timestampMs: 800,
      sequence: 8,
    };

    const res = reduceIncidentEvent(closedState, postCloseEvent);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toContain("Cannot process event 'RESPONSE_NOTE_ADDED' on closed incident");
    }
  });
});
