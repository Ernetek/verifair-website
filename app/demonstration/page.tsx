import type { Metadata } from "next";

import { UnifiedDemonstration } from "@/components/demonstration/UnifiedDemonstration";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";

export const metadata: Metadata = {
  title: "End-to-End VerifAir Workflow Demonstration",
  description:
    "Watch the complete VerifAir operational workflow from real-time monitoring through alert, response, investigation, verification, and closure.",
  alternates: { canonical: "/demonstration" },
};

export default function DemonstrationPage() {
  return (
    <>
      <UnifiedDemonstration />
      <PageDisclaimer />
    </>
  );
}

