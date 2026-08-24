import { describe, expect, it } from "vitest";

import { MONITORING_VIEW_OFFSET_MS, projectMonitoringAt } from "@/lib/demonstration/monitoring-projection";

describe("monitoring projection", () => {
  it("projects all monitoring views from the canonical deterministic scenario", () => {
    const projection = projectMonitoringAt(MONITORING_VIEW_OFFSET_MS);
    const workZone = projection.locations.find(({ id }) => id === "WORK_ZONE_A");

    expect(projection.site).toBe("Demonstration Project");
    expect(projection.locations).toHaveLength(4);
    expect(projection.reportingLocationCount).toBe(4);
    expect(projection.overallSystemHealth).toBe("HEALTHY");
    expect(projection.edgeStatus).toBe("ONLINE");
    expect(projection.primaryProviderStatus).toBe("CONNECTED");
    expect(projection.secondaryProviderStatus).toBe("READY");
    expect(projection.observationsStatus).toBe("CURRENT");

    expect(workZone).toMatchObject({
      site: "Demonstration Project",
      zone: "Zone A",
      location: "Monitoring Location 1",
      values: { PM1: 22, PM2_5: 38, RESPIRABLE_DUST: 31, PM10: 56 },
      operationalState: "ACTION",
      dustlightDeviceStatus: "YELLOW",
      observationFreshness: "CURRENT",
      lastObservationTimestamp: "2026-08-13T02:04:00.000Z",
      monitorHealth: "ONLINE",
      edgeHealth: "ONLINE",
      systemHealth: "HEALTHY"
    });
  });

  it("marks observations stale when the deterministic freshness window expires", () => {
    const projection = projectMonitoringAt(700_000);

    expect(projection.observationsStatus).toBe("STALE");
    expect(projection.overallSystemHealth).toBe("STALE");
    expect(projection.reportingLocationCount).toBe(0);
    expect(projection.locations.every(({ observationFreshness }) => observationFreshness === "STALE")).toBe(true);
  });
});
