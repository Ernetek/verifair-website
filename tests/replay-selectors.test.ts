import { describe, expect, it } from "vitest";

import { evaluateAt } from "@/lib/replay/engine";
import {
  selectLatestObservation,
  selectMonitorState,
  selectObservationHistory,
} from "@/lib/replay/selectors";
import { validateScenario } from "@/lib/replay/validation";
import { createMechanicsOnlyScenario } from "@/tests/replay-fixtures";

function scenarioAndState(offsetMs: number) {
  const validation = validateScenario(createMechanicsOnlyScenario());
  if (!validation.ok) throw new Error("Mechanics fixture must validate");
  const evaluation = evaluateAt(validation.value, offsetMs);
  if (!evaluation.ok) throw new Error("Integer offset must evaluate");
  return { scenario: validation.value, state: evaluation.state };
}

describe("replay selectors", () => {
  it("selects monitor and metric state without copying canonical facts", () => {
    const { state } = scenarioAndState(1_500);
    expect(selectMonitorState(state, "TEST_MONITOR_A")?.status).toBe("observed");
    expect(
      selectLatestObservation(state, "TEST_MONITOR_A", "TEST_SIGNAL_A")?.id,
    ).toBe("TEST_OBSERVATION_DEGRADED");
  });

  it("includes no chart observation after the engine-clamped position", () => {
    const { scenario, state } = scenarioAndState(1_500);
    const history = selectObservationHistory(
      scenario,
      state,
      "TEST_MONITOR_A",
      "TEST_SIGNAL_A",
    );
    expect(history.map(({ offsetMs }) => offsetMs)).toEqual([0, 1_000]);
  });

  it("keeps monitor and metric histories independent", () => {
    const { scenario, state } = scenarioAndState(2_500);
    expect(
      selectObservationHistory(
        scenario,
        state,
        "TEST_MONITOR_A",
        "TEST_SIGNAL_A",
      ).map(({ id }) => id),
    ).toEqual([
      "TEST_OBSERVATION_START",
      "TEST_OBSERVATION_DEGRADED",
      "TEST_OBSERVATION_UNAVAILABLE",
    ]);
    expect(
      selectObservationHistory(
        scenario,
        state,
        "TEST_MONITOR_A",
        "TEST_SIGNAL_B",
      ).map(({ id }) => id),
    ).toEqual([
      "TEST_OBSERVATION_SIGNAL_B_START",
      "TEST_OBSERVATION_SIGNAL_B_DEGRADED",
      "TEST_OBSERVATION_SIGNAL_B_UNAVAILABLE",
    ]);
  });
});
