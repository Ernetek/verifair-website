import { describe, expect, it } from "vitest";

import { resolveMonitoringPresentation } from "@/lib/demonstration/monitoring-view";

describe("monitoring presentation freshness", () => {
  it.each(["STALE", "OFFLINE"] as const)(
    "subordinates the previous operational state when health is %s",
    (health) => {
      expect(resolveMonitoringPresentation("NORMAL", health)).toEqual({
        primaryState: health,
        previousOperationalState: "NORMAL",
        observationIsCurrent: false,
      });
    },
  );

  it.each(["HEALTHY", "DEGRADED"] as const)(
    "keeps the operational state current when health is %s",
    (health) => {
      expect(resolveMonitoringPresentation("ATTENTION", health)).toEqual({
        primaryState: "ATTENTION",
        observationIsCurrent: true,
      });
    },
  );
});
