import Image from "next/image";

import { Reveal } from "./Reveal";

export function ProofSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-400">
              Product proof
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.45rem]">
              Built around live monitoring, local resilience and shared
              operational visibility.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-500" />
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              VerifAir is being developed as an edge-first monitoring platform
              that combines Dustlight particulate data, Edge computing,
              coordinated alerts, dashboards and reporting for dust-sensitive
              projects.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                <Image
                  src="/assets/monitoring_room.webp"
                  alt="Contractor team reviewing a VerifAir demonstration dashboard in a monitoring room"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-slate-400">
                Prototype and demonstration interface shown; not presented as a
                customer case study or production deployment.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
