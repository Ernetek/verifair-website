"use client";

import {
  ArrowPathIcon,
  CloudIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  LifebuoyIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const capabilities = [
  {
    title: "EDGE COMPUTING & LOCAL INTELLIGENCE",
    body: "Local processing supporting the monitoring service.",
    Icon: CpuChipIcon,
  },
  {
    title: "INDEPENDENT CONNECTIVITY",
    body: "Telstra primary with Optus secondary connectivity.",
    Icon: SignalIcon,
  },
  {
    title: "REMOTE MANAGEMENT",
    body: "Remote software, configuration and support capability.",
    Icon: LifebuoyIcon,
  },
  {
    title: "RESILIENT OPERATION",
    body: "Automatic recovery and retention through connection interruptions.",
    Icon: ArrowPathIcon,
  },
  {
    title: "PRACTICAL DEPLOYMENT",
    body: "Easy to scale and move as project requirements change.",
    Icon: CloudIcon,
  },
  {
    title: "AUTHORISED ACCESS",
    body: "Shared browser-based visibility from authorised devices.",
    Icon: ComputerDesktopIcon,
  },
] as const;

export function PilotDeploymentSection() {
  const reducedMotion = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    let animationFrame = 0;
    let previousTimestamp = 0;

    const advance = (timestamp: number) => {
      const rail = railRef.current;
      const loopStart = rail?.querySelector<HTMLElement>('[data-carousel-set="duplicate"]');
      if (rail && loopStart) {
        if (previousTimestamp > 0) {
          rail.scrollLeft += (timestamp - previousTimestamp) * 0.035;
          if (rail.scrollLeft >= loopStart.offsetLeft) {
            rail.scrollLeft -= loopStart.offsetLeft;
          }
        }
        previousTimestamp = timestamp;
      }
      animationFrame = window.requestAnimationFrame(advance);
    };

    animationFrame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [reducedMotion]);

  return (
    <section
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="pilot-deployment-heading"
    >
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          CAPABILITIES &amp; DEPLOYMENT
        </p>
        <h2
          id="pilot-deployment-heading"
          className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl"
        >
          Designed around the project, not the other way around.
        </h2>
        <div className="mt-5 h-0.5 w-12 bg-blue-600" />
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          VerifAir deployments are configured around the project, its sites and zones, operational triggers and communications path. A
          pilot deployment may be available as an engagement option where a team wants to assess the approach in context.
        </p>

        <div
          className="mt-8 border-y border-slate-200 py-6"
          role="region"
          aria-roledescription="carousel"
          aria-label="VerifAir capabilities"
        >
          <p className="mb-4 text-xs font-semibold text-slate-500">
            The capability rail moves continuously. Swipe or scroll when reduced motion is enabled.
          </p>

          <div
            ref={railRef}
            className="flex overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Scrollable capability cards"
          >
            <div className="flex shrink-0 gap-4 pr-4" data-carousel-set="primary">
              {capabilities.map(({ title, body, Icon }, index) => (
                <article
                  key={title}
                  data-capability-card
                  className="flex min-h-56 w-[78vw] max-w-[20rem] shrink-0 flex-col border border-slate-200 bg-slate-50 p-5 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.5)] sm:w-[19rem] md:w-[19rem] lg:w-[18rem] xl:w-[17rem] 2xl:w-[18rem]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-11 place-items-center rounded-md border border-blue-200 bg-white text-blue-700">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-5 text-sm font-black leading-5 text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
                </article>
              ))}
            </div>
            <div className="flex shrink-0 gap-4 pr-4" data-carousel-set="duplicate" aria-hidden="true">
              {capabilities.map(({ title, body, Icon }, index) => (
                <article
                  key={`duplicate-${title}`}
                  className="flex min-h-56 w-[78vw] max-w-[20rem] shrink-0 flex-col border border-slate-200 bg-slate-50 p-5 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.5)] sm:w-[19rem] md:w-[19rem] lg:w-[18rem] xl:w-[17rem] 2xl:w-[18rem]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-11 place-items-center rounded-md border border-blue-200 bg-white text-blue-700">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-5 text-sm font-black leading-5 text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
