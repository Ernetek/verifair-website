import Image from "next/image";
import Link from "next/link";

import { PageDisclaimer } from "@/components/legal/PageDisclaimer";
import { PARTICULATE_UNIT, SUPPORTED_PARTICULATE_METRICS } from "@/lib/metrics";

const architecture = [
  [
    "Dustlight monitoring",
    "Dustlight is designed as a personal real-time dust monitor. Under a validated VerifAir project design, approved devices may also be used at selected monitoring locations where the application, mounting, maintenance and interpretation have been assessed for that purpose.",
  ],
  [
    "Site connectivity",
    "Configured site components transfer available readings into the project environment. The connection method is selected for the site and agreed scope.",
  ],
  [
    "Continuity handling",
    "The project design considers power, connection interruptions, system state and data recovery requirements. Final behaviour must be verified for the deployed configuration.",
  ],
  [
    "VerifAir platform",
    "Authorised users can review current readings, trends, selected locations and system state through the configured project dashboard.",
  ],
  [
    "Events and reporting",
    "Project-specific settings support notifications, response records, event review and reporting workflows.",
  ],
] as const;

export function TechnologyPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-12 lg:gap-y-8 lg:items-center">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Technology</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Connected monitoring for dust-sensitive environments.
            </h1>
          </div>
          <figure className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <Image
              src="/assets/tech_hero.webp"
              alt="Construction activity beside an occupied dust-sensitive environment"
              width={1672}
              height={941}
              quality={92}
              className="h-auto w-full object-cover"
              priority
            />
            <figcaption className="mt-3 text-sm leading-6 text-slate-500">
              Environmental context image. Measurement limitations and complementary assessment methods are summarised at the bottom of this page.
            </figcaption>
          </figure>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:col-start-1 lg:row-start-2">
            VerifAir connects approved particulate monitoring equipment, site
            connectivity, shared project visibility, configured events and
            reporting. Final performance depends on the validated project design,
            power, networks, maintenance and external services.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">System architecture</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            A continuous path from measurement to operational review.
          </h2>

          <div className="mt-12 grid gap-12 lg:grid-cols-[0.58fr_0.42fr]">
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

            <div>
              <figure className="border border-slate-300 bg-white p-6">
                <Image
                  src="/assets/dustlight.webp"
                  alt="Dustlight personal real-time particulate monitor"
                  width={1199}
                  height={674}
                  className="h-auto w-full object-contain"
                />
                <figcaption className="mt-4 text-sm leading-6 text-slate-500">
                  Dustlight product image. Deployment method and approved use are determined for the project scope.
                </figcaption>
              </figure>

              <figure className="mt-6 border border-slate-300 bg-slate-950 p-6 text-white">
                <ol className="border-y border-white/15">
                  {architecture.map(([title], index) => (
                    <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-white/15 py-4 last:border-b-0">
                      <span className="font-mono text-xs font-bold text-blue-300">0{index + 1}</span>
                      <span className="font-bold">{title}</span>
                    </li>
                  ))}
                </ol>
                <figcaption className="mt-4 text-xs leading-5 text-slate-400">
                  Conceptual system sequence. Final components and topology depend on the approved project design.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">Technical summary</h2>

          <dl className="mt-8 border-y border-slate-300 md:hidden">
            {[
              ["Supported particulate metrics", SUPPORTED_PARTICULATE_METRICS.join(", ")],
              ["Displayed concentration unit", PARTICULATE_UNIT],
              ["Dustlight deployment", "Personal monitoring and validated project-specific applications"],
              ["Connectivity", "Configured for the site and agreed project scope"],
              ["Availability", "Subject to power, network, service and maintenance conditions"],
            ].map(([term, description]) => (
              <div key={term} className="border-b border-slate-300 py-5 last:border-b-0">
                <dt className="font-bold text-slate-950">{term}</dt>
                <dd className="mt-2 leading-7 text-slate-600">{description}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">VerifAir technical summary</caption>
              <tbody>
                <tr className="border-y border-slate-300"><th scope="row" className="py-4 pr-8">Supported particulate metrics</th><td className="py-4">{SUPPORTED_PARTICULATE_METRICS.join(", ")}</td></tr>
                <tr className="border-b border-slate-300"><th scope="row" className="py-4 pr-8">Displayed concentration unit</th><td className="py-4">{PARTICULATE_UNIT}</td></tr>
                <tr className="border-b border-slate-300"><th scope="row" className="py-4 pr-8">Dustlight deployment</th><td className="py-4">Personal monitoring and validated project-specific applications</td></tr>
                <tr className="border-b border-slate-300"><th scope="row" className="py-4 pr-8">Connectivity</th><td className="py-4">Configured for the site and agreed project scope</td></tr>
                <tr className="border-b border-slate-300"><th scope="row" className="py-4 pr-8">Availability</th><td className="py-4">Subject to power, network, service and maintenance conditions</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center bg-blue-600 px-6 font-bold text-white hover:bg-blue-700">
              Discuss the project technology approach
            </Link>
            <Link href="/#reportpreview" className="inline-flex min-h-12 items-center justify-center border border-slate-300 px-6 font-bold text-slate-900 hover:bg-slate-50">
              Explore reporting
            </Link>
          </div>
        </div>
      </section>
      <PageDisclaimer />
    </>
  );
}
