import type { Metadata } from "next";

import { WorkflowPage as WorkflowProductPage } from "@/components/workflow/WorkflowPage";

export const metadata: Metadata = {
  title: "Workflow",
  description: "Coordinate particulate alerts, response activity and the connected operational record with VerifAir Workflow.",
  alternates: { canonical: "/workflow" }
};

export default function WorkflowPage() {
  return <WorkflowProductPage />;
}