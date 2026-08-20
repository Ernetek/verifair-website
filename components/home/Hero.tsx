import {
  ArrowRightIcon,
  ClockIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./Reveal";

const heroBenefits = [
  {
    title: "Keep patients, staff & visitors safe",
    Icon: UsersIcon,
  },
  {
    title: "Reduce risk & operational disruption",
    Icon: ShieldCheckIcon,
  },
  {
    title: "Make informed decisions faster",
    Icon: ClockIcon,
  },
  {
    title: "Maintain a complete evidence record",
    Icon: DocumentCheckIcon,
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-800 bg-slate-950 text-white">
      <Image
        src="/assets/landing-hero.webp"
        alt="Healthcare refurbishment construction separated from an occupied hospital corridor by temporary containment."
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 size-full object-cover object-center"
        unoptimized
      />

      {/* Darken the centre containment area so the headline stays readable while the construction and hospital sides remain bright. */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent_0%,rgba(2,6,23,0.82)_30%,rgba(2,6,23,0.82)_70%,transparent_100%)]"
        aria-hidden="true"
      />
      {/* Darken the base of the image so the benefit row reads clearly over both sides of the photo. */}
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-transparent"
        aria-hidden="true"
      />

      <div className="container relative z-10 flex min-h-[34rem] flex-col items-center justify-center py-16 text-center sm:min-h-[38rem] lg:min-h-[46rem] lg:py-20">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center">
          <p className="text-xl font-bold text-blue-300 drop-shadow-[0_2px_4px_rgba(2,6,23,0.9)] sm:text-2xl">
            Protect what is important.
          </p>

          <h1 className="mt-4 text-3xl font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_3px_5px_rgba(2,6,23,0.95)] sm:text-5xl lg:text-6xl">
            See changing particulate conditions across multiple monitoring locations.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-100 drop-shadow-[0_2px_4px_rgba(2,6,23,0.95)] sm:text-lg">
            VerifAir connects distributed Dustlight particulate monitors across project zones and sites to provide a shared operational view with{" "}
            <span className="font-semibold text-blue-300">monitoring</span>,{" "}
            <span className="font-semibold text-blue-300">workflow / response</span>, and{" "}
            <span className="font-semibold text-blue-300">reporting</span> in one connected platform.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/#monitoring"
              className="cta-primary inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-7 text-base font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              SEE VERIFAIR IN ACTION
              <ArrowRightIcon className="size-5" aria-hidden="true" />
            </Link>

            <Link
              href="/how-it-works"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/50 bg-slate-950/40 px-7 text-base font-bold text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              HOW IT WORKS
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
            {heroBenefits.map(({ title, Icon }) => (
              <div key={title} className="flex items-center gap-3 text-left">
                <Icon className="size-7 shrink-0 text-blue-300" aria-hidden="true" />
                <p className="text-sm leading-5 text-slate-100 drop-shadow-[0_2px_4px_rgba(2,6,23,0.9)]">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
