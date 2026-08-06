import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const read = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("homepage section order and zone interaction", () => {
  it("uses the approved homepage section order", () => {
    const source = read("app/page.tsx");
    const expected = [
      "<HeroSection />",
      "<ProblemSection />",
      "<MonitoringRoomSection />",
      "<CoordinatedSolutionSection />",
      "<ReportingProof />",
      "<IndustriesSection />",
      "<FAQSection />",
      "<FinalCTA />",
    ];

    let previousIndex = -1;
    for (const section of expected) {
      const index = source.indexOf(section);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it("uses simple Zone 1 to Zone 4 names and mobile-selectable equal tiles", () => {
    const source = read("components/demonstration/ClinicalDashboards.tsx");

    for (const zone of ["Zone 1", "Zone 2", "Zone 3", "Zone 4"]) {
      expect(source).toContain(`name: "${zone}"`);
    }

    expect(source).toContain("Tap any zone tile");
    expect(source).toContain("grid grid-cols-2 gap-2");
    expect(source).toContain("stateGuidance");
    expect(source).not.toContain("Occupied Interface");
    expect(source).not.toContain("Shared Access Route");
  });

  it("styles reporting as a distinct report artifact", () => {
    const source = read("components/home/ReportingProof.tsx");

    expect(source).toContain("Report preview");
    expect(source).toContain("VerifAir project monitoring report");
    expect(source).toContain("Page 1 of 1");
    expect(source).toContain("bg-amber-50");
  });
});
