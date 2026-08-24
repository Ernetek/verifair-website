"use client";

import { useEffect, useRef, useState } from "react";

const capabilityCards = [
  {
    title: "Monitoring",
    description: "See particulate conditions and device health in one operational view.",
  },
  {
    title: "Alert response",
    description: "Open raised events, assign ownership and keep the task flow visible.",
  },
  {
    title: "Evidence",
    description: "Attach site records, comments and supporting material to the event record.",
  },
  {
    title: "Reporting",
    description: "Turn the connected record into a review-ready operational report.",
  },
  {
    title: "Portfolio view",
    description: "Scale from one site to multiple monitoring locations and wider operations.",
  },
] as const;

export function CapabilitiesSection() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || !railRef.current) return;

    const timer = window.setInterval(() => {
      const node = railRef.current;
      if (!node) return;
      const maxScroll = node.scrollWidth - node.clientWidth;
      if (maxScroll <= 0) return;
      const nextScroll = node.scrollLeft >= maxScroll ? 0 : node.scrollLeft + 180;
      node.scrollTo({ left: nextScroll, behavior: "smooth" });
    }, 2400);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const scrollToNextCard = () => {
    const node = railRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("[data-capability-card]");
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    const maxScroll = node.scrollWidth - node.clientWidth;
    const nextScroll = node.scrollLeft >= maxScroll ? 0 : node.scrollLeft + cardWidth;
    node.scrollTo({ left: nextScroll, behavior: "smooth" });
  };

  return (
    <section
      className="border-b border-slate-200 bg-slate-50 py-12 sm:py-16"
      aria-labelledby="homepage-capabilities-title"
      role="region"
      aria-label="VerifAir capabilities"
    >
      <div className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Operational capability</p>
            <h2 id="homepage-capabilities-title" className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              A complete operational picture built for changing conditions.
            </h2>
          </div>
          <button
            type="button"
            onClick={scrollToNextCard}
            aria-label="Next capability"
            className="inline-flex min-h-11 items-center justify-center border border-slate-300 bg-white px-4 text-xs font-black uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-100"
          >
            Next capability
          </button>
        </div>

        <div
          ref={railRef}
          aria-label="Scrollable capability cards"
          className="mt-8 flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {capabilityCards.map(({ title, description }) => (
            <article
              key={title}
              data-capability-card
              className="min-w-[16rem] snap-start rounded-none border border-slate-200 bg-white p-5 shadow-sm sm:min-w-[20rem] lg:min-w-[18rem]"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">Capability</p>
              <h3 className="mt-3 text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
