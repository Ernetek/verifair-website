import Image from "next/image";
import Link from "next/link";

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
        className="absolute inset-0 -z-20 hidden size-full object-cover object-center lg:block"
      />
      <Image
        src="/assets/mobile_hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 size-full object-cover object-center lg:hidden"
      />

      {/* Keep the source image at full opacity. This overlay is confined to the
          left reading area so the right 35% remains unobstructed. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:w-[65%] lg:bg-gradient-to-r lg:from-slate-950/65 lg:via-slate-950/35 lg:to-transparent"
        aria-hidden="true"
      />

      <div className="container relative z-10 grid min-h-[42rem] items-end pt-48 sm:min-h-[44rem] sm:pt-56 lg:min-h-[46rem] lg:grid-cols-[65%_35%] lg:items-center lg:py-20 lg:pt-20">
        <Reveal className="max-w-3xl p-0 pb-10 sm:p-8 sm:pb-10 lg:bg-transparent lg:p-0 lg:pr-16 xl:pr-24">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300 drop-shadow-[0_2px_4px_rgba(2,6,23,0.9)]">
            OPERATIONAL PARTICULATE VISIBILITY &amp; RESPONSE
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-white drop-shadow-[0_3px_5px_rgba(2,6,23,0.95)] sm:text-6xl lg:text-7xl">
            Know when particulate conditions change.
          </h1>

          <h2 className="mt-3 text-2xl font-bold tracking-[0.08em] text-slate-100 drop-shadow-[0_2px_4px_rgba(2,6,23,0.95)] sm:text-3xl lg:text-4xl">
            ASSESS. ACT. RECORD.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-100 drop-shadow-[0_2px_4px_rgba(2,6,23,0.95)] sm:text-lg">
            VerifAir connects distributed Dustlight particulate monitors through resilient,
            independent Edge infrastructure—providing centralised real-time visibility across
            sites and zones, operational alerts, coordinated action and long-term evidence reporting.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/#monitoring"
              className="inline-flex min-h-14 items-center justify-center rounded-xl bg-blue-500 px-7 text-base font-bold text-slate-950 shadow-lg transition hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              See VerifAir in Action
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/50 bg-slate-950 px-7 text-base font-bold text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Discuss Your Project
            </Link>
          </div>
        </Reveal>

        <div aria-hidden="true" />
      </div>
    </section>
  );
}

