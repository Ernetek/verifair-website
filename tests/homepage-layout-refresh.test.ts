import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const read = (relativePath: string) => fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("homepage layout refresh", () => {
  it("uses the consolidated platform overview", () => {
    const source = read("components/home/PlatformOverview.tsx");
    expect(source).toContain("Platform overview");
    expect(source).toContain("ProductDemonstrationPreview");
    expect(source).toContain("WorkflowDashboardDemo");
    expect(source).toContain("ReportingDashboardDemo");
    expect(source).toContain("7000");
    expect(source).toContain("carouselInView");
    expect(source).not.toContain('addEventListener("wheel"');
  });

  it("uses the approved healthcare construction image as the homepage hero background", () => {
    const hero = read("components/home/Hero.tsx");
    expect(hero).not.toContain("<PolicyReadinessBanner />");
    expect(hero).toContain("See changing particulate conditions. Act before they become bigger problems.");
    expect(hero).toContain('title: "Assess"');
    expect(hero).toContain('title: "Prevent"');
    expect(hero).toContain('title: "Report"');
    expect(hero).toContain("SEE VERIFAIR IN ACTION");
    expect(hero).toContain("HOW IT WORKS");
    expect(hero).toContain('src="/assets/healthcare_construction.webp"');
    expect(hero).not.toContain('src="/assets/landing-hero.webp"');
    expect(hero).toContain('from "next/image"');
    expect(hero).not.toContain("MonitoringRoomHeroPreview");
  });

  it("places the shared disclaimer after the final CTA", () => {
    const homepage = read("app/page.tsx");
    expect(homepage).not.toContain("<PageDisclaimer />");
  });
});
