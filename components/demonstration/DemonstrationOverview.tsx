import Image from "next/image";
import Link from "next/link";
import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  CloudIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
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

const architectureSteps = [
  { label: "Dustlight monitors", Icon: SignalIcon },
  { label: "Bluetooth technology", Icon: ArrowsRightLeftIcon },
  { label: "VerifAir Edge", Icon: CpuChipIcon },
  { label: "Independent cellular communications", Icon: ArrowPathIcon },
  { label: "VerifAir Cloud", Icon: CloudIcon },
  { label: "Control Centre / authorised users", Icon: ComputerDesktopIcon },
] as const;

const processCards = [
  {
    title: "ASSESS",
    heading: "Understand conditions across sites and monitoring zones.",
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
    heading: "From operational event to long-term record.",
    body: "VerifAir brings together monitoring data, alerts, acknowledgements, actions, comments and incident history to generate evidence and reporting.",
    image: "/assets/reports-evidence-review.webp",
    imageAlt: "Project team reviewing a VerifAir evidence and reporting view",
    href: "/demonstration#reportpreview",
    action: "Explore records",
  },
] as const;

function ArchitectureStorySection() {
  return (
    <section className="border-b border-slate-200 bg-white py-10 sm:py-12">
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Physical architecture</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Multi-site, multi-zone monitoring. One operational view.
          </h2>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-6">
          {architectureSteps.map((step, index) => (
            <div key={step.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:col-span-1 md:flex-col md:items-start md:justify-between md:p-4">
              <step.Icon className="h-7 w-7 shrink-0 text-blue-700" aria-hidden="true" />
              <div className="text-sm font-bold text-slate-900">{step.label}</div>
              {index < architectureSteps.length - 1 ? (
                <div aria-hidden="true" className="text-lg text-slate-400 md:self-center">
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">THE VERIFAIR PROCESS</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Assess. Act. Record.</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            VerifAir connects real-time monitoring with operational response and a durable record of what happened.
          </p>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {processCards.map((card) => (
              <article key={card.title} className="grid overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                <div className="relative aspect-[16/8] overflow-hidden bg-slate-200">
                  <Image src={card.image} alt={card.imageAlt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="grid gap-3 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">{card.title}</p>
                  <h3 className="text-xl font-black leading-tight text-slate-950">{card.heading}</h3>
                  <p className="text-sm leading-6 text-slate-600">{card.body}</p>
                  <Link href={card.href} className="mt-2 inline-flex min-h-11 items-center font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
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
