import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./Reveal";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[42rem] overflow-hidden bg-slate-950 text-white sm:min-h-[46rem] lg:min-h-[50rem]">
      <Image
        src="/assets/monitoring_room.webp"
        alt="Contractor team reviewing environmental monitoring data in a site monitoring room"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center] sm:object-[58%_center] lg:object-center"
      />

      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/72 to-slate-950/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/15"
        aria-hidden="true"
      />

      <div className="container relative flex min-h-[42rem] items-center py-20 sm:min-h-[46rem] sm:py-24 lg:min-h-[50rem]">
        <Reveal className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">
            Real-time particulate monitoring
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl">
            Dust conditions can change before teams can see the risk.{" "}
            <span className="text-blue-400">
              Monitor them in real time.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Give project teams real-time visibility of changing particulate
            conditions, coordinated alerts and evidence-ready reporting across
            dust-sensitive environments.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-14 items-center justify-center rounded-xl !bg-blue-600 px-7 text-base font-bold !text-white shadow-lg transition hover:!bg-blue-700 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Book a free site assessment
            </Link>

            <Link
              href="#platform"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Explore the platform
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
