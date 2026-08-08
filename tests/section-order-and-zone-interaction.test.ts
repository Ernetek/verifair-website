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
      "<PlatformOverviewSection />",
      "<IndustriesSection />",
      "<PilotDeploymentSection />",
      "<FAQSection />",
      "<FinalCTA />",
      "<PageDisclaimer />",
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

  it("supports monitoring, workflow and reporting hashes", () => {
    const source = read("components/home/PlatformOverview.tsx");
    expect(source).toContain('"#monitoring": 0');
    expect(source).toContain('"#workflow": 1');
    expect(source).toContain('"#reportpreview": 2');
  });
});
