import Image from "next/image";
import Link from "next/link";

import { DEMO_DISCLOSURE } from "@/lib/product-model";
import {
  ArrowPathIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  CloudIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { VerifAirProcessContent } from "@/components/shared/VerifAirProcess";

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
    title: "EDGE COMPUTING & LOCAL INTELLIGENCE",
    connector: "↓ BLE / local communications",
    Icon: CpuChipIcon,
    iconTone: "text-cyan-600",
    description: "VerifAir Edge provides local computing and intelligence close to the monitoring environment.",
  },
  {
    title: "TELSTRA PRIMARY + OPTUS SECONDARY",
    Icon: ArrowPathIcon,
    iconTone: "text-emerald-600",
    description: "Two mobile network paths are designed to support resilient communications without relying on the customer's local network.",
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
            Visibility across every monitoring location, scaling up to a full portfolio.
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
          <VerifAirProcessContent />
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
                <Link href={item.href} className="cta-primary mt-5 inline-flex min-h-12 items-center justify-center self-end px-5 font-black">
                  {item.action} →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-5 text-xs font-semibold text-slate-500">{DEMO_DISCLOSURE}</p>
      </div>
    </section>
  );
}

export { ArchitectureStorySection };
