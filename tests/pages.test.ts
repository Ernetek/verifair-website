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

  it("publishes ten VerifAir knowledge resources", () => {
    expect(verifAirResources).toHaveLength(10);
    expect(new Set(verifAirResources.map((resource) => resource.slug)).size).toBe(10);
  });

  it("links reporting from the footer", () => {
    const links = footerGroups.flatMap((group) => group.links);

    expect(links).toContainEqual({
      label: "Reporting",
      href: "/reporting",
    });
  });
});
