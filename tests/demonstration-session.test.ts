import { describe, expect, it } from "vitest";

import {
  DemonstrationSession,
} from "@/lib/demonstration/session";

describe("DemonstrationSession Integration", () => {
  it("coexists replay and incident state without auto-advancing time on workflow actions", () => {
    const session = new DemonstrationSession(undefined, false); // Disable auto-play for testing
    let snap = session.getSnapshot();

    expect(snap.replayState.offsetMs).toBe(0);
    expect(snap.incidentState.phase).toBe("Alert");

    // Seek to 120,000ms where incident opens in scenario
    session._testOnlySeek(120_000);
    snap = session.getSnapshot();
    expect(snap.replayState.offsetMs).toBe(120_000);
    expect(snap.incidentState.opened).toBe(true);

    // Dispatch ACKNOWLEDGED action at 120,000ms
    const ackRes = session.dispatchIncidentEvent({
      type: "ACKNOWLEDGED",
      acknowledgedBy: "Jordan Lee",
    });
    expect(ackRes.ok).toBe(true);

    snap = session.getSnapshot();
    // Architectural invariant check: Dispatching workflow action MUST NOT advance scenario time!
    expect(snap.replayState.offsetMs).toBe(120_000);
    expect(snap.incidentState.acknowledged).toBe(true);
    expect(snap.incidentState.phase).toBe("Acknowledge");
  });

  it("deterministically reconstructs incident state on seek rewind", () => {
    const session = new DemonstrationSession(undefined, false);
    session._testOnlySeek(120_000);

    // Dispatch ACKNOWLEDGED at 120,000ms
    session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Jordan" });
    expect(session.getSnapshot().incidentState.acknowledged).toBe(true);

    // Seek backward to 50,000ms (before incident opened)
    session._testOnlySeek(50_000);
    let snap = session.getSnapshot();
    expect(snap.replayState.offsetMs).toBe(50_000);
    expect(snap.incidentState.opened).toBe(false);

    // Seek forward again to 120,000ms
    session._testOnlySeek(120_000);
    snap = session.getSnapshot();
    expect(snap.replayState.offsetMs).toBe(120_000);
    expect(snap.incidentState.acknowledged).toBe(true);
  });

  it("resets replay and interactive incident state on restart", () => {
    const session = new DemonstrationSession(undefined, false);
    session._testOnlySeek(120_000);
    session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Jordan" });
    session.dispatchIncidentEvent({ type: "ASSIGNED", assignee: "Jordan" });

    expect(session.getSnapshot().incidentState.assignedTo).toBe("Jordan");

    session._testOnlyRestart();
    const snap = session.getSnapshot();
    expect(snap.replayState.offsetMs).toBe(0);
    expect(snap.incidentState.assignedTo).toBeUndefined();
    expect(snap.incidentState.opened).toBe(false);
  });

  it("allows the demo to be started explicitly so monitoring can create the incident workflow", () => {
    const session = new DemonstrationSession(undefined, false);

    expect(session.getSnapshot().isPlaying).toBe(false);
    session.start();
    expect(session.getSnapshot().isPlaying).toBe(true);

    session._testOnlySeek(120_000);
    expect(session.getSnapshot().incidentState.opened).toBe(true);
  });

  it("notifies subscribers on state changes", () => {
    const session = new DemonstrationSession(undefined, false);
    let callCount = 0;
    const unsub = session.subscribe(() => {
      callCount++;
    });

    session._testOnlySeek(120_000);
    expect(callCount).toBe(1);

    session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Jordan" });
    expect(callCount).toBe(2);

    unsub();
    session._testOnlySeek(200_000);
    expect(callCount).toBe(2);
  });
});
