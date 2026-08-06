import Link from "next/link";

import { MonitoringRoomPreview } from "@/components/demonstration/ClinicalDashboards";

export function MonitoringRoomSection() {
  return (
    <section
      className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24"
      aria-labelledby="monitoring-room-title"
    >
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Real-time monitoring
            </p>
            <h2
              id="monitoring-room-title"
              className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl"
            >
              See every configured zone and its current state instantly.
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Each tile is dominated by its live status colour, with a
              persistent zone number, location name, PM1 and PM2.5 readings and
              last-update state. The demonstration automatically changes levels
              and status so the display can be assessed as an operational
              wall-screen concept.
            </p>

            <Link
              href="/demonstration/monitoring-room"
              className="mt-6 inline-flex font-bold text-blue-600 hover:underline"
            >
              Open the monitoring room demonstration →
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <MonitoringRoomPreview />
        </div>
      </div>
    </section>
  );
}
