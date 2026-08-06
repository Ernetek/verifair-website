"use client";

import { SharedDashboardPreview } from "@/components/demonstration/ClinicalDashboards";

const stages = [
  {
    title: "Detection",
    body: "Dustlight measures PM1, PM2.5 and PM10 at the monitoring point and provides local visual and audible status information.",
  },
  {
    title: "Transmission",
    body: "The configured site connection transfers available readings to the VerifAir environment and can buffer data during temporary interruptions.",
  },
  {
    title: "Evaluation",
    body: "The platform presents current readings, trends, device state and project-specific settings for authorised review.",
  },
  {
    title: "Alert and notification",
    body: "Configured events are surfaced to nominated personnel through the agreed project workflow.",
  },
  {
    title: "Site response",
    body: "The responsible team reviews the location, activity and controls, then records the actions taken under the project response plan.",
  },
  {
    title: "Review and closure",
    body: "Readings, event timing and response notes are brought together for review before the event is closed.",
  },
];

const outcomes = [
  "Earlier awareness",
  "Coordinated response",
  "Time-stamped records",
  "Reduced reliance on isolated checks",
];

export function CoordinatedSolutionSection() {
  return (
    <section id="platform" className="border-b border-slate-200 bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="container">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-300">The VerifAir workflow</p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Site-wide real-time particulate monitoring, alerting and coordinated workflows.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Follow the system story from Dustlight sensing through platform
            visibility, project response and a reviewable incident record.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-0">
            {stages.map((stage, index) => (
              <article
                key={stage.title}
                data-workflow-stage={index}
                className="border-t border-white/15 py-8 last:border-b lg:min-h-[40vh]"
                tabIndex={0}
              >
                <div className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="font-mono text-sm text-blue-300">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{stage.title}</h3>
                    <p className="mt-3 max-w-xl leading-7 text-slate-300">{stage.body}</p>
                    <div className="mt-6 lg:hidden">
                      <SharedDashboardPreview />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <SharedDashboardPreview />
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Interface values are illustrative demonstration data.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid border-y border-white/20 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((outcome) => (
            <div key={outcome} className="border-b border-white/20 py-6 sm:border-r sm:px-6 lg:border-b-0 first:pl-0 last:border-r-0">
              <p className="text-lg font-bold">{outcome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
