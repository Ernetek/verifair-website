import { describe, expect, it } from "vitest";

import { verifAirResources } from "../lib/resources";
import { footerGroups, primaryNav } from "../lib/site";

describe("VerifAir public page configuration", () => {
  it("includes the rebuilt primary routes and homepage sections", () => {
    const routes = primaryNav.map((item) => item.href);

    expect(primaryNav.map((item) => item.label)).toEqual([
      "Product",
      "How It Works",
      "Solutions",
      "Resources",
      "About",
    ]);
    expect(routes).toContain("/#monitoring");
    expect(routes).toContain("/#workflow");
    expect(routes).toContain("/#industries");
    expect(routes).toContain("/resources");
    expect(routes).toContain("/about");
  });

  it("publishes a substantial resource library with unique slugs", () => {
    const slugs = verifAirResources.map((resource) => resource.slug);

    expect(verifAirResources.length).toBeGreaterThanOrEqual(10);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("links reporting to the homepage preview from the footer", () => {
    const links = footerGroups.flatMap((group) => group.links);

    expect(links).toContainEqual({
      label: "Reporting",
      href: "/#reportpreview",
    });
  });
});
