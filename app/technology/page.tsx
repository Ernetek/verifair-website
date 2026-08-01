import type { Metadata } from "next";

import { TechnologyPage } from "@/components/technology/TechnologyPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Explore the VerifAir technology platform for particulate monitoring, site connectivity, alerts, dashboards and reporting.",
  alternates: { canonical: "/technology" },
  openGraph: {
    title: `Technology | ${siteConfig.name}`,
    description:
      "Connected monitoring for dust-sensitive environments.",
    url: "/technology",
  },
};

export default function TechnologyRoute() {
  return <TechnologyPage />;
}
