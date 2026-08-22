"use client";

import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  LifebuoyIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  const pauseRef = useRef({ hover: false, focus: false, interaction: false });
  const interactionTimerRef = useRef<number | undefined>(undefined);
  const dragRef = useRef({ active: false, startX: 0, startScrollLeft: 0 });
  const [dragging, setDragging] = useState(false);

  const pauseForInteraction = () => {
    pauseRef.current.interaction = true;
    window.clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = window.setTimeout(() => {
      pauseRef.current.interaction = false;
    }, 4_000);
  };

  const moveRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-capability-card]");
    const gap = 16;
    rail.scrollBy({
      left: direction * ((card?.offsetWidth ?? 288) + gap),
      behavior: reducedMotion ? "auto" : "smooth",
    });
    pauseForInteraction();
  };

  useEffect(() => {
    if (reducedMotion) return;
    const intervalId = window.setInterval(() => {
      const rail = railRef.current;
      const card = rail?.querySelector<HTMLElement>("[data-capability-card]");
      if (!rail || !card || Object.values(pauseRef.current).some(Boolean) || document.hidden) return;
      const gap = 16;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
      rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + card.offsetWidth + gap, behavior: "smooth" });
    }, 4_500);
    return () => window.clearInterval(intervalId);
  }, [reducedMotion]);

  useEffect(() => () => window.clearTimeout(interactionTimerRef.current), []);

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
          onMouseEnter={() => { pauseRef.current.hover = true; }}
          onMouseLeave={() => { pauseRef.current.hover = false; }}
          onFocusCapture={() => { pauseRef.current.focus = true; }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) pauseRef.current.focus = false;
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveRail(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              moveRail(1);
            }
          }}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-slate-500">Swipe or scroll to explore all six capabilities.</p>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => moveRail(-1)}
                className="grid size-9 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-blue-500 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Previous capability"
              >
                <ChevronLeftIcon className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveRail(1)}
                className="grid size-9 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-blue-500 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Next capability"
              >
                <ChevronRightIcon className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={railRef}
            tabIndex={0}
            className={`flex cursor-grab overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing select-none" : ""}`}
            onWheel={pauseForInteraction}
            onPointerDown={(event) => {
              pauseRef.current.interaction = true;
              if (event.pointerType !== "mouse" || !railRef.current) return;
              dragRef.current = { active: true, startX: event.clientX, startScrollLeft: railRef.current.scrollLeft };
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(true);
            }}
            onPointerMove={(event) => {
              if (!dragRef.current.active || !railRef.current) return;
              railRef.current.scrollLeft = dragRef.current.startScrollLeft - (event.clientX - dragRef.current.startX);
            }}
            onPointerUp={(event) => {
              if (dragRef.current.active) event.currentTarget.releasePointerCapture(event.pointerId);
              dragRef.current.active = false;
              setDragging(false);
              pauseForInteraction();
            }}
            onPointerCancel={() => {
              dragRef.current.active = false;
              setDragging(false);
              pauseForInteraction();
            }}
            aria-label="Scrollable capability cards"
          >
            <div className="flex shrink-0 gap-4 pr-4">
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
          </div>
        </div>

      </div>
    </section>
  );
}
