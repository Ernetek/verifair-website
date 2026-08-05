"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const industries = [
  {
    title: "Healthcare",
    href: "/healthcare",
    image: "/assets/industry-healthcare-environment.webp",
    copy: "Monitor selected work zones, occupied clinical interfaces and access routes during refurbishment or construction.",
    uses: ["Occupied clinical areas", "Refurbishment boundaries", "Plant and access routes"],
  },
  {
    title: "Construction",
    href: "/construction",
    image: "/assets/industry-construction-environment.webp",
    copy: "Provide project teams with current particulate conditions across work fronts, boundaries and neighbouring interfaces.",
    uses: ["Active work fronts", "Site boundaries", "Shared access points"],
  },
  {
    title: "Infrastructure",
    href: "/infrastructure",
    image: "/assets/industry-infrastructure-environment.webp",
    copy: "Coordinate monitoring across changing compounds, public interfaces and distributed works.",
    uses: ["Linear projects", "Compounds", "Sensitive receptors"],
  },
  {
    title: "Government",
    href: "/government",
    image: "/assets/industry-government-environment.webp",
    copy: "Support transparent project oversight with time-stamped monitoring and response records.",
    uses: ["Public assets", "Programme oversight", "Contractor coordination"],
  },
  {
    title: "Schools",
    href: "/schools",
    image: "/assets/industry-education-environment.webp",
    copy: "Maintain visibility around occupied learning spaces, work boundaries and arrival routes.",
    uses: ["Classroom interfaces", "Access routes", "Holiday works"],
  },
  {
    title: "Commercial buildings",
    href: "/commercial-buildings",
    image: "/assets/industry-commercial-environment.webp",
    copy: "Monitor occupied floors, refurbishment zones and shared building services while operations continue.",
    uses: ["Occupied tenancies", "Refurbishment floors", "Shared services"],
  },
];

export function IndustriesSection() {
  const [active, setActive] = useState(0);
  const current = industries[active];

  return (
    <section id="industries" className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Industries</p>
        <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
          Monitoring configured around the environment, work and people nearby.
        </h2>

        <div className="mt-10 hidden lg:grid lg:grid-cols-[0.34fr_0.66fr] lg:gap-10">
          <div role="tablist" aria-label="Industries" className="border-y border-slate-200">
            {industries.map((industry, index) => (
              <button
                key={industry.title}
                id={`industry-tab-${index}`}
                role="tab"
                aria-selected={active === index}
                aria-controls="industry-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    event.preventDefault();
                    setActive((index + 1) % industries.length);
                  }
                  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    setActive((index - 1 + industries.length) % industries.length);
                  }
                }}
                className="block w-full border-b border-slate-200 px-1 py-5 text-left text-lg font-bold text-slate-600 last:border-b-0 aria-selected:text-blue-600"
              >
                {industry.title}
              </button>
            ))}
          </div>

          <div id="industry-panel" role="tabpanel" aria-labelledby={`industry-tab-${active}`} className="grid grid-cols-[1.05fr_0.95fr]">
            <Image src={current.image} alt="" width={900} height={700} className="h-full min-h-[30rem] w-full object-cover" />
            <div className="bg-slate-950 p-10 text-white">
              <h3 className="text-3xl font-bold">{current.title}</h3>
              <p className="mt-5 text-lg leading-8 text-slate-300">{current.copy}</p>
              <ul className="mt-8 border-y border-white/15">
                {current.uses.map((use) => <li key={use} className="border-b border-white/15 py-4 last:border-b-0">{use}</li>)}
              </ul>
              <Link href={current.href} className="mt-8 inline-flex font-bold text-blue-300 hover:underline">Explore {current.title.toLowerCase()} →</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-y border-slate-200 lg:hidden">
          {industries.map((industry, index) => (
            <details key={industry.title} className="border-b border-slate-200 last:border-b-0" open={index === 0}>
              <summary className="cursor-pointer list-none py-5 text-lg font-bold marker:hidden">{industry.title}</summary>
              <div className="pb-7">
                <Image src={industry.image} alt="" width={800} height={560} className="h-auto w-full object-cover" />
                <p className="mt-5 leading-7 text-slate-600">{industry.copy}</p>
                <ul className="mt-5 border-y border-slate-200">
                  {industry.uses.map((use) => <li key={use} className="border-b border-slate-200 py-3 last:border-b-0">{use}</li>)}
                </ul>
                <Link href={industry.href} className="mt-5 inline-flex font-bold text-blue-600">Explore industry →</Link>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
