import {
  BellAlertIcon,
  ChartBarSquareIcon,
  DocumentTextIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import { Reveal } from "./Reveal";

const outcomes = [
  {
    icon: EyeIcon,
    title: "Air quality visibility",
    text: "Monitor particulate conditions across selected zones in near real time.",
  },
  {
    icon: BellAlertIcon,
    title: "Coordinated alerts",
    text: "Notify responsible teams when a configured operational trigger is reached.",
  },
  {
    icon: ChartBarSquareIcon,
    title: "Operational insight",
    text: "Review trends, events and changing conditions across the monitored environment.",
  },
  {
    icon: DocumentTextIcon,
    title: "Evidence-ready records",
    text: "Maintain time-stamped records that support reviews, reporting and due-diligence processes.",
  },
];

export function SolutionSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              The solution
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              Turn monitoring data into coordinated action.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              VerifAir is the operational layer that brings particulate
              readings, alerts, trends and records into a shared view for
              project teams.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl">
                <Image
                  src="/assets/VerifAir_dash.webp"
                  alt="Contractor team reviewing a particulate monitoring dashboard in a monitoring room"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-slate-500">
                Demonstration monitoring interface shown for product context.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.04}>
              <article className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {title}
                </h3>
                <p className="mt-3 text-base leading-6 text-slate-600">
                  {text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
