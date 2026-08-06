import type { Metadata } from "next";

import { SharedDashboardPage } from "@/components/demonstration/ClinicalDashboards";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";

export const metadata: Metadata = {
  title: "Shared Dashboard Demonstration",
  description:
    "Explore a VerifAir shared dashboard demonstration using neutral sample particulate monitoring data.",
  alternates: {
    canonical: "/demonstration/shared-dashboard",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SharedDashboardDemonstrationPage() {
  return (
    <>
      <main className="bg-slate-100 py-8 sm:py-12">
        <div className="container">
          <SharedDashboardPage />
        </div>
      </main>
      <PageDisclaimer />
    </>
  );
}
