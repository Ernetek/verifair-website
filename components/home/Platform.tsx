import {
  BellAlertIcon,
  BoltIcon,
  ClipboardDocumentCheckIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import { Reveal } from "./Reveal";

const workflow = [
  {
    number: "01",
    title: "Real-time fine-particle monitoring",
    text: "Dustlight monitors collect PM1 and PM2.5 readings at selected monitoring points.",
    image: "/assets/dustlight.webp",
    imageAlt: "Approved Dustlight particulate monitor",
  },
  {
    number: "02",
    title: "Extended site connectivity",
    text: "VerifAir extends the practical reach of Dustlight Bluetooth monitoring across multiple zones using configured site-connectivity components.",
    image: "/assets/Gateway.webp",
    imageAlt: "Site connectivity component used within a VerifAir deployment",
  },
  {
    number: "03",
    title: "Local resilience",
    text: "Edge-first processing and local buffering help preserve monitoring continuity during temporary connectivity interruptions.",
    image: "/assets/Edge.webp",
    imageAlt: "Illustration representing local processing and data buffering",
  },
  {
    number: "04",
    title: "Dashboard access from anywhere",
    text: "Authorised teams can review live conditions, alerts, trends and downloadable records through a shared web dashboard from anywhere with an internet connection.",
    image: "/assets/Dashboard.webp",
    imageAlt: "VerifAir demonstration dashboard shown on desktop and mobile",
  },
];

const operationalOutcomes = [
  {
    title: "Earlier intervention",
    body: "Identify changing fine-particle conditions before they become prolonged or widespread events.",
    icon: BoltIcon,
  },
  {
    title: "Coordinated response",
    body: "Route alerts and monitoring context to the people responsible for investigating and acting on site.",
    icon: BellAlertIcon,
  },
  {
    title: "Documented evidence",
    body: "Maintain time-stamped monitoring records for project reviews, investigations and reporting.",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "Reduced manual oversight",
    body: "Supplement inspections and spot checks with continuous monitoring across selected zones.",
    icon: CpuChipIcon,
  },
];

export function PlatformSection() {
  return (
    <section
      id="platform"
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="platform-heading"
    >
      <div className="container">
        <Reveal>
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              The VerifAir system
            </p>
            <h2
              id="platform-heading"
              className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]"
            >
              Real-time monitoring that helps teams minimise potential exposure risk.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              VerifAir connects approved Dustlight monitors, site connectivity,
              local resilience and a globally accessible dashboard into one
              coordinated operational system.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.04}>
              <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                  {step.number}
                </span>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-xl bg-slate-50">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-3"
                  />
                </div>
                <p className="mt-5 text-base leading-7 text-slate-600">
                  {step.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Platform outcomes
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              Practical outcomes for project teams.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {operationalOutcomes.map(({ icon: Icon, title, body }, index) => (
            <Reveal key={title} delay={index * 0.04}>
              <article className="h-full rounded-xl border border-blue-100 bg-blue-50/70 p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
