import Image from "next/image";
import Link from "next/link";
import {
  ArrowPathIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  CpuChipIcon,
  CloudIcon,
  GlobeAltIcon,
  LifebuoyIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

const demonstrations = [
  {
    href: "/demonstration/monitoring-room",
    image: "/assets/dust-monitoring-display-hub.webp",
    alt: "VerifAir centralised site-wide monitoring hub showing live particulate monitoring across multiple zones",
    label: "Live visibility",
    title: "Centralised site-wide monitoring hub",
    description: "See every zone together on a high-visibility traffic-light display designed for operational oversight and rapid response.",
    action: "Open monitoring-room demo",
  },
  {
    href: "/demonstration/workflow",
    image: "/assets/workflow-site-investigation.webp",
    alt: "Simulated worker checking local controls during a guided VerifAir workflow",
    label: "Guided response",
    title: "Alert-to-evidence workflow",
    description: "Start the scenario, choose the appropriate response at each highlighted stage and see the controlled record develop.",
    action: "Start guided workflow",
  },
  {
    href: "/demonstration/evidence-reporting",
    image: "/assets/reports-evidence-review.webp",
    alt: "Simulated project team reviewing a monitoring evidence report",
    label: "Controlled records",
    title: "Evidence reporting",
    description: "Explore operational snapshots, trends, alert history, response notes and evidence-ready reporting outputs.",
    action: "Open evidence-reporting demo",
  },
] as const;

const architectureLayers = [
  {
    title: "DUSTLIGHT MONITORS",
    Icon: SignalIcon,
    iconTone: "text-slate-700",
    description: "Particulate sensing across configured sites and zones.",
  },
  {
    title: "VERIFAIR EDGE",
    connector: "↓ Bluetooth technology",
    Icon: CpuChipIcon,
    iconTone: "text-cyan-600",
    description: "Receives nearby monitor readings over Bluetooth and prepares them for onward transmission.",
  },
  {
    title: "INDEPENDENT CELLULAR COMMUNICATIONS",
    Icon: ArrowPathIcon,
    iconTone: "text-emerald-600",
    description: "Provides a separate cellular route for operational telemetry without relying on the facility LAN or Wi-Fi.",
  },
  {
    title: "VERIFAIR PLATFORM",
    Icon: CloudIcon,
    iconTone: "text-sky-600",
    description: "Centralises readings, alerts, device health, workflow records and reporting for authorised project users.",
  },
  {
    title: "CONTROL CENTRE",
    Icon: ComputerDesktopIcon,
    iconTone: "text-indigo-600",
    description: "Gives operators one view to assess conditions, coordinate response, investigate events and record outcomes.",
  },
] as const;

const processCards = [
  {
    title: "ASSESS",
    heading: "Understand conditions across sites and zones.",
    body: "Centralised real-time visibility helps teams assess particulate conditions, trends and configured operational triggers.",
    image: "/assets/dust-monitoring-display-hub.webp",
    imageAlt: "VerifAir monitoring hub showing particulate conditions across multiple zones",
    href: "/demonstration#monitoring",
    action: "Explore monitoring",
  },
  {
    title: "ACT",
    heading: "Turn changing conditions into coordinated action.",
    body: "Alert the right people, acknowledge events, assign responsibility, investigate, record actions, escalate where required and manage incidents through to resolution.",
    image: "/assets/workflow-site-investigation.webp",
    imageAlt: "Project team member investigating a particulate monitoring event",
    href: "/demonstration#incident",
    action: "See response workflow",
  },
  {
    title: "RECORD",
    heading: "Create the operational record.",
    body: "VerifAir brings together monitoring data, alerts, acknowledgements, actions, comments and incident history to generate evidence and reporting.",
    image: "/assets/reports-evidence-review.webp",
    imageAlt: "Project team reviewing a VerifAir evidence and reporting view",
    href: "/demonstration#reportpreview",
    action: "Explore records",
  },
] as const;

const capabilityItems = [
  {
    title: "MULTI-SITE & MULTI-ZONE",
    body: "Scale from multiple zones on one project to multiple sites from one central operational view.",
    Icon: GlobeAltIcon,
  },
  {
    title: "PORTABLE",
    body: "Move monitoring zones as construction progresses and project requirements change.",
    Icon: DevicePhoneMobileIcon,
  },
  {
    title: "INDEPENDENT",
    body: "Sensor telemetry does not require connection to the facility's operational LAN or Wi-Fi.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "RESILIENT",
    body: "Dual-provider connectivity, local buffering, system-health monitoring, watchdog processes and automated recovery support resilient operation.",
    Icon: ArrowPathIcon,
  },
  {
    title: "INDUSTRIAL EDGE",
    body: "Industrial-grade Edge hardware designed for deployment close to the monitored work area.",
    Icon: CpuChipIcon,
  },
  {
    title: "REMOTE SUPPORT",
    body: "Gateway health, diagnostics, software updates and security patching can be managed remotely.",
    Icon: LifebuoyIcon,
  },
  {
    title: "CALIBRATION & SERVICE",
    body: "Calibration and service requirements can be coordinated as part of the VerifAir service model.",
    Icon: WrenchScrewdriverIcon,
  },
  {
    title: "LONG-TERM RECORDS",
    body: "Generated operational records and reports remain organised for project review and reporting.",
    Icon: CloudIcon,
  },
] as const;

function ArchitectureStorySection() {
  return (
    <section className="border-b border-slate-200 bg-white py-10 sm:py-12">
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">VerifAir operational architecture</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            From distributed sensing to one operational view.
          </h2>
          <p className="mt-3 text-base font-bold leading-7 text-slate-700">
            Multi-site. Multi-zone. One operational view.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-4xl">
          <div className="relative pl-12 sm:pl-16">
            <div className="absolute bottom-5 left-[1.15rem] top-5 w-px bg-blue-200 sm:left-[1.65rem]" aria-hidden="true" />
            {architectureLayers.map((layer, index) => (
              <div key={layer.title} className="relative grid gap-3 border-b border-slate-200 py-6 last:border-b-0 sm:grid-cols-[15rem_1fr] sm:items-center sm:gap-8 sm:py-7">
                <div className="absolute -left-12 flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-white sm:-left-16 sm:h-12 sm:w-12">
                  <layer.Icon className={`h-5 w-5 ${layer.iconTone} sm:h-6 sm:w-6`} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-black tracking-[0.08em] text-slate-950 sm:text-base">{layer.title}</h3>
                <p className="text-xs leading-5 text-slate-600 sm:text-sm">
                  {layer.description}
                </p>
                {index < architectureLayers.length - 1 ? (
                  <span className="absolute -bottom-2 left-[-2.9rem] z-10 bg-white px-1 text-xs font-bold text-blue-400 sm:left-[-3.4rem]" aria-hidden="true">
                    {index === 0 ? "↓ Bluetooth technology" : "↓"}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">THE VERIFAIR PROCESS</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">ASSESS. ACT. RECORD.</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            VerifAir connects real-time monitoring with operational response and a durable record of what happened.
          </p>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {processCards.map((card) => (
              <article key={card.title} className="grid overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                <div className="relative aspect-[16/6] overflow-hidden bg-slate-200">
                  <Image src={card.image} alt={card.imageAlt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="grid gap-2 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">{card.title}</p>
                  <h3 className="text-xl font-black leading-tight text-slate-950">{card.heading}</h3>
                  <p className="text-sm leading-6 text-slate-600">{card.body}</p>
                  <Link href={card.href} className="mt-1 inline-flex min-h-10 items-center font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                    {card.action} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DemonstrationOverview() {
  return (
    <section aria-labelledby="demonstration-overview-title" className="bg-slate-100 py-10 sm:py-14">
      <div className="container">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Choose a demonstration</p>
        <h1 id="demonstration-overview-title" className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Explore the complete VerifAir response system
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Each demonstration has one clear purpose. Compare the three views below, then open the detailed experience you want to explore.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {demonstrations.map((item) => (
            <article key={item.href} className="grid overflow-hidden border border-slate-300 bg-white shadow-lg">
              <div className="relative aspect-[3/2] overflow-hidden bg-slate-200">
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="grid p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">{item.label}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <Link href={item.href} className="mt-5 inline-flex min-h-12 items-center justify-center self-end bg-blue-700 px-5 font-black text-white hover:bg-blue-800">
                  {item.action} →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-5 text-xs font-semibold text-slate-500">All scenes, readings and records are simulated demonstration material.</p>
      </div>
    </section>
  );
}

export { ArchitectureStorySection };

export function CapabilitySection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10 sm:py-12" aria-labelledby="capability-heading">
      <div className="container">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">BUILT FOR REAL PROJECTS</p>
        <h2 id="capability-heading" className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Operational capabilities for changing projects.
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-0 border-y border-slate-200 lg:grid-cols-4">
          {capabilityItems.map(({ title, body, Icon }, index) => (
            <article
              key={title}
              className={`border-b border-slate-200 py-5 ${index % 2 === 1 ? "border-l pl-5" : ""} ${index >= 6 ? "border-b-0" : ""} ${index >= 4 ? "lg:border-b-0" : ""} lg:pl-0 ${index % 4 !== 0 ? "lg:border-l lg:pl-5" : ""}`}
            >
              <Icon className="h-6 w-6 text-blue-700" aria-hidden="true" />
              <h3 className="mt-3 text-xs font-black leading-5 tracking-[0.08em] text-slate-950 sm:text-sm">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
