import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./Reveal";

export function ProofSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-400">
              From Dustlight to VerifAir
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.45rem]">
              Erne Tech extended point monitoring into a connected operational system.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-500" />
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Dustlight provides trusted local particulate readings. Erne Tech
              created VerifAir to overcome the practical limits of short-range
              Bluetooth-only access across larger and more complex sites,
              bringing multiple monitoring points into one resilient system.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              The result is shared visibility for authorised teams, with live
              dashboard access available from anywhere in the world where an
              internet connection is available.
            </p>
            <Link
              href="/technology"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 font-bold text-slate-950 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              Explore the technology
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                <Image
                  src="/assets/platform-dashboard.webp"
                  alt="VerifAir demonstration dashboard presenting monitoring zones and trends"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-slate-400">
                Demonstration interface shown for product explanation.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
