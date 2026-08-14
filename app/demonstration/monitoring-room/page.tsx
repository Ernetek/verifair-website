import { redirect } from "next/navigation";

export const metadata = {
  title: "Redirected: Monitoring Room",
  robots: { index: false, follow: true },
};

export default function MonitoringRoomDemonstrationPage() {
  redirect("/demonstration#monitoring");
}

