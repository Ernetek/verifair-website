import {
  BellAlertIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  MapPinIcon,
  SignalIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";

const stages = [
  {
    icon: SignalIcon,
    title: "Environmental monitoring",
    body: "Dustlight particulate monitors capture PM1, PM2.5 and PM10 readings at selected monitoring points.",
  },
  {
    icon: MapPinIcon,
    title: "Site connectivity",
    body: "Configured site-connectivity components transfer readings across the monitored environment.",
  },
  {
    icon: CpuChipIcon,
    title: "Secure data processing",
    body: "Readings are processed and organised so authorised teams can review current conditions and trends.",
  },
  {
    icon: ChartBarIcon,
    title: "Dashboards, alerts and reports",
    body: "VerifAir presents live conditions, configured alerts and downloadable records through a shared operational interface.",
  },
];

const capabilities = [
  "PM1, PM2.5 and PM10 monitoring",
  "Multiple monitoring zones",
  "Current conditions and historical trends",
  "Device and connectivity status",
  "Configurable alerts",
  "Local resilience during temporary connectivity issues",
];

const projectTypes = [
  "Healthcare refurbishment",
  "Construction projects",
  "Infrastructure and civil works",
  "Government assets",
  "Education facilities",
  "Commercial refurbishment",
];

const supportItems = [
  {
    icon: BuildingOffice2Icon,
    title: "Installation planning",
    body: "Plan monitoring objectives, locations, site interfaces and access requirements before deployment.",
  },
  {
    icon: BellAlertIcon,
    title: "System monitoring",
    body: "Review device and connectivity status so project teams can respond to operational issues.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Maintenance coordination",
    body: "Coordinate routine servicing, calibration requirements and approved device support.",
  },
  {
    icon: CloudArrowUpIcon,
    title: "Ongoing support",
    body: "Support authorised users with platform access, reporting workflows and project configuration.",
  },
];

export function TechnologyPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Technology
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Connected monitoring for dust-sensitive environments.
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              VerifAir brings environmental monitoring, site connectivity,
              alerts, dashboards and reporting together in one coordinated
              platform.
            </p>
            <Link
              href="/contact#project-enquiry"
              className="mt-8 inline-flex min-h-14 items-center justify-center rounded-xl bg-blue-600 px-7 font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              Book a free site assessment
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl">
              <Image
                src="/assets/tech_hero.webp"
                alt="Approved Dustlight monitoring technology used for particulate monitoring"
                width={1600}
                height={1100}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              How the platform works
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              A coordinated path from monitoring point to project action.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stages.map(({ icon: Icon, title, body }, index) => (
              <Reveal key={title} delay={index * 0.04}>
                <article className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Monitoring capabilities
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              Practical visibility for active projects.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Capabilities are configured to suit the project scope, monitoring
              objectives and selected deployment locations.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((item) => (
                <div
                  key={item}
                  className="flex min-h-24 items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="size-2.5 shrink-0 rounded-full bg-blue-600" />
                  <p className="font-semibold leading-6 text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Designed for active projects
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              Monitoring support across complex occupied and operational sites.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 text-lg leading-8 text-slate-600">
              VerifAir can support projects where construction activity occurs
              near people, ongoing operations or sensitive boundaries.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {projectTypes.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-slate-800 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Reliability and support
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              Planned, monitored and supported throughout the project.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supportItems.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="size-7 text-blue-600" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50/70 py-16 sm:py-20">
        <div className="container">
          <Reveal>
            <div className="rounded-2xl border border-blue-200 bg-white p-7 shadow-sm sm:p-9">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                Important limitations
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Monitoring information must be used in the right project context.
              </h2>
              <ul className="mt-6 grid gap-4 text-slate-700 sm:grid-cols-2">
                <li>VerifAir supports project monitoring and response workflows.</li>
                <li>It does not identify asbestos or silica composition.</li>
                <li>It does not replace occupational hygiene assessment.</li>
                <li>It does not independently guarantee legal compliance.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
