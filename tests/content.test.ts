import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { pageContent } from "../lib/content";

describe("public page content", () => {
  it("uses compliance-safe language", () => {
    const text = JSON.stringify(pageContent).toLowerCase();
    expect(text).not.toContain("guarantees compliance");
    expect(text).not.toContain("ensures compliance");
    expect(text).not.toContain("makes a project compliant");
  });

  it("prioritises the approved early-warning and managed-response hero proposition", () => {
    const hero = readFile("components/home/Hero.tsx");
    expect(hero).toContain("FROM EARLY WARNING TO MANAGED RESPONSE");
    expect(hero).toContain("Detect changing conditions early. Manage what happens next.");
    expect(hero).toContain("VerifAir connects distributed particulate monitoring with trend intelligence, operational alerts, accountable response workflows and a complete event record across project zones and sites.");
    expect(hero).toContain("SEE VERIFAIR IN ACTION");
    expect(hero).toContain("DISCUSS A HEALTHCARE PROJECT");
    expect(hero).not.toContain('title: "Assess"');
    expect(hero).not.toContain('title: "Prevent"');
    expect(hero).not.toContain('title: "Report"');
  });

  it("labels demonstration triggers as configured operational triggers and keeps causation out of the wording", () => {
    const demo = readFile("components/demonstration/UnifiedDemonstration.tsx");
    expect(demo).toContain("configured operational trigger");
    expect(demo).toContain("One connected operational view from particulate readings through response and record.");
    expect(demo).not.toContain("verifies control measures");
    expect(demo).not.toContain("PM2.5 > 25 µg/m³");
  });

  it("includes all requested industry pages", () => {
    expect(Object.keys(pageContent)).toEqual(
      expect.arrayContaining(["healthcare", "construction", "infrastructure", "government", "schools", "commercial-buildings"])
    );
  });

  it("provides dedicated content for primary product and solutions navigation", () => {
    expect(pageContent.product.heading).toContain("monitoring, response and operational records");
    expect(pageContent.solutions.heading).toContain("dust-sensitive projects");
  });
});

function readFile(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}
