import { describe, expect, it } from "vitest";

import { evaluateAt } from "@/lib/replay/engine";
import { validateScenario, type ValidatedScenario } from "@/lib/replay/validation";
import { cloneScenario, createMechanicsOnlyScenario, deepFreeze } from "./replay-fixtures";

function validatedScenario(): ValidatedScenario {
  const result = validateScenario(createMechanicsOnlyScenario());
  if (!result.ok) throw new Error("The mechanics-only fixture must be valid");
  return result.value;
}

function stateAt(scenario: ValidatedScenario, offsetMs: number) {
  const result = evaluateAt(scenario, offsetMs);
  if (!result.ok) throw new Error("Expected replay evaluation to succeed");
  return result.state;
}

describe("deterministic replay evaluation", () => {
  it("rejects non-integer and non-finite requested offsets", () => {
    const scenario = validatedScenario();

    expect(evaluateAt(scenario, 1.5)).toEqual({
      ok: false,
      error: { code: "INVALID_REQUESTED_OFFSET", requestedOffsetMs: 1.5 }
    });
    expect(evaluateAt(scenario, Number.POSITIVE_INFINITY)).toEqual({
      ok: false,
      error: {
        code: "INVALID_REQUESTED_OFFSET",
        requestedOffsetMs: Number.POSITIVE_INFINITY
      }
    });
  });

  it("clamps valid seeks to scenario bounds", () => {
    const scenario = validatedScenario();

    expect(stateAt(scenario, -100).offsetMs).toBe(0);
    const afterEnd = stateAt(scenario, 9_000);
    expect(afterEnd.offsetMs).toBe(4_000);
    expect(afterEnd.requestedOffsetMs).toBe(9_000);
    expect(afterEnd.isTerminal).toBe(true);
  });

  it("includes start-boundary records and excludes future records", () => {
    const state = stateAt(validatedScenario(), 0);

    expect(state.timestamp).toBe("2040-01-01T00:00:00.000Z");
    expect(state.timelineEvents.map(({ id }) => id)).toEqual(["TEST_EVENT_START"]);
    expect(state.incidents).toEqual([]);
    expect(state.actions).toEqual([]);
    expect(state).not.toHaveProperty("observations");
  });

  it("holds the last known observation without interpolation", () => {
    const scenario = validatedScenario();
    const beforeBoundary = stateAt(scenario, 999).monitorStates[0];
    const atBoundary = stateAt(scenario, 1_000).monitorStates[0];
    const betweenBoundaries = stateAt(scenario, 1_500).monitorStates[0];

    expect(beforeBoundary.latestObservations[0].id).toBe("TEST_OBSERVATION_START");
    expect(atBoundary.latestObservations[0].id).toBe("TEST_OBSERVATION_DEGRADED");
    expect(betweenBoundaries.latestObservations[0]).toBe(atBoundary.latestObservations[0]);
    expect(betweenBoundaries.latestObservations[0].reading).toEqual({
      status: "available",
      value: 20,
      quality: "degraded"
    });
  });

  it("holds latest observations independently per monitor and metric", () => {
    const scenario = validatedScenario();
    const latestByMetric = (offsetMs: number) =>
      new Map(stateAt(scenario, offsetMs).monitorStates[0].latestObservations.map((observation) => [observation.metricId, observation]));

    const beforeSignalB = latestByMetric(0);
    expect([...beforeSignalB.keys()]).toEqual(["TEST_SIGNAL_A"]);

    const signalAUpdates = latestByMetric(1_000);
    expect(signalAUpdates.get("TEST_SIGNAL_A")?.id).toBe("TEST_OBSERVATION_DEGRADED");
    expect(signalAUpdates.get("TEST_SIGNAL_B")?.id).toBe("TEST_OBSERVATION_SIGNAL_B_START");

    const signalBUpdates = latestByMetric(1_500);
    expect(signalBUpdates.get("TEST_SIGNAL_A")?.id).toBe("TEST_OBSERVATION_DEGRADED");
    expect(signalBUpdates.get("TEST_SIGNAL_B")?.reading).toEqual({
      status: "available",
      value: 110,
      quality: "degraded"
    });

    const independentlyUnavailable = latestByMetric(2_500);
    expect(independentlyUnavailable.get("TEST_SIGNAL_A")?.reading.status).toBe("unavailable");
    expect(independentlyUnavailable.get("TEST_SIGNAL_B")?.reading).toEqual({
      status: "unavailable",
      value: null,
      reason: "Artificial second-signal test state"
    });
  });

  it("preserves unavailable readings as an explicit current state", () => {
    const monitorState = stateAt(validatedScenario(), 2_500).monitorStates[0];

    expect(monitorState.status).toBe("observed");
    expect(monitorState.latestObservations[0].reading).toEqual({
      status: "unavailable",
      value: null,
      reason: "Artificial test state"
    });
  });

  it("represents a monitor with no observations explicitly", () => {
    const monitorState = stateAt(validatedScenario(), 2_500).monitorStates.find(
      ({ monitor }) => monitor.id === "TEST_MONITOR_WITHOUT_DATA"
    );

    expect(monitorState).toEqual({
      monitor: {
        id: "TEST_MONITOR_WITHOUT_DATA",
        name: "Artificial monitor without data"
      },
      status: "no-observation",
      latestObservations: []
    });
  });

  it("includes records at the terminal position", () => {
    const state = stateAt(validatedScenario(), 4_000);
    const monitor = state.monitorStates.find(({ monitor: item }) => item.id === "TEST_MONITOR_A");

    expect(state.isTerminal).toBe(true);
    expect(monitor?.latestObservations[0].id).toBe("TEST_OBSERVATION_TERMINAL");
  });

  it("derives the incident lifecycle from opening and resolution offsets", () => {
    const scenario = validatedScenario();

    expect(stateAt(scenario, 999).incidents).toEqual([]);
    expect(stateAt(scenario, 1_000).incidents[0].status).toBe("open");
    expect(stateAt(scenario, 2_999).incidents[0].status).toBe("open");
    expect(stateAt(scenario, 3_000).incidents[0]).toMatchObject({
      status: "resolved",
      resolution: { id: "TEST_RESOLUTION_A" }
    });
  });

  it("returns independent same-offset events in stable ID order", () => {
    const scenario = cloneScenario();
    Reflect.set(scenario, "timelineEvents", [...scenario.timelineEvents].reverse());
    const validation = validateScenario(scenario);
    if (!validation.ok) throw new Error("Reordered scenario must remain valid");

    const events = stateAt(validation.value, 2_000).timelineEvents;
    expect(events.slice(-2).map(({ id }) => id)).toEqual(["TEST_EVENT_ACTION_A", "TEST_EVENT_ACTION_B"]);
  });

  it("produces deeply equal state for repeated evaluation", () => {
    const scenario = validatedScenario();

    expect(evaluateAt(scenario, 2_500)).toEqual(evaluateAt(scenario, 2_500));
  });

  it("does not mutate a deeply frozen scenario", () => {
    const frozen = deepFreeze(createMechanicsOnlyScenario());
    const before = structuredClone(frozen);
    const validation = validateScenario(frozen);
    if (!validation.ok) throw new Error("Frozen scenario must remain valid");

    expect(() => evaluateAt(validation.value, 2_500)).not.toThrow();
    expect(frozen).toEqual(before);
  });

  it("is unaffected by mutation of the original input after validation", () => {
    const input = cloneScenario();
    const validation = validateScenario(input);
    if (!validation.ok) throw new Error("Mechanics-only scenario must be valid");
    const beforeMutation = evaluateAt(validation.value, 2_500);

    Reflect.set(input, "startTimestamp", "invalid");
    Reflect.set(input.observations[0].reading, "value", 999);
    Reflect.set(input.timelineEvents, "length", 0);

    expect(evaluateAt(validation.value, 2_500)).toEqual(beforeMutation);
    expect(validation.value.startTimestamp).toBe("2040-01-01T00:00:00.000Z");
    expect(validation.value.timelineEvents).toHaveLength(5);
  });

  it("does not let display timezone alter replay state", () => {
    const first = cloneScenario();
    const second = cloneScenario();
    Reflect.set(first.metadata, "displayTimezone", "Australia/Sydney");
    Reflect.set(second.metadata, "displayTimezone", "UTC");
    const firstValidation = validateScenario(first);
    const secondValidation = validateScenario(second);
    if (!firstValidation.ok || !secondValidation.ok) {
      throw new Error("Timezone variants must be valid");
    }

    expect(stateAt(firstValidation.value, 2_500)).toEqual(stateAt(secondValidation.value, 2_500));
  });
});
