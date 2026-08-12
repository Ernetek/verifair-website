import type { Metadata } from "next";

import { ProductDemonstration } from "@/components/demonstration/ProductDemonstration";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";

export const metadata: Metadata = {
  title: "Monitoring Room Display Demonstration",
  description:
    "Replay a deterministic VerifAir product demonstration across four simulated monitoring locations.",
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
          <ProductDemonstration />
        </div>
      </section>
      <PageDisclaimer />
    </>
  );
}
