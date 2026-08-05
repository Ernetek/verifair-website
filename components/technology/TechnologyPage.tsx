import Image from "next/image";

import { PageDisclaimer } from "@/components/legal/PageDisclaimer";
import { PARTICULATE_UNIT, SUPPORTED_PARTICULATE_METRICS } from "@/lib/metrics";

const architecture = [
  ["Dustlight monitoring", "Dustlight can be worn as a personal monitor or positioned at an agreed monitoring point. It measures PM1, PM2.5, PM10 and respirable dust, with local visual and audible alerting."],
  ["Site connectivity", "Configured gateways and network components transfer available readings beyond a phone-only Bluetooth workflow."],
  ["Local processing and buffering", "Site equipment can retain data during temporary connection interruptions and forward it when connectivity resumes."],
  ["VerifAir platform", "Authorised users can review current readings, trends, monitoring zones and system state through the configured project dashboard."],
  ["Alerts and reporting", "Project-specific settings support notifications, event review and reporting workflows."],
];

export function TechnologyPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Technology</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              One connected architecture from Dustlight sensing to project reporting.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              VerifAir extends the value of Dustlight with site connectivity,
              project visibility and coordinated operational workflows. System
              availability depends on the approved site design, power, networks,
              maintenance and external services.
            </p>
          </div>
          <Image src="/assets/dustlight.webp" alt="Dustlight particulate monitor" width={950} height={760} className="h-auto w-full object-contain" priority />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">System architecture</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            A continuous path through the monitoring system.
          </h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.58fr_0.42fr]">
            <ol className="border-y border-slate-300">
              {architecture.map(([title, body], index) => (
                <li key={title} className="grid gap-4 border-b border-slate-300 py-7 last:border-b-0 sm:grid-cols-[3rem_1fr]">
                  <span className="font-mono text-sm font-bold text-blue-600">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">{title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <figure>
              <div className="border border-slate-300 bg-white p-6">
                <div className="space-y-3">
                  {architecture.map(([title], index) => (
                    <div key={title} className="flex items-center gap-4">
                      <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</span>
                      <div className="h-px flex-1 bg-slate-300" />
                      <span className="w-44 text-sm font-bold text-slate-800">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-slate-500">
                Annotated system diagram. Final components and topology depend on the agreed project scope.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">Restrained technical summary</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <tbody>
                <tr className="border-y border-slate-300"><th className="py-4 pr-8">Supported particulate metrics</th><td className="py-4">{SUPPORTED_PARTICULATE_METRICS.join(", ")}</td></tr>
                <tr className="border-b border-slate-300"><th className="py-4 pr-8">Displayed concentration unit</th><td className="py-4">{PARTICULATE_UNIT}</td></tr>
                <tr className="border-b border-slate-300"><th className="py-4 pr-8">Dustlight deployment</th><td className="py-4">Wearable personal use or an agreed positioned monitoring point, depending on scope</td></tr>
                <tr className="border-b border-slate-300"><th className="py-4 pr-8">Connectivity</th><td className="py-4">Bluetooth at the device, extended through configured site connectivity</td></tr>
                <tr className="border-b border-slate-300"><th className="py-4 pr-8">Availability</th><td className="py-4">Subject to site power, network, service and maintenance conditions</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <PageDisclaimer />
    </>
  );
}
