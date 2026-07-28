import type { MetadataRoute } from "next";
import { pageContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", ...Object.keys(pageContent), "privacy", "terms", "cookies", "search"];
  return routes.map((route) => ({
    url: `${siteConfig.url}/${route}`,
    lastModified: new Date("2026-07-28"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
