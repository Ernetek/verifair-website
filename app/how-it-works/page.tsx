import type { Metadata } from "next";
import Link from "next/link";

import { ArchitectureStorySection } from "@/components/demonstration/DemonstrationOverview";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how VerifAir connects particulate monitors, edge communications, operational alerts, human response and reporting.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: `How It Works | ${siteConfig.name}`,
    description:
      "From distributed particulate sensing to coordinated response and an operational record.",
    url: "/how-it-works",
  },
};

const systemSteps = [
  {
    number: "01",
    title: "Configure the monitoring plan",
    body: "Project requirements define the selected sites, zones, monitor locations, communications approach, operational triggers and responsible users.",
  },
  {
    number: "02",
    title: "Collect and transfer readings",
    body: "Dustlight monitors measure particulate conditions. VerifAir Edge provides local computing and intelligence close to the monitoring environment and transfers configured observations through the deployed communications path.",
  },
  {
    number: "03",
    title: "Present current conditions",
    body: "The platform brings monitor identity, readings, Dustlight device status, connectivity, VerifAir system health and project-configured operational state into one operational monitoring view.",
  },
  {
    number: "04",
    title: "Coordinate human response",
    body: "When a configured condition requires attention, authorised users acknowledge it, take ownership, investigate, record actions and escalate where required.",
  },
  {
    number: "05",
    title: "Retain evidence and report",
    body: "Observations, alerts, acknowledgements, actions, notes, evidence and closure details remain connected for review and reporting.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <main>
        <section className="border-b border-slate-200 bg-slate-950 py-16 text-white sm:py-20">
          <div className="container">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-400">
              How VerifAir works
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              From distributed sensing to coordinated response and a clear record.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              VerifAir connects selected particulate monitoring points, Edge computing & local intelligence,
              resilient Telstra primary and Optus secondary connectivity, operational visibility,
              human response workflow and evidence reporting without turning demonstration settings into regulatory conclusions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/demonstration"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-6 font-black text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                See the system in action
              </Link>
              <Link
                href="/product"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-500 px-6 font-black text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Explore the product
              </Link>
            </div>
          </div>
        </section>

        <ArchitectureStorySection />

        <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-18">
          <div className="container">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              System process
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              From monitoring plan to retained evidence.
            </h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-5">
              {systemSteps.map((step) => (
                <article key={step.number} className="border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black tracking-[0.16em] text-blue-700">{step.number}</p>
                  <h3 className="mt-3 text-lg font-black text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-14 sm:py-18">
          <div className="container grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                System responsibility
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                What VerifAir automates.
              </h2>
              <ul className="mt-6 grid gap-3 text-sm leading-6 text-slate-700">
                <li className="border-l-4 border-blue-500 pl-4">Transfers and presents configured monitoring data.</li>
                <li className="border-l-4 border-blue-500 pl-4">Evaluates approved project operational triggers.</li>
                <li className="border-l-4 border-blue-500 pl-4">Surfaces alerts and maintains system event chronology.</li>
                <li className="border-l-4 border-blue-500 pl-4">Connects monitoring observations with response records.</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Human responsibility
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                What accountable people decide.
              </h2>
              <ul className="mt-6 grid gap-3 text-sm leading-6 text-slate-700">
                <li className="border-l-4 border-emerald-500 pl-4">Approve locations, triggers, responsibilities and escalation paths.</li>
                <li className="border-l-4 border-emerald-500 pl-4">Assess site context and determine the appropriate response.</li>
                <li className="border-l-4 border-emerald-500 pl-4">Record actions, evidence, verification and closure decisions.</li>
                <li className="border-l-4 border-emerald-500 pl-4">Apply professional, regulatory and workplace requirements.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <PageDisclaimer />
    </>
  );
}
