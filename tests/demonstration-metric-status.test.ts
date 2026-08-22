import { describe, expect, it } from "vitest";
import { classifyDemonstrationMetric } from "@/lib/demonstration/metric-status";

describe.each([
  ["PM1", 7.9, 8, 19.9, 20],
  ["PM2_5", 14.9, 15, 24.9, 25],
  ["RESPIRABLE_DUST", 24.9, 25, 49.9, 50],
  ["PM10", 29.9, 30, 49.9, 50],
] as const)(
  "%s demonstration status",
  (metric, normal, attention, belowAction, action) => {
    it.each([
      [normal, "NORMAL"],
      [attention, "ATTENTION"],
      [belowAction, "ATTENTION"],
      [action, "ACTION"],
    ] as const)("classifies %s as %s", (value, label) => {
      expect(classifyDemonstrationMetric(metric, value).label).toBe(label);
    });
  },
);

it("keeps environmental operational state independent from system-health degradation", () => {
  const beforeDegradation = classifyDemonstrationMetric("PM2_5", 18).label;
  const systemHealth = "DEGRADED";

  expect(systemHealth).toBe("DEGRADED");
  expect(classifyDemonstrationMetric("PM2_5", 18).label).toBe(beforeDegradation);
  expect(beforeDegradation).toBe("ATTENTION");
});
