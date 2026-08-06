import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const read = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("homepage layout refresh", () => {
  it("uses a full-width shared dashboard followed by a 3x2 workflow grid", () => {
    const source = read("components/home/CoordinatedSolution.tsx");

    expect(source).toContain("<SharedDashboardPreview />");
    expect(source).toContain("sm:grid-cols-2 lg:grid-cols-3");
    expect(source).toContain("Shared environment overview & workflows");
    expect(source).not.toContain("Earlier awareness");
    expect(source).not.toContain("Coordinated response");
  });

  it("places the readiness banner inside the hero", () => {
    const hero = read("components/home/Hero.tsx");
    const homepage = read("app/page.tsx");

    expect(hero).toContain("<PolicyReadinessBanner />");
    expect(homepage).not.toContain("<PolicyReadinessBanner />");
    expect(hero).toContain("See change. Act sooner.");
  });

  it("uses contain sizing for industry images", () => {
    const industries = read("components/home/Industries.tsx");

    expect(industries).toContain("object-contain");
    expect(industries).not.toContain("min-h-[30rem] w-full object-cover");
  });

  it("moves the homepage disclaimer into the final CTA", () => {
    const homepage = read("app/page.tsx");
    const cta = read("components/home/CTA.tsx");

    expect(homepage).not.toContain("<PageDisclaimer />");
    expect(cta).toContain("PARTICULATE_QUALIFICATION");
  });

  it("uses explicit high-contrast button colours in both final CTA components", () => {
    const homeCta = read("components/home/CTA.tsx");
    const pageCta = read("components/page-sections.tsx");

    expect(homeCta).toContain("!text-slate-950");
    expect(pageCta).toContain("!text-slate-950");
    expect(pageCta).toContain("!text-white");
  });
});
