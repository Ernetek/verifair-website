import Image from "next/image";
import Link from "next/link";

import { PolicyReadinessBanner } from "./PolicyReadinessBanner";
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

      <div className="container absolute inset-x-0 top-4 z-20 sm:top-6">
        <PolicyReadinessBanner />
      </div>

      <div className="container relative flex min-h-[42rem] items-center pt-48 pb-20 sm:min-h-[46rem] sm:pt-44 sm:pb-24 lg:min-h-[50rem]">
        <Reveal className="flex w-full max-w-2xl flex-col items-center text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">
            Real-time particulate monitoring
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
            See change. Act sooner.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            Real-time particulate visibility, coordinated alerts and reviewable
            reporting for dust-sensitive environments.
          </p>

          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-14 items-center justify-center rounded-xl !bg-blue-600 px-7 text-base font-bold !text-white shadow-lg transition hover:!bg-blue-700 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Discuss a pilot project
            </Link>

            <Link
              href="#platform"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/35 !bg-white/10 px-7 text-base font-bold !text-white backdrop-blur-sm transition hover:!bg-white/20 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Explore the platform
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
