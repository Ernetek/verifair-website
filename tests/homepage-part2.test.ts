import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const read = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("Part 2 homepage product presentation", () => {
  it("keeps the hero concise and uses the approved framework", () => {
    const source = read("components/home/Hero.tsx");
    expect(source).toContain("changing particulate conditions");
    expect(source).toContain("VerifAir connects distributed Dustlight particulate monitors across project zones and sites");
  });

  it("shows the monitoring-location hierarchy from project to portfolio", () => {
    const source = read("components/home/OperationalArchitecture.tsx");
    const expected = [
      "PROJECT",
      "ZONE",
      "MONITORING LOCATION",
      "SHARED VIEW",
      "PORTFOLIO",
    ];
    let previous = -1;
    for (const label of expected) {
      const index = source.indexOf(label);
      expect(index).toBeGreaterThan(previous);
      previous = index;
    }
    expect(source).toContain("one project, multiple monitoring locations");
    expect(source).toContain("Scaling capability: multiple projects / portfolio");
  });

  it("makes Respirable Dust primary and keeps the other measurements secondary", () => {
    const source = read("components/demonstration/UnifiedDemonstration.tsx");
    expect(source).toContain("Respirable Dust");
    expect(source).toContain('grid grid-cols-3');
    expect(source).toContain('["PM1", monitor.pm1]');
    expect(source).toContain('["PM2.5", monitor.pm25]');
    expect(source).toContain('["PM10", monitor.pm10]');
    expect(source).toContain("Dustlight Device Status");
    expect(source).toContain("VerifAir Operational State");
  });

  it("shows the required system-health facts separately", () => {
    const source = read("components/demonstration/UnifiedDemonstration.tsx");
    expect(source).toContain("4/4 monitoring locations reporting");
  });

  it("uses one session across ASSESS, ACT and RECORD", () => {
    const source = read("components/demonstration/UnifiedDemonstration.tsx");
    expect(source).toContain("<LiveMonitoringSection");
    expect(source).toContain("<IncidentWorkspaceSection session={session} />");
    expect(source).toContain("<EvidenceAndReportingSection session={session} />");
    expect(source).toContain("same deterministic operational event");
  });

  it("uses the full ACT progression and connected RECORD history", () => {
    const source = read("components/demonstration/UnifiedDemonstration.tsx");
    for (const stage of [
      "CONFIGURED OPERATIONAL CONDITION",
      "ALERT",
      "NOTIFY",
      "ACKNOWLEDGE",
      "ASSIGN",
      "INVESTIGATE",
      "RECORD ACTION",
      "CONTINUE MONITORING",
      "REVIEW",
      "RESOLVE",
    ]) {
      expect(source).toContain(`"${stage}"`);
    }
    for (const record of [
      "Observations",
      "Configured trigger / event",
      "Notifications",
      "Comments",
      "Evidence",
      "Generated report",
    ]) {
      expect(source).toContain(`"${record}"`);
    }
  });

  it("keeps capability labels compact and avoids dual-SIM wording", () => {
    const source = read("components/home/PilotDeployment.tsx");
    for (const capability of [
      "EDGE COMPUTING & LOCAL INTELLIGENCE",
      "INDEPENDENT CONNECTIVITY",
      "REMOTE MANAGEMENT",
      "RESILIENT OPERATION",
      "PRACTICAL DEPLOYMENT",
      "AUTHORISED ACCESS",
    ]) {
      expect(source).toContain(capability);
    }
    expect(source).toContain("Telstra primary with Optus secondary connectivity.");
    expect(source).not.toMatch(/dual SIM/i);
  });

  it("uses mobile-first dashboard grids without horizontal page overflow", () => {
    const source = read("components/demonstration/UnifiedDemonstration.tsx");
    expect(source).toContain("grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4");
    expect(source).toContain("grid grid-cols-3 gap-1.5");
    expect(source).not.toContain("overflow-x-scroll");
  });
});
