import type { MetadataRoute } from "next";

import { pageContent } from "@/lib/content";
import { verifAirResources } from "@/lib/resources";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const genericRoutes = Object.keys(pageContent).filter(
    (route) => !["resources", "technology", "reporting", "reports"].includes(route),
  );

  const routes = [
    "",
    ...genericRoutes,
    "technology",
    "resources",
    "reporting",
    "privacy",
    "terms",
    "cookies",
    "search",
    ...verifAirResources.map((resource) => `resources/${resource.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}/${route}`,
    lastModified: new Date("2026-08-01"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : ["technology", "resources", "reporting"].includes(route)
          ? 0.8
          : 0.7,
  }));
}
