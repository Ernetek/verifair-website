import {
  ArrowPathRoundedSquareIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  CloudArrowUpIcon,
  DevicePhoneMobileIcon,
  SignalIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import { Reveal } from "./Reveal";

const capabilities = [
  "Always-on PM1 and PM2.5 monitoring across selected project zones",
  "Real-time dashboard visibility for authorised teams from any location",
  "Configured alerting and notification workflows aligned with the project response plan",
  "Time-stamped monitoring, response and review records",
];

const workflow = [
  {
    number: "01",
    icon: SignalIcon,
    title: "Detection",
    text: "Dustlight monitors PM1 and PM2.5 conditions at the selected location and provides clear local traffic-light alerting.",
  },
  {
    number: "02",
    icon: CloudArrowUpIcon,
    title: "Platform update",
    text: "Readings are transferred through the VerifAir site system and presented on the shared dashboard in real time.",
  },
  {
    number: "03",
    icon: BellAlertIcon,
    title: "Alerting",
    text: "Configured project thresholds and conditions create a visible alert event for the relevant monitoring zone.",
  },
  {
    number: "04",
    icon: DevicePhoneMobileIcon,
    title: "Notification",
    text: "Designated personnel receive the monitoring information needed to assess the event and coordinate the next action.",
  },
  {
    number: "05",
    icon: WrenchScrewdriverIcon,
    title: "Site response",
    text: "The responsible site team follows the project response plan, checks the work area and applies the required controls.",
  },
  {
    number: "06",
    icon: ClipboardDocumentCheckIcon,
    title: "Review and closure",
    text: "The event timeline, readings and response information are reviewed before the incident record is finalised and closed.",
  },
];

const benefits = [
  {
    icon: SignalIcon,
    title: "Earlier intervention",
    text: "Give teams visibility of changing particulate conditions while work is still underway.",
  },
  {
    icon: UserGroupIcon,
    title: "Coordinated response",
    text: "Provide responsible personnel with one shared view of the event and monitoring zone.",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Time-stamped evidence",
    text: "Retain a clear sequence of readings, alerts and review information for project records.",
  },
  {
    icon: ArrowPathRoundedSquareIcon,
    title: "Reduced manual reliance",
    text: "Support continuous site monitoring without depending on a worker to carry, pair or synchronise a personal device.",
  },
];

export function CoordinatedSolutionSection() {
  return (
    <section
      id="solution"
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="coordinated-solution-heading"
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-14">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                The VerifAir workflow
              </p>
              <h2
                id="coordinated-solution-heading"
                className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]"
              >
                Site-wide real-time dust monitoring, alerting and coordinated workflows that help reduce potential exposure risk.
              </h2>
              <div className="mt-5 h-0.5 w-12 bg-blue-600" />
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                VerifAir combines Dustlight sensing, real-time platform
                visibility, configured alerts and coordinated response workflows
                into one clear system. Teams can identify changing particulate
                conditions earlier, respond consistently and retain the records
                needed to support incident review and closure.
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-start gap-3 text-sm leading-6 text-slate-700 sm:text-base"
                  >
                    <CheckCircleIcon
                      className="mt-0.5 size-5 shrink-0 text-blue-600"
                      aria-hidden="true"
                    />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <figure className="h-full">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-lg sm:aspect-[16/10] lg:aspect-[4/3]">
                <Image
                  src="/assets/platform-dashboard.webp"
                  alt="VerifAir monitoring dashboard displayed in a project monitoring environment"
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-slate-500">
                Authorised teams can review real-time conditions, alerts,
                project zones and response information through the shared
                dashboard from any location.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-slate-200 pt-12 sm:mt-16 sm:pt-14">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                End-to-end workflow
              </p>
              <h3 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                One continuous path from a changing condition to a reviewed
                project record.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                Each stage gives the next responsible person the context needed
                to act without repeating the same information across multiple
                disconnected systems.
              </p>
            </div>
          </Reveal>

          <div className="relative mt-10">
            <div
              className="absolute bottom-6 left-6 top-6 w-px bg-blue-200 lg:bottom-auto lg:left-[8.333%] lg:right-[8.333%] lg:top-6 lg:h-px lg:w-auto"
              aria-hidden="true"
            />

            <ol className="relative grid gap-6 lg:grid-cols-6 lg:gap-4">
              {workflow.map(({ number, icon: Icon, title, text }, index) => (
                <li
                  key={number}
                  className="grid grid-cols-[3rem_1fr] gap-4 lg:block lg:text-center"
                >
                  <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-sm lg:mx-auto">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 lg:mt-5 lg:min-h-64 lg:p-4">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                      Step {number}
                    </span>
                    <h4 className="mt-2 text-lg font-bold text-slate-950">
                      {title}
                    </h4>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-200 pt-12 sm:mt-16 sm:pt-14">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="border-l-2 border-blue-600 pl-5"
                >
                  <Icon className="size-6 text-blue-600" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
