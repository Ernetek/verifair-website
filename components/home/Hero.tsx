import Image from "next/image";
import Link from "next/link";

import { PolicyReadinessBanner } from "./PolicyReadinessBanner";
import { Reveal } from "./Reveal";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-800 bg-slate-950 text-white">
      <Image
        src="/assets/tech_hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 size-full object-cover object-center"
      />

      {/* Keep the source image at full opacity. This overlay is confined to the
          left reading area so the right 35% remains unobstructed. */}
      <div
        className="absolute inset-y-0 left-0 -z-10 hidden w-[65%] bg-gradient-to-r from-slate-950 via-slate-950 to-transparent lg:block"
        aria-hidden="true"
      />

      <div className="container relative z-10 pt-4 sm:pt-6">
        <PolicyReadinessBanner />
      </div>

      <div className="container relative z-10 grid min-h-[42rem] items-end pt-56 sm:min-h-[44rem] sm:pt-64 lg:min-h-[46rem] lg:grid-cols-[65%_35%] lg:items-center lg:py-20 lg:pt-20">
        <Reveal className="max-w-3xl bg-slate-950 p-6 sm:p-8 lg:bg-transparent lg:p-0 lg:pr-16 xl:pr-24">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">
            Real-time particulate monitoring
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
            See changing particulate conditions. Act sooner.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Real-time particulate visibility, coordinated alerts and reviewable
            reporting for construction, healthcare and other dust-sensitive
            environments.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-14 items-center justify-center rounded-xl bg-blue-500 px-7 text-base font-bold text-slate-950 shadow-lg transition hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Discuss a pilot project
            </Link>

            <Link
              href="#monitoring"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/50 bg-slate-950 px-7 text-base font-bold text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              See how VerifAir works
            </Link>
          </div>
        </Reveal>

        <div aria-hidden="true" />
      </div>
    </section>
  );
}

