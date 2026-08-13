import type { Metadata } from "next";

import { ReportingPage } from "@/components/reporting/ReportingPage";

export const metadata: Metadata = {
  title: "Evidence Reporting Demonstration",
  description: "Explore simulated VerifAir monitoring evidence, response records and reporting outputs.",
  alternates: { canonical: "/demonstration/evidence-reporting" },
  robots: { index: false, follow: true },
};

export default function EvidenceReportingDemonstrationPage() {
  return <ReportingPage />;
}
