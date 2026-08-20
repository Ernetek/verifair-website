import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("homepage section order and platform interaction", () => {
  it("uses the consolidated launch-stage homepage sequence", () => {
    const source = read("app/page.tsx");
    const expected = [
      "<HeroSection />",
      "<ProblemSection />",
      "<OperationalArchitectureSection />",
      "<HomepageInteractiveDemo />",
      "<PilotDeploymentSection />",
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

  it("uses the four agreed workflow zone names without auto cycling", () => {
    const source = read("components/home/PlatformOverview.tsx");
    expect(source).toContain("Construction Site Entry Door");
    expect(source).toContain("Construction Site Exit Door");
    expect(source).toContain("Shared Corridor");
    expect(source).toContain("General Entry Door");
    expect(source).not.toContain("setInterval");
  });

  it("supports monitoring, workflow and reporting demonstrations", () => {
    const source = read("components/demonstration/DemonstrationOverview.tsx");
    expect(source).toContain("/demonstration/monitoring-room");
    expect(source).toContain("/demonstration/workflow");
    expect(source).toContain("/demonstration/evidence-reporting");
  });

  it("keeps a concise homepage architecture path and the detailed How It Works treatment", () => {
    const home = read("app/page.tsx");
    const howItWorks = read("app/how-it-works/page.tsx");

    expect(home).toContain("<OperationalArchitectureSection />");
    expect(howItWorks).toContain("<ArchitectureStorySection />");
    expect(howItWorks).toContain("From monitoring plan to retained evidence.");
    expect(howItWorks).toContain("What VerifAir automates.");
    expect(howItWorks).toContain("What accountable people decide.");
  });
});
