import {
  ArrowRightIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./Reveal";

const heroPillars = [
  {
    title: "Assess",
    description: "See changing particulate conditions across monitoring locations.",
    Icon: ChartBarIcon,
  },
  {
    title: "Prevent",
    description: "Turn warnings and action levels into visible response before conditions escalate.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "Report",
    description: "Keep an audit-ready record of response, verification and closure.",
    Icon: DocumentCheckIcon,
  },
] as const;

function MobileHeroCopy() {
  return (
    <Reveal className="mx-auto flex max-w-md flex-col items-center">
      <p className="text-sm font-bold leading-5 text-blue-300">Protect what is important.</p>

      <h1 className="mt-2 text-[2.5rem] font-black leading-[0.98] tracking-tight text-white">
        See changing particulate conditions. Act before they become bigger problems.
      </h1>

      <p className="mt-3 text-[0.875rem] leading-5 text-slate-200">
        VerifAir helps teams assess conditions, prevent escalation and keep a complete reporting trail.
      </p>

      <div className="mt-4 grid w-full grid-cols-3 gap-1.5" aria-label="VerifAir operating model">
        {heroPillars.map(({ title, Icon }) => (
          <div
            key={title}
            className="flex min-w-0 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-1 py-2 text-center"
          >
            <Icon className="size-5 shrink-0 text-blue-300" aria-hidden="true" />
            <p className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-white">{title}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid w-full grid-cols-2 gap-2">
        <Link
          href="/#monitoring"
          aria-label="See VerifAir in Action"
          className="cta-primary inline-flex min-h-11 items-center justify-center rounded-lg px-2 text-[0.75rem] font-bold shadow-md focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          SEE IT IN ACTION
        </Link>

        <Link
          href="/how-it-works"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/50 bg-slate-950/30 px-2 text-[0.75rem] font-bold text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          HOW IT WORKS
        </Link>
      </div>
    </Reveal>
  );
}

function DesktopHeroCopy() {
  return (
    <Reveal className="mx-auto flex max-w-4xl flex-col items-center rounded-3xl bg-slate-950/80 px-8 py-9 shadow-2xl ring-1 ring-white/10 backdrop-blur-[2px] lg:px-12 lg:py-11">
      <p className="text-2xl font-bold text-blue-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
        Protect what is important.
      </p>

      <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] lg:text-6xl">
        See changing particulate conditions. Act before they become bigger problems.
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-7 text-slate-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
        VerifAir connects distributed Dustlight particulate monitors across project zones and sites so teams can{" "}
        <span className="font-semibold text-blue-300">assess</span> conditions,{" "}
        <span className="font-semibold text-blue-300">prevent</span> escalation through structured response, and{" "}
        <span className="font-semibold text-blue-300">report</span> a complete evidence trail.
      </p>

      <div className="mt-10 grid w-full grid-cols-3 gap-5 text-center">
        {heroPillars.map(({ title, description, Icon }) => (
          <div key={title} className="rounded-xl border border-white/15 bg-slate-950/75 p-4 shadow-lg">
            <Icon className="mx-auto size-8 text-blue-300" aria-hidden="true" />
            <div className="mt-3">
              <p className="text-lg font-bold text-white">{title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-200">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex w-auto flex-row gap-3">
        <Link
          href="/#monitoring"
          className="cta-primary inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-7 text-base font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
        >
          SEE VERIFAIR IN ACTION
          <ArrowRightIcon className="size-5" aria-hidden="true" />
        </Link>

        <Link
          href="/how-it-works"
          className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/50 bg-slate-950/80 px-7 text-base font-bold text-white shadow-lg transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
        >
          HOW IT WORKS
        </Link>
      </div>
    </Reveal>
  );
}

export function HeroSection() {
  return (
    <section className="border-b border-slate-800 bg-slate-950 text-white">
      {/* Mobile: a distinct, full-width photographic band with no text overlay. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 sm:hidden">
        <Image
          src="/assets/landing-hero.webp"
          alt="Healthcare refurbishment construction separated from an occupied hospital corridor by temporary containment."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          unoptimized
        />
      </div>

      {/* Mobile: visually separate hero copy from the photo and preserve the tested viewport-height constraint. */}
      <div className="border-t-4 border-blue-500 bg-slate-950 px-4 py-5 text-center sm:hidden">
        <MobileHeroCopy />
      </div>

      {/* Tablet / desktop: retain the photographic hero with a consistently dark copy surface for readable contrast. */}
      <div className="relative isolate hidden overflow-hidden sm:block">
        <Image
          src="/assets/landing-hero.webp"
          alt="Healthcare refurbishment construction separated from an occupied hospital corridor by temporary containment."
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 size-full object-cover object-center"
          unoptimized
        />

        <div className="absolute inset-0 -z-10 bg-slate-950/35" aria-hidden="true" />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(2,6,23,0.35)_0%,rgba(2,6,23,0.76)_20%,rgba(2,6,23,0.88)_50%,rgba(2,6,23,0.76)_80%,rgba(2,6,23,0.35)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent"
          aria-hidden="true"
        />

        <div className="container relative z-10 flex min-h-[38rem] flex-col items-center justify-center py-16 text-center lg:min-h-[46rem] lg:py-20">
          <DesktopHeroCopy />
        </div>
      </div>
    </section>
  );
}
