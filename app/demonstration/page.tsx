import type { Metadata } from "next";

import { DemonstrationOverview } from "@/components/demonstration/DemonstrationOverview";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";

export const metadata: Metadata = {
  title: "Product Demonstrations",
  description: "Choose a VerifAir monitoring-room, guided workflow or evidence-reporting demonstration.",
  alternates: { canonical: "/demonstration" },
};

export default function DemonstrationPage() {
  return <><DemonstrationOverview /><PageDisclaimer /></>;
}
