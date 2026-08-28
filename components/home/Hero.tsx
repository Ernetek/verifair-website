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

function HeroCopy() {
  return (
    <Reveal className="mx-auto flex max-w-4xl flex-col items-center">
      <p className="text-lg font-bold text-blue-300 sm:text-2xl">
        Protect what is important.
      </p>

      <h1 className="mt-3 text-[1.75rem] font-black leading-[1.08] tracking-tight text-white sm:mt-4 sm:text-5xl sm:leading-[1.05] lg:text-6xl">
        See changing particulate conditions. Act before they become bigger problems.
      </h1>

      <p className="mt-4 max-w-3xl text-[0.975rem] leading-6 text-slate-100 sm:mt-5 sm:text-lg sm:leading-7">
        VerifAir connects distributed Dustlight particulate monitors across project zones and sites so teams can{" "}
        <span className="font-semibold text-blue-300">assess</span> conditions,{" "}
        <span className="font-semibold text-blue-300">prevent</span> escalation through structured response, and{" "}
        <span className="font-semibold text-blue-300">report</span> a complete evidence trail.
      </p>

      <div className="mt-6 grid w-full grid-cols-1 gap-3 text-left sm:mt-10 sm:grid-cols-3 sm:gap-5">
        {heroPillars.map(({ title, description, Icon }) => (
          <div
            key={title}
            className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:block sm:text-center"
          >
            <Icon className="size-7 shrink-0 text-blue-300 sm:mx-auto sm:size-8" aria-hidden="true" />
            <div className="sm:mt-3">
              <p className="text-base font-bold text-white sm:text-lg">{title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-200">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex w-full flex-col gap-2 sm:mt-8 sm:w-auto sm:flex-row sm:gap-3">
        <Link
          href="/#monitoring"
          className="cta-primary inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-7 text-base font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
        >
          SEE VERIFAIR IN ACTION
          <ArrowRightIcon className="size-5" aria-hidden="true" />
        </Link>

        <Link
          href="/how-it-works"
          className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/50 bg-slate-950/30 px-7 text-base font-bold text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
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
      {/* Mobile: give the existing VerifAir photograph its own uninterrupted frame so the scene is immediately understandable. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 sm:hidden">
        <Image
          src="/assets/landing-hero.webp"
          alt="Healthcare refurbishment construction separated from an occupied hospital corridor by temporary containment."
          fill
          priority
          sizes="100vw"
          className="object-contain object-center"
          unoptimized
        />
      </div>

      {/* Mobile: copy sits in a dedicated navy panel instead of obscuring the image. */}
      <div className="bg-slate-950 px-5 py-9 text-center sm:hidden">
        <HeroCopy />
      </div>

      {/* Tablet / desktop: retain the cinematic photographic hero treatment. */}
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

        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent_0%,rgba(2,6,23,0.82)_30%,rgba(2,6,23,0.82)_70%,transparent_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-transparent"
          aria-hidden="true"
        />

        <div className="container relative z-10 flex min-h-[38rem] flex-col items-center justify-center py-16 text-center lg:min-h-[46rem] lg:py-20">
          <HeroCopy />
        </div>
      </div>
    </section>
  );
}
