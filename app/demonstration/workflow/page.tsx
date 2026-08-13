import type { Metadata } from "next";

import { ProductDemonstration } from "@/components/demonstration/ProductDemonstration";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";

export const metadata: Metadata = {
  title: "Guided Monitoring Workflow Demonstration",
  description:
    "Follow a guided VerifAir workflow from monitoring and alert notification through site response, evidence and closure.",
  alternates: { canonical: "/demonstration/workflow" },
  robots: { index: false, follow: true },
};

export default function WorkflowDemonstrationPage() {
  return (
    <>
      <section className="overflow-x-hidden bg-slate-100 py-8 sm:py-12">
        <div className="container">
          <ProductDemonstration />
        </div>
      </section>
      <PageDisclaimer />
    </>
  );
}
