import type { Metadata } from "next";

import { MonitoringPage } from "@/components/monitoring/MonitoringPage";

export const metadata: Metadata = {
  title: "Monitoring",
  description:
    "See changing particulate conditions across sites, zones and monitoring locations with VerifAir Monitoring.",
  alternates: { canonical: "/monitoring" },
};

export default function MonitoringRoute() {
  return <MonitoringPage />;
}