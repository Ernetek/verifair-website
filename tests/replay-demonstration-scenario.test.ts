import { describe, expect, it } from "vitest";

import {
  DEMONSTRATION_METRICS,
  getDemonstrationRespirableDustTrend,
  publicDemonstrationScenario,
} from "@/lib/replay/demonstration-scenario";
import { classifyDemonstrationMetric } from "@/lib/demonstration/metric-status";
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

  it("contains four separate demo measurements without inventing PM4", () => {
    expect(DEMONSTRATION_METRICS.map(({ label }) => label)).toEqual([
      "PM1",
      "PM2.5",
      "Respirable Dust",
      "PM10",
    ]);
    expect(
      new Set(publicDemonstrationScenario.observations.map(({ metricId }) => metricId)),
    ).toEqual(new Set(["PM1", "PM2_5", "RESPIRABLE_DUST", "PM10"]));
    expect(JSON.stringify(publicDemonstrationScenario)).not.toMatch(/PM4(?:\.0)?/i);
    expect(publicDemonstrationScenario.metadata.provenance).toContain(
      "Respirable Dust is separately simulated",
    );
    expect(publicDemonstrationScenario.metadata.provenance).toContain(
      "is not calculated from PM1, PM2.5 or PM10",
    );
  });

  it("provides non-flat recent trends anchored to approved respirable dust readings", () => {
    for (const monitorId of ["WORK_ZONE_A", "OCCUPIED_INTERFACE", "SHARED_CORRIDOR", "EXTERNAL_BOUNDARY"]) {
      const trend = getDemonstrationRespirableDustTrend(monitorId, 0);
      expect(new Set(trend).size).toBeGreaterThan(2);
      const latest = evaluateAt(publicDemonstrationScenario, 0);
      if (!latest.ok) throw new Error("Baseline offset must evaluate");
      const observation = latest.state.monitorStates
        .find(({ monitor }) => monitor.id === monitorId)
        ?.latestObservations.find(({ metricId }) => metricId === "RESPIRABLE_DUST");
      expect(trend.at(-1)).toBe(observation?.reading.status === "available" ? observation.reading.value : null);
    }
    const rising = getDemonstrationRespirableDustTrend("WORK_ZONE_A", 120_000);
    const falling = getDemonstrationRespirableDustTrend("WORK_ZONE_A", 480_000);
    expect(rising[0]).toBeLessThan(rising.at(-1) ?? 0);
    expect(falling[0]).toBeGreaterThan(falling.at(-1) ?? 0);
  });

  it("freezes all 96 approved readings with exact start, attention and terminal values", () => {
    expect(publicDemonstrationScenario.observations).toHaveLength(96);
    const start = evaluateAt(publicDemonstrationScenario, 0);
    const attention = evaluateAt(publicDemonstrationScenario, 60_000);
    const terminal = evaluateAt(publicDemonstrationScenario, 480_000);
    if (!start.ok || !attention.ok || !terminal.ok) throw new Error("Approved offsets must evaluate");
    expect(
      start.state.monitorStates
        .find(({ monitor }) => monitor.id === "WORK_ZONE_A")
        ?.latestObservations.map(({ reading }) =>
          reading.status === "available" ? reading.value : null,
        ),
    ).toEqual([8, 18, 12, 10]);
    expect(
      attention.state.monitorStates
        .find(({ monitor }) => monitor.id === "WORK_ZONE_A")
        ?.latestObservations.map(({ reading }) =>
          reading.status === "available" ? reading.value : null,
        ),
    ).toEqual([12, 28, 18, 16]);
    const terminalObservations = terminal.state.monitorStates
      .find(({ monitor }) => monitor.id === "WORK_ZONE_A")
      ?.latestObservations;
    expect(
      terminalObservations?.map(({ reading }) =>
        reading.status === "available" ? reading.value : null,
      ),
    ).toEqual([7, 27, 14, 14]);
    expect(
      terminalObservations?.map(({ metricId, reading }) =>
        reading.status === "available"
          ? classifyDemonstrationMetric(
              metricId as (typeof DEMONSTRATION_METRICS)[number]["id"],
              reading.value,
            ).label
          : null,
      ),
    ).toEqual(["NORMAL", "NORMAL", "NORMAL", "NORMAL"]);
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
    expect(opened.state.timelineEvents[1]?.title).toContain("site contact notified");
    expect(acted.state.actions).toHaveLength(1);
    expect(evidenced.state.evidence).toHaveLength(1);
    expect(resolved.state.incidents[0]?.status).toBe("resolved");
    expect(resolved.state.isTerminal).toBe(true);
  });
});
