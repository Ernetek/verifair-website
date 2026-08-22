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
    expect(source).not.toContain("one project, multiple monitoring locations");
    expect(source).not.toContain("Scaling capability: multiple projects / portfolio");
    expect(source).not.toContain("A single project with several monitoring locations");
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

  it("presents every approved capability in a multi-card horizontal rail", () => {
    const source = read("components/home/PilotDeployment.tsx");

    expect(source).toContain('aria-roledescription="carousel"');
    expect(source).not.toContain("capabilityRailSets");
    expect(source).toContain("overflow-x-auto");
    expect(source).toContain("w-[78vw]");
    expect(source).toContain("lg:w-[18rem]");
    expect(source).toContain('aria-label="Previous capability"');
    expect(source).toContain('aria-label="Next capability"');
    expect(source).toContain('event.key === "ArrowLeft"');
    expect(source).toContain('event.key === "ArrowRight"');
    expect(source).not.toContain("aria-live");
  });

  it("moves capabilities automatically while preserving interaction pauses", () => {
    const source = read("components/home/PilotDeployment.tsx");

    expect(source).toContain("useReducedMotion");
    expect(source).toContain("onPointerDown");
    expect(source).toContain("window.setInterval");
    expect(source).toContain("pauseRef.current.hover = true");
    expect(source).toContain("pauseRef.current.focus = true");
    expect(source).toContain("document.hidden");
    expect(source).not.toContain("ResizeObserver");
    expect(source).not.toContain("desktopMotion");
  });

  it("presents industries in a healthcare-first accessible accordion", () => {
    const source = read("components/home/Industries.tsx");

    expect(source).toContain('title: "Healthcare"');
    expect(source).toContain('/assets/healthcare_construction.webp');
    expect(source).toContain("useState(0)");
    expect(source).toContain("aria-expanded={expanded}");
    expect(source).toContain("aria-controls={panelId}");
    expect(source).toContain('role="region"');
    expect(source).toContain("lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)]");
    expect(source).not.toContain('aria-roledescription="carousel"');
    expect(source).not.toContain("industryRailSets");
  });

  it("uses mobile-first dashboard grids without horizontal page overflow", () => {
    const source = read("components/demonstration/UnifiedDemonstration.tsx");
    expect(source).toContain("grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4");
    expect(source).toContain("grid grid-cols-3 gap-1.5");
    expect(source).not.toContain("overflow-x-scroll");
  });
});
