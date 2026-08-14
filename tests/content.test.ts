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

  it("prioritises the core VerifAir proposition and operational journey", () => {
    const hero = readFile("components/home/Hero.tsx");
    expect(hero).toContain("Know when particulate conditions change.");
    expect(hero).toContain("OPERATIONAL PARTICULATE VISIBILITY &amp; RESPONSE");
    expect(hero).toContain("ASSESS. ACT. RECORD.");
    expect(hero).toContain("See VerifAir in Action");
    expect(hero).toContain("Discuss Your Project");
    expect(hero).toContain("distributed Dustlight particulate monitors");
  });

  it("labels demonstration triggers as configured operational triggers and keeps causation out of the wording", () => {
    const demo = readFile("components/demonstration/UnifiedDemonstration.tsx");
    expect(demo).toContain("configured operational trigger");
    expect(demo).toContain("keeps the evidence together for review");
    expect(demo).not.toContain("verifies control measures");
    expect(demo).not.toContain("PM2.5 > 25 µg/m³");
  });

  it("includes all requested industry pages", () => {
    expect(Object.keys(pageContent)).toEqual(
      expect.arrayContaining(["healthcare", "construction", "infrastructure", "government", "schools", "commercial-buildings"])
    );
  });
});

function readFile(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}
