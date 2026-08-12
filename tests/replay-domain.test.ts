import { describe, expect, it } from "vitest";

import type { DatasetReviewStatus } from "@/lib/replay/domain";
import { createMechanicsOnlyScenario } from "./replay-fixtures";

describe("canonical replay domain", () => {
  it("uses only the authorised dataset review states", () => {
    const statuses = [
      "MECHANICS_ONLY_TEST_FIXTURE",
      "DATASET_REVIEW_REQUIRED",
      "APPROVED_PUBLIC_DEMONSTRATION",
    ] satisfies DatasetReviewStatus[];

    expect(statuses).toEqual([
      "MECHANICS_ONLY_TEST_FIXTURE",
      "DATASET_REVIEW_REQUIRED",
      "APPROVED_PUBLIC_DEMONSTRATION",
    ]);
  });

  it("labels fixtures as mechanics-only synthetic data", () => {
    const scenario = createMechanicsOnlyScenario();

    expect(scenario.metadata).toMatchObject({
      dataLabel: "SIMULATED_DEMONSTRATION_DATA",
      reviewStatus: "MECHANICS_ONLY_TEST_FIXTURE"
    });
    expect(scenario.metadata.provenance).toContain("Mechanics-only");
    expect(new Set(scenario.observations.map(({ metricId }) => metricId))).toEqual(new Set(["TEST_SIGNAL_A", "TEST_SIGNAL_B"]));
    expect(scenario.observations.every(({ unit }) => unit === "synthetic-unit")).toBe(true);
  });
});
