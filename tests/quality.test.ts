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
  it("uses the platform homepage anchor in navigation and markup", () => {
    expect(primaryNav.some((item) => item.href === "/#platform")).toBe(true);
    expect(source("components/home/CoordinatedSolution.tsx")).toContain('id="platform"');
    expect(source("app/globals.css")).toContain("scroll-margin-top");
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
    expect(source("app/reports/page.tsx")).toContain('permanentRedirect("/reporting")');
  });

  it("uses approved particulate metrics and concentration units", () => {
    expect(SUPPORTED_PARTICULATE_METRICS).toEqual(["PM1", "PM2.5", "PM10"]);
    expect(PARTICULATE_UNIT).toBe("µg/m³");

    const files = [
      "components/home/CoordinatedSolution.tsx",
      "components/home/ReportingProof.tsx",
      "components/reporting/ReportingPage.tsx",
      "components/technology/TechnologyPage.tsx",
    ].map(source).join("\n");

    expect(files).not.toContain("µg/m²");
    expect(files).not.toContain("PM1, PM2.5 and PM2.5");
  });

  it("does not use prohibited absolute claims", () => {
    const files = [
      "components/home/CoordinatedSolution.tsx",
      "components/technology/TechnologyPage.tsx",
      "components/reporting/ReportingPage.tsx",
    ].map(source).join("\n").toLowerCase();

    expect(files).not.toContain("failover guarantees");
    expect(files).not.toContain("always available");
    expect(files).not.toContain("determines personal exposure");
  });

  it("uses an H1 and an actual embedded-form detector on contact", () => {
    const form = source("components/contact/VerifAirContactForm.tsx");
    expect(form).toContain('<h1 id="contact-form-title">');
    expect(form).not.toContain("formHost.childElementCount");
    expect(form).toContain('"iframe, form, [data-hs-form-root], .hs-form"');
    expect(form).toContain("The enquiry form could not be loaded.");
  });

  it("has no missing absolute public asset references", () => {
    const bases = ["app", "components", "lib"];
    const refs = new Set<string>();

    for (const base of bases) {
      const directory = path.join(root, base);
      for (const entry of fs.readdirSync(directory, { recursive: true })) {
        if (typeof entry !== "string" || !/\.(tsx?|mdx?)$/.test(entry)) continue;
        const text = fs.readFileSync(path.join(directory, entry), "utf8");
        for (const match of text.matchAll(/["'](\/assets\/[^"']+|\/downloads\/[^"']+)["']/g)) refs.add(match[1]);
      }
    }

    for (const ref of refs) {
      expect(fs.existsSync(path.join(root, "public", ref))).toBe(true);
    }
  });
});
