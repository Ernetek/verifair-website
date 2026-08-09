import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { SUPPORTED_PARTICULATE_METRICS, PARTICULATE_UNIT } from "../lib/metrics";
import { primaryNav, siteConfig } from "../lib/site";
import sitemap from "../app/sitemap";

const root = process.cwd();

function source(relative: string) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

describe("site quality requirements", () => {
  it("uses monitoring, workflow and reporting homepage anchors", () => {
    expect(primaryNav.some((item) => item.href === "/#monitoring")).toBe(true);
    expect(primaryNav.some((item) => item.href === "/#workflow")).toBe(true);
    expect(primaryNav.some((item) => item.href === "/#reportpreview")).toBe(true);
    expect(source("components/home/PlatformOverview.tsx")).toContain('id="platform"');
  });

  it("has valid canonical metadata for key indexable pages", () => {
    expect(source("app/page.tsx")).toContain('canonical: "/"');
    expect(source("app/faq/page.tsx")).toContain('canonical: "/faq"');
    expect(source("app/layout.tsx")).not.toContain('canonical: "/"');
  });

  it("excludes search and reports from the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).not.toContain(`${siteConfig.url}/search`);
    expect(urls).not.toContain(`${siteConfig.url}/reports`);
    expect(source("app/reports/page.tsx")).toContain('permanentRedirect("/#reportpreview")');
  });

  it("uses approved particulate metrics and concentration units", () => {
    expect(SUPPORTED_PARTICULATE_METRICS).toEqual(["PM1", "PM2.5", "PM10"]);
    expect(PARTICULATE_UNIT).toBe("\u00b5g/m\u00b3");

    const files = [
      "components/home/PlatformOverview.tsx",
      "components/technology/TechnologyPage.tsx",
    ].map(source).join("\n");

    expect(files).not.toContain("Âµg/mÂ²");
    expect(files).not.toContain("PM1, PM2.5 and PM2.5");
  });

  it("does not use prohibited absolute claims", () => {
    const files = [
      "components/home/PlatformOverview.tsx",
      "components/technology/TechnologyPage.tsx",
    ].map(source).join("\n").toLowerCase();

    expect(files).not.toContain("failover guarantees");
    expect(files).not.toContain("always available");
    expect(files).not.toContain("determines personal exposure");
  });

  it("uses an H1 and an actual embedded-form detector on contact", () => {
    const form = source("components/contact/VerifAirContactForm.tsx");
    expect(form).toMatch(/<h1[\s\S]*?id="contact-form-title"/);
    expect(form).not.toContain("formHost.childElementCount");
    expect(form).toContain('.hs-form:not(.hs-form-frame)');
    expect(form).toContain("The enquiry form could not be loaded.");
  });

  it("has no missing or case-mismatched absolute public asset references", () => {
    const bases = ["app", "components", "lib"];
    const refs = new Set<string>();
    const publicDirectory = path.join(root, "public");

    for (const base of bases) {
      const directory = path.join(root, base);
      for (const entry of fs.readdirSync(directory, { recursive: true })) {
        if (typeof entry !== "string" || !/\.(tsx?|mdx?)$/.test(entry)) continue;
        const text = fs.readFileSync(path.join(directory, entry), "utf8");
        for (const match of text.matchAll(/["'](\/assets\/[^"']+|\/downloads\/[^"']+)["']/g)) refs.add(match[1]);
      }
    }

    const publicFiles = new Set(
      fs
        .readdirSync(publicDirectory, { recursive: true })
        .filter((entry): entry is string => typeof entry === "string")
        .filter((entry) => fs.statSync(path.join(publicDirectory, entry)).isFile())
        .map((entry) => `/${entry.split(path.sep).join("/")}`),
    );

    const missing = [...refs].filter((ref) => !publicFiles.has(ref));

    expect(
      missing,
      `Missing or case-mismatched public assets: ${missing.join(", ")}`,
    ).toEqual([]);
  });
});
