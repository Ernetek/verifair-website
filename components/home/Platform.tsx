import {
  BellAlertIcon,
  ArrowPathRoundedSquareIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import { Reveal } from "./Reveal";

const workflow = [
  {
    number: "01",
    title: "Real-time monitoring",
    text: "Dustlight particulate monitors collect real-time PM1 and PM2.5 readings at selected monitoring points.",
    image: "/assets/dustlight.webp",
    imageAlt: "Approved Dustlight particulate monitor",
  },
  {
    number: "02",
    title: "Connectivity and site setup",
    text: "Gateway and site-connectivity components securely transfer readings across the monitored environment.",
    image: "/assets/Gateway.webp",
    imageAlt: "Gateway and site-connectivity component",
  },
  {
    number: "03",
    title: "Edge and cloud processing",
    text: "Local buffering and edge-first processing help maintain monitoring continuity during connectivity interruptions.",
    image: "/assets/Edge.webp",
    imageAlt: "Diagram representing edge-first processing and local buffering",
  },
  {
    number: "04",
    title: "Dashboards, alerts and reporting",
    text: "VerifAir presents real-time conditions, configured alerts, trends and downloadable records through a customer-specific dashboard available from anywhere with an authorised internet connection.",
    image: "/assets/alerts.webp",
    imageAlt: "Demonstration VerifAir dashboard displayed on desktop and mobile",
  },
];

const operationalOutcomes = [
  {
    title: "Earlier intervention",
    body: "Identify changing particulate conditions before they become prolonged or widespread exposure events.",
    icon: ClockIcon,
  },
  {
    title: "Coordinated response",
    body: "Route alerts and information to the people responsible for taking action on site.",
    icon: BellAlertIcon,
  },
  {
    title: "Documented evidence",
    body: "Maintain time-stamped monitoring records for project reviews, investigations and reporting.",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "Reduced manual oversight",
    body: "Supplement periodic inspections and spot checks with continuous monitoring across selected zones.",
    icon: ArrowPathRoundedSquareIcon,
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
              Platform and benefits
            </p>
            <h2
              id="platform-heading"
              className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]"
            >
              A technically clear path from monitoring point to shared action.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.05}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5 pb-0 sm:p-6 sm:pb-0">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">
                    {step.title}
                  </h3>
                </div>
                <div className="relative mx-5 mt-5 flex min-h-48 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:mx-6">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    width={640}
                    height={480}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="max-h-56 w-full object-contain p-3"
                  />
                </div>
                <p className="mt-5 flex-1 px-5 pb-6 text-base leading-6 text-slate-600 sm:px-6">
                  {step.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-500">
          Product and interface imagery is illustrative unless explicitly
          identified as approved production hardware or a live customer
          deployment.
        </p>

        <div className="my-14 h-px bg-slate-200 sm:my-16" />

        <section aria-labelledby="operational-outcomes-heading">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                  Platform outcomes
                </p>
                <h3
                  id="operational-outcomes-heading"
                  className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]"
                >
                  Practical outcomes for project teams.
                </h3>
                <div className="mt-5 h-0.5 w-12 bg-blue-600" />
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {operationalOutcomes.map((outcome, index) => {
              const Icon = outcome.icon;
              return (
                <Reveal key={outcome.title} delay={index * 0.05}>
                  <article className="h-full rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <h4 className="mt-5 text-lg font-bold text-slate-950">
                      {outcome.title}
                    </h4>
                    <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                      {outcome.body}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
