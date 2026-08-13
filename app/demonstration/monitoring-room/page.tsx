import type { Metadata } from "next";

import { MonitoringRoomDisplayPage } from "@/components/demonstration/ClinicalDashboards";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";

export const metadata: Metadata = {
  title: "Monitoring Room Display Demonstration",
  description:
    "View a high-visibility VerifAir monitoring-room display with green, amber and red zone status.",
  alternates: {
    canonical: "/demonstration/monitoring-room",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MonitoringRoomDemonstrationPage() {
  return (
    <>
      <section className="bg-slate-100 py-8 sm:py-12">
        <div className="container">
          <MonitoringRoomDisplayPage />
        </div>
      </section>
      <PageDisclaimer />
    </>
  );
}
