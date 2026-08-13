import type { MetadataRoute } from "next";

import { pageContent } from "../lib/content";
import { verifAirResources } from "../lib/resources";
import { siteConfig } from "../lib/site";

const PAGE_UPDATED = "2026-08-05";

export default function sitemap(): MetadataRoute.Sitemap {
  const genericRoutes = Object.keys(pageContent).filter(
    (route) => !["resources", "technology", "reporting", "reports", "search", "case-studies"].includes(route),
  );

  const routes = [
    "",
    ...genericRoutes,
    "technology",
    "demonstration",
    "resources",
    "faq",
    "privacy",
    "terms",
    "cookies",
    ...verifAirResources.map((resource) => `resources/${resource.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}/${route}`,
    lastModified: new Date(
      route.startsWith("resources/")
        ? verifAirResources.find((item) => `resources/${item.slug}` === route)?.updated ?? PAGE_UPDATED
        : PAGE_UPDATED,
    ),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : ["technology", "resources"].includes(route) ? 0.8 : 0.7,
  }));
}
