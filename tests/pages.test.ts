import { describe, expect, it } from "vitest";

import { verifAirResources } from "../lib/resources";
import { footerGroups, primaryNav } from "../lib/site";

describe("VerifAir public page configuration", () => {
  it("includes the rebuilt primary routes", () => {
    const routes = primaryNav.map((item) => item.href);

    expect(routes).toContain("/technology");
    expect(routes).toContain("/resources");
    expect(routes).toContain("/reporting");
  });

  it("publishes a substantial resource library with unique slugs", () => {
    const slugs = verifAirResources.map((resource) => resource.slug);

    expect(verifAirResources.length).toBeGreaterThanOrEqual(10);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("links reporting from the footer", () => {
    const links = footerGroups.flatMap((group) => group.links);

    expect(links).toContainEqual({
      label: "Reporting",
      href: "/reporting",
    });
  });
});
