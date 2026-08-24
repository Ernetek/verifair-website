import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(path.join(process.cwd(), "app/page.tsx"), "utf8");

describe("homepage composition", () => {
  it("keeps canonical homepage metadata", () => {
    expect(source).toContain('canonical: "/"');
  });

  it("uses the canonical demonstration on the homepage", () => {
    expect(source).toContain("<HomepageInteractiveDemo />");
    expect(source).toContain("<VerifAirProcessSection />");
    expect(source).toContain("<ResponsibilityBoundaries />");
    expect(source).not.toContain("<OperationalArchitectureSection />");
    expect(source).not.toContain("<CapabilitiesSection />");
    expect(source).not.toContain("<ArchitectureStorySection />");
    expect(source).not.toContain("<DemonstrationOverview />");
    expect(source).not.toContain("<PlatformOverviewSection />");
    expect(source).not.toContain("<CoordinatedSolutionSection />");
    expect(source).not.toContain("<ReportingProof />");
    expect(source).toContain("<PilotDeploymentSection />");
    expect(source).not.toContain("<PageDisclaimer />");
  });
});
