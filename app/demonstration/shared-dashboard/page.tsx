import { redirect } from "next/navigation";

export const metadata = {
  title: "Redirected: Shared Dashboard",
  robots: { index: false, follow: true },
};

export default function SharedDashboardDemonstrationPage() {
  redirect("/demonstration#monitoring");
}

