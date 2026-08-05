"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { PARTICULATE_UNIT } from "@/lib/metrics";

const stages = [
  {
    title: "Detection",
    body: "Dustlight measures PM1, PM2.5 and PM10 at the monitoring point and provides local visual and audible status information.",
    visual: "environment",
  },
  {
    title: "Transmission",
    body: "The configured site connection transfers available readings to the VerifAir environment and can buffer data during temporary interruptions.",
    visual: "system",
  },
  {
    title: "Evaluation",
    body: "The platform presents current readings, trends, device state and project-specific settings for authorised review.",
    visual: "dashboard",
  },
  {
    title: "Alert and notification",
    body: "Configured events are surfaced to nominated personnel through the agreed project workflow.",
    visual: "dashboard",
  },
  {
    title: "Site response",
    body: "The responsible team reviews the location, activity and controls, then records the actions taken under the project response plan.",
    visual: "environment2",
  },
  {
    title: "Review and closure",
    body: "Readings, event timing and response notes are brought together for review before the event is closed.",
    visual: "report",
  },
];

const outcomes = [
  "Earlier awareness",
  "Coordinated response",
  "Time-stamped records",
  "Reduced reliance on isolated checks",
];

function DemoDashboard({ report = false }: { report?: boolean }) {
  return (
    <div className="border border-slate-300 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            Demonstration data
          </p>
          <p className="mt-1 font-bold text-slate-950">
            {report ? "Event review" : "Live monitoring view"}
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500">Sample project</span>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm text-slate-500">Zone B · PM2.5</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">
            18 <span className="text-base font-medium text-slate-500">{PARTICULATE_UNIT}</span>
          </p>
          <div className="mt-5 border-l-4 border-amber-500 pl-4">
            <p className="text-sm font-bold text-slate-950">Review event</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Demonstration threshold event recorded at 10:42.
            </p>
          </div>
        </div>
        <svg viewBox="0 0 420 180" role="img" aria-label="Demonstration particulate trend chart" className="w-full">
          <title>Demonstration particulate trend chart</title>
          <path d="M0 150 C55 140 80 120 120 125 C170 130 190 40 235 65 C280 90 300 55 340 75 C370 88 390 60 420 50" fill="none" stroke="currentColor" strokeWidth="5" className="text-blue-600" />
          <line x1="0" x2="420" y1="105" y2="105" stroke="currentColor" strokeDasharray="8 8" className="text-amber-500" />
          <line x1="0" x2="420" y1="170" y2="170" stroke="currentColor" className="text-slate-300" />
        </svg>
      </div>
    </div>
  );
}

export function CoordinatedSolutionSection() {
  const [active, setActive] = useState(0);
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-workflow-stage]"));
    if (reduceMotion || nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.workflowStage));
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.5, 0.8] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [reduceMotion]);

  const visual = stages[active].visual;

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
                onFocus={() => setActive(index)}
              >
                <div className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="font-mono text-sm text-blue-300">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{stage.title}</h3>
                    <p className="mt-3 max-w-xl leading-7 text-slate-300">{stage.body}</p>
                    <div className="mt-6 lg:hidden">
                      {stage.visual === "dashboard" || stage.visual === "system" || stage.visual === "report" ? (
                        <DemoDashboard report={stage.visual === "report"} />
                      ) : (
                        <Image
                          src={stage.visual === "environment2" ? "/assets/industry-construction-environment.webp" : "/assets/industry-healthcare-environment.webp"}
                          alt=""
                          width={900}
                          height={620}
                          className="h-auto w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              {visual === "dashboard" || visual === "system" || visual === "report" ? (
                <DemoDashboard report={visual === "report"} />
              ) : (
                <Image
                  src={visual === "environment2" ? "/assets/industry-construction-environment.webp" : "/assets/industry-healthcare-environment.webp"}
                  alt=""
                  width={1100}
                  height={760}
                  className="h-auto w-full object-cover"
                  priority={false}
                />
              )}
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Environment imagery and interface values are illustrative. All readings shown are demonstration data.
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
