import type { Metadata } from "next";

import { ResourcesPage } from "@/components/resources/ResourcesPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dust Monitoring Resources",
  description:
    "Practical VerifAir guides, project checklists, reporting information and links to official Australian work health and safety sources.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: `Dust Monitoring Resources | ${siteConfig.name}`,
    description:
      "Practical resources for dust monitoring and project planning.",
    url: "/resources",
  },
};

export default function ResourcesRoute() {
  return <ResourcesPage />;
}
