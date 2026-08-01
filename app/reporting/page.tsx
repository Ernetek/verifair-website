import type { Metadata } from "next";

import { ReportingPage } from "@/components/reporting/ReportingPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reporting",
  description:
    "Review VerifAir monitoring report types, report contents and a demonstration project report preview.",
  alternates: { canonical: "/reporting" },
  openGraph: {
    title: `Reporting | ${siteConfig.name}`,
    description:
      "Clear monitoring records for project teams and stakeholders.",
    url: "/reporting",
  },
};

export default function ReportingRoute() {
  return <ReportingPage />;
}
