import {
  BellAlertIcon,
  BoltIcon,
  BuildingOffice2Icon,
  CloudArrowUpIcon,
  ComputerDesktopIcon,
  ServerStackIcon,
  SignalIcon,
  WifiIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";


const capabilities = [
  "PM1 and PM2.5 monitoring",
  "Multiple monitoring zones",
  "Current conditions and historical trends",
  "Device and connectivity status",
  "Configurable alerts",
  "Local resilience during temporary connectivity issues",
];

const includedHardware = [
  {
    icon: SignalIcon,
    title: "Dustlight personal particulate monitors",
    body: "Compact monitoring units installed at selected zones to capture PM1 and PM2.5 readings and provide a visible local air-quality status indication.",
  },
  {
    icon: WifiIcon,
    title: "Wireless coverage and site connectivity",
    body: "Configured range-extension, gateway and site-connectivity components selected to support reliable communication between monitoring locations and the VerifAir platform.",
  },
  {
    icon: ServerStackIcon,
    title: "Local processing and data buffering",
    body: "A local monitoring hub receives site data, supports edge processing and temporarily buffers records when external connectivity is interrupted.",
  },
  {
    icon: BoltIcon,
    title: "Power and network infrastructure",
    body: "Power supplies, network switching, cabling and connection hardware are specified to suit the approved monitoring layout and available site services.",
  },
  {
    icon: ComputerDesktopIcon,
    title: "Optional local dashboard display",
    body: "A dedicated on-site display can present current monitoring conditions, configured alerts and trend information for authorised project teams.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Protective casing and mounting hardware",
    body: "Protective enclosures, equipment cases, brackets, poles and mounting accessories are selected where required to shield components and support secure installation in active project environments.",
  },
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
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
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

      
      <section className="border-b border-slate-200 bg-blue-50 py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
              Built by Erne Tech
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
              Extending an excellent personal monitor into an always-on site system.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-slate-700 sm:text-lg">
            <p>
              Dustlight is a strong personal wearable device. Its real-time readings,
              traffic-light display and audible alerts give individual workers clear
              feedback at the point of work.
            </p>
            <p>
              Erne Tech created VerifAir to address the operational limitations of
              phone-dependent Bluetooth workflows. Workers can forget a device, leave
              it switched off, fail to pair it or prevent cloud synchronisation.
              VerifAir adds always-on gateways, automated redundancy, local buffering
              and failover so site monitoring remains real time and available.
            </p>
            <p>
              Each dashboard can be configured for customer branding, project zones,
              alert workflows and reporting requirements, with authorised access from
              anywhere in the world.
            </p>
          </div>
        </div>
      </section>

<section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Monitoring capabilities
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              Practical visibility for active projects.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
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
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Included hardware
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              A practical site package configured around the monitoring scope.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              The final equipment list depends on the project, monitoring
              locations and site conditions. A typical VerifAir deployment may
              include the following approved components.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {includedHardware.map(({ icon: Icon, title, body }) => (
              <Reveal key={title}>
                <article className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            Equipment selection, quantities and optional components are
            confirmed during site assessment and project scoping.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Reliability and support
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
              Planned, monitored and supported throughout the project.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supportItems.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="size-7 text-blue-600" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
