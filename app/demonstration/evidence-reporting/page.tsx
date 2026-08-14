import { redirect } from "next/navigation";

export const metadata = {
  title: "Redirected: Evidence Reporting",
  robots: { index: false, follow: true },
};

export default function EvidenceReportingDemonstrationPage() {
  redirect("/demonstration#evidence");
}

