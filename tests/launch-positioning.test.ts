import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { footerGroups, primaryNav } from "../lib/site";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("launch-stage positioning", () => {
  it("does not link to case studies from navigation or footer", () => {
    const links = [
      ...primaryNav,
      ...footerGroups.flatMap((group) => group.links),
    ];

    expect(links.some((link) => /case studies/i.test(link.label))).toBe(false);
    expect(links.some((link) => link.href === "/case-studies")).toBe(false);
  });

  it("redirects the legacy case-studies route to applications", () => {
    const source = read("app/case-studies/page.tsx");
    expect(source).toContain('permanentRedirect("/applications")');
  });

  it("describes practical project deployment and optional pilot engagement", () => {
    const content = read("lib/content.ts");
    const pilot = read("components/home/PilotDeployment.tsx");

    expect(content).toContain("Erne Tech is an Australian startup developing VerifAir");
    expect(pilot).toContain("DEPLOYMENT");
    expect(pilot).toContain("Designed for practical project deployment.");
    expect(pilot).toContain("Review project requirements");
    expect(pilot).toContain("Define sites and zones");
    expect(pilot).toContain("Deploy Dustlight monitors and VerifAir Edge");
    expect(pilot).toContain("Begin operational monitoring");
    expect(pilot).toMatch(/pilot deployment may be available as an engagement\s+option/);
  });

  it("uses neutral demonstration labels", () => {
    const source = [
      read("components/home/PlatformOverview.tsx"),
    ].join("\n");

    expect(source).toContain("Demonstration data");
    expect(source).toContain("Demonstration Project");
    expect(source).not.toMatch(/Sample project/i);
  });

  it("does not use prohibited adoption language", () => {
    const source = [
      read("lib/content.ts"),
      read("components/home/PlatformOverview.tsx"),
      read("components/home/PilotDeployment.tsx"),
      read("components/home/CTA.tsx"),
    ].join("\n");

    expect(source).not.toMatch(/trusted by|proven across projects|customer success stories|join leading organisations/i);
  });
});
