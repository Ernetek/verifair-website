import { redirect } from "next/navigation";

export const metadata = {
  title: "Redirected: Workflow",
  robots: { index: false, follow: true },
};

export default function WorkflowDemonstrationPage() {
  redirect("/demonstration#incident");
}

