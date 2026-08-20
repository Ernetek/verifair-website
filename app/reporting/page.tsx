import type { Metadata } from "next";

import { ReportingPage } from "@/components/reporting/ReportingPage";

export const metadata: Metadata = {
  title: "Reporting",
  description: "Turn operational activity into a connected VerifAir record for review and reporting.",
  alternates: { canonical: "/reporting" }
};

export default function ReportingRoute() {
  return <ReportingPage />;
}
