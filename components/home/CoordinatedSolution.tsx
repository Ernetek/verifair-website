"use client";

import { SharedDashboardPreview } from "@/components/demonstration/ClinicalDashboards";

const stages = [
  {
    title: "Detection",
    body: "Dustlight measures PM1, PM2.5 and PM10 at the monitoring point, giving teams earlier awareness of changing conditions.",
  },
  {
    title: "Transmission",
    body: "Available readings are transferred to the shared VerifAir environment, with buffering available during temporary connection interruptions.",
  },
  {
    title: "Evaluation",
    body: "Authorised users review current readings, trends, device state and configured project settings in one shared dashboard.",
  },
  {
    title: "Alert and notification",
    body: "Configured events are surfaced to nominated personnel with time-stamped context for a coordinated response.",
  },
  {
    title: "Site response",
    body: "The responsible team checks the location, work activity and controls, then records the practical action taken.",
  },
  {
    title: "Review and closure",
    body: "Readings, timing, acknowledgement and response actions are reviewed together before the event is closed.",
  },
];

export function CoordinatedSolutionSection() {
  return (
    <section
      id="platform"
      className="border-b border-slate-200 bg-slate-950 py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="container">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
            Shared environment overview & workflows
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            One shared view from detection to closure.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            The shared dashboard connects detection, visibility, notification,
            action and review in one operational record.
          </p>
        </div>

        <div className="mt-12">
          <SharedDashboardPreview />
          <p className="mt-3 text-xs leading-5 text-slate-400">
            Interface values and response actions are illustrative demonstration data.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <article
              key={stage.title}
              data-workflow-stage={index}
              className="bg-slate-950 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300 sm:p-7"
              tabIndex={0}
            >
              <span className="font-mono text-sm font-bold text-blue-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-bold text-white sm:text-2xl">
                {stage.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-300">{stage.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
