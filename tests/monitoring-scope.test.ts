import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("components/monitoring/MonitoringPage.tsx", "utf8");

describe("monitoring page scope", () => {
  it("contains monitoring-specific surfaces backed by the shared projection", () => {
    expect(source).toContain("monitoringProjection");
    expect(source).toContain("Control Centre");
    expect(source).toContain("Monitor detail");
    expect(source).toContain("Historical trend");
    expect(source).toContain("Wallboard / Display Mode");
    expect(source).toContain("Overall system health");
    expect(source).toContain("monitors reporting");
  });

  it("does not embed the complete workflow or reporting demonstration", () => {
    expect(source).not.toContain("HomepageInteractiveDemo");
    expect(source).not.toContain("UnifiedDemonstration");
    expect(source).not.toContain("START WORK");
    expect(source).not.toContain("OPEN EVENTS WORKSPACE");
    expect(source).not.toContain("VIEW GENERATED REPORT");
  });

  it("links onward to the dedicated workflow page", () => {
    expect(source).toContain('href="/workflow"');
    expect(source).toContain("Explore Operational Workflow");
  });
});
