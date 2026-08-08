"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const industries = [
  {
    title: "Healthcare",
    href: "/healthcare",
    image: "/assets/industry-healthcare-environment.webp",
    imageAlt: "Construction worker near an occupied healthcare environment",
    imagePosition: "55% center",
    copy: "Visibility around occupied clinical interfaces during refurbishment and construction.",
  },
  {
    title: "Construction",
    href: "/construction",
    image: "/assets/industry-construction-environment.webp",
    imageAlt: "Workers completing dusty construction activity in a controlled work area",
    imagePosition: "center center",
    copy: "Visibility across active work fronts, boundaries and shared access points.",
  },
  {
    title: "Infrastructure",
    href: "/infrastructure",
    image: "/assets/industry-infrastructure-environment.webp",
    imageAlt: "Infrastructure construction inside a tunnel work zone",
    imagePosition: "center 52%",
    copy: "Visibility across changing work fronts, compounds and sensitive interfaces.",
  },
  {
    title: "Government",
    href: "/government",
    image: "/assets/industry-government-environment.webp",
    imageAlt: "Construction work beside a public pedestrian interface",
    imagePosition: "center center",
    copy: "Shared visibility and time-stamped records for public-asset projects.",
  },
  {
    title: "Schools",
    href: "/schools",
    image: "/assets/industry-education-environment.webp",
    imageAlt: "Students walking through an occupied school corridor beside external works",
    imagePosition: "center 38%",
    copy: "Visibility around occupied learning areas, access routes and temporary works.",
  },
  {
    title: "Commercial buildings",
    href: "/commercial-buildings",
    image: "/assets/industry-commercial-environment.webp",
    imageAlt: "Commercial building refurbishment continuing beside an occupied office area",
    imagePosition: "center center",
    copy: "Visibility across occupied tenancies, refurbishment areas and shared services.",
  },
] as const;

export function IndustriesSection() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = industries[active];

  function selectTab(index: number) {
    setActive(index);
    window.requestAnimationFrame(() => tabRefs.current[index]?.focus());
  }

  return (
    <section
      id="industries"
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          Applications
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
          Monitoring configured around the environment, work and people nearby.
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Illustrative applications only. Monitoring locations and workflows are
          configured for each project.
        </p>

        <div className="mt-10 hidden lg:grid lg:grid-cols-[0.28fr_0.72fr] lg:gap-10">
          <div
            role="tablist"
            aria-label="Example application environments"
            className="border-y border-slate-200"
          >
            {industries.map((industry, index) => (
              <button
                key={industry.title}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`industry-tab-${index}`}
                role="tab"
                aria-selected={active === index}
                aria-controls="industry-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  let nextIndex: number | null = null;

                  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    nextIndex = (index + 1) % industries.length;
                  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                    nextIndex = (index - 1 + industries.length) % industries.length;
                  } else if (event.key === "Home") {
                    nextIndex = 0;
                  } else if (event.key === "End") {
                    nextIndex = industries.length - 1;
                  }

                  if (nextIndex !== null) {
                    event.preventDefault();
                    selectTab(nextIndex);
                  }
                }}
                className="block w-full border-b border-slate-200 border-l-2 border-l-transparent px-4 py-5 text-left text-lg font-bold text-slate-600 transition last:border-b-0 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-selected:border-l-blue-600 aria-selected:text-blue-600"
              >
                {industry.title}
              </button>
            ))}
          </div>

          <div
            id="industry-panel"
            role="tabpanel"
            aria-labelledby={`industry-tab-${active}`}
            className="min-w-0 overflow-hidden border border-slate-200 bg-white"
          >
            <div className="relative min-h-[19rem] bg-slate-100 xl:min-h-[21rem]">
              <Image
                src={current.image}
                alt={current.imageAlt}
                fill
                sizes="(min-width: 1280px) 57vw, (min-width: 1024px) 52vw, 100vw"
                quality={95}
                style={{ objectPosition: current.imagePosition }}
                className="object-cover"
              />
            </div>
            <div className="grid gap-5 border-t border-slate-200 px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-end lg:px-7">
              <div>
                <h3 className="text-xl font-bold text-slate-950">{current.title}</h3>
                <p className="mt-2 max-w-3xl leading-7 text-slate-600">{current.copy}</p>
              </div>
              <Link
                href={current.href}
                className="inline-flex shrink-0 font-bold text-blue-600 hover:underline"
              >
                Explore {current.title.toLowerCase()} →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-y border-slate-200 lg:hidden">
          {industries.map((industry, index) => (
            <details
              key={industry.title}
              className="border-b border-slate-200 last:border-b-0"
              open={index === 0}
            >
              <summary className="cursor-pointer list-none py-5 text-lg font-bold marker:hidden">
                {industry.title}
              </summary>
              <div className="pb-7">
                <div className="relative aspect-[16/6] overflow-hidden bg-slate-100">
                  <Image
                    src={industry.image}
                    alt={industry.imageAlt}
                    fill
                    sizes="100vw"
                    quality={95}
                    style={{ objectPosition: industry.imagePosition }}
                    className="object-cover"
                  />
                </div>
                <p className="mt-5 leading-7 text-slate-600">{industry.copy}</p>
                <Link
                  href={industry.href}
                  className="mt-4 inline-flex font-bold text-blue-600"
                >
                  Explore application →
                </Link>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
