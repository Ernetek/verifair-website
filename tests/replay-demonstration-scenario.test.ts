import { describe, expect, it } from "vitest";

import {
  DEMONSTRATION_METRICS,
  publicDemonstrationScenario,
} from "@/lib/replay/demonstration-scenario";
import { evaluateAt } from "@/lib/replay/engine";

describe("approved public demonstration scenario", () => {
  it("has approved simulated-data metadata and no private identifiers", () => {
    expect(publicDemonstrationScenario.metadata).toMatchObject({
      dataLabel: "SIMULATED_DEMONSTRATION_DATA",
      reviewStatus: "APPROVED_PUBLIC_DEMONSTRATION",
      displayTimezone: "Australia/Sydney",
    });
    expect(JSON.stringify(publicDemonstrationScenario)).not.toMatch(
      /hospital|customer|patient|email|phone/i,
    );
  });

  it("contains the four verified Dustlight payload fields without inventing PM4", () => {
    expect(DEMONSTRATION_METRICS.map(({ label }) => label)).toEqual([
      "PM1",
      "PM2.5",
      "Respirable dust",
      "PM10",
    ]);
    expect(
      new Set(publicDemonstrationScenario.observations.map(({ metricId }) => metricId)),
    ).toEqual(new Set(["PM1", "PM2_5", "RESPIRABLE_DUST", "PM10"]));
    expect(JSON.stringify(publicDemonstrationScenario)).not.toMatch(/PM4(?:\.0)?/i);
  });

  it("freezes all 80 approved readings with exact start and terminal values", () => {
    expect(publicDemonstrationScenario.observations).toHaveLength(80);
    const start = evaluateAt(publicDemonstrationScenario, 0);
    const terminal = evaluateAt(publicDemonstrationScenario, 480_000);
    if (!start.ok || !terminal.ok) throw new Error("Approved offsets must evaluate");
    expect(
      start.state.monitorStates
        .find(({ monitor }) => monitor.id === "WORK_ZONE_A")
        ?.latestObservations.map(({ reading }) =>
          reading.status === "available" ? reading.value : null,
        ),
    ).toEqual([8, 18, 12, 10]);
    expect(
      terminal.state.monitorStates
        .find(({ monitor }) => monitor.id === "WORK_ZONE_A")
        ?.latestObservations.map(({ reading }) =>
          reading.status === "available" ? reading.value : null,
        ),
    ).toEqual([11, 27, 17, 14]);
  });

  it("reconstructs the approved incident, action, evidence and resolution sequence", () => {
    const before = evaluateAt(publicDemonstrationScenario, 119_999);
    const opened = evaluateAt(publicDemonstrationScenario, 120_000);
    const acted = evaluateAt(publicDemonstrationScenario, 240_000);
    const evidenced = evaluateAt(publicDemonstrationScenario, 360_000);
    const resolved = evaluateAt(publicDemonstrationScenario, 480_000);
    if (!before.ok || !opened.ok || !acted.ok || !evidenced.ok || !resolved.ok) {
      throw new Error("Approved offsets must evaluate");
    }
    expect(before.state.incidents).toHaveLength(0);
    expect(opened.state.incidents[0]?.status).toBe("open");
    expect(acted.state.actions).toHaveLength(1);
    expect(evidenced.state.evidence).toHaveLength(1);
    expect(resolved.state.incidents[0]?.status).toBe("resolved");
    expect(resolved.state.isTerminal).toBe(true);
  });
});
