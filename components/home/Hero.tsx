import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./Reveal";

function HeroCopy({ mobile = false }: { mobile?: boolean }) {
  return (
    <Reveal className={mobile ? "max-w-[650px]" : "max-w-4xl"}>
      <p
        className={
          mobile
            ? "text-sm font-bold uppercase tracking-[0.16em] text-blue-600"
            : "text-sm font-bold uppercase tracking-[0.16em] text-blue-300"
        }
      >
        Real-time fine-particle monitoring
      </p>

      <h1
        className={
          mobile
            ? "mt-4 text-[2.25rem] font-bold leading-[1.08] tracking-tight text-slate-950 min-[430px]:text-[2.5rem]"
            : "mt-5 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl"
        }
      >
        See changing particulate conditions before they become prolonged.{" "}
        <span className={mobile ? "text-blue-600" : "text-blue-400"}>
          Respond in real time.
        </span>
      </h1>

      <p
        className={
          mobile
            ? "mt-5 text-[1.0625rem] leading-7 text-slate-600 min-[430px]:text-lg"
            : "mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg"
        }
      >
        VerifAir gives project teams a shared view of PM1 and PM2.5 conditions,
        coordinated alerts and evidence-ready records so they can act earlier
        and help minimise the risk of potential exposure.
      </p>

      <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
        <Link
          href="/contact#project-enquiry"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl !bg-blue-600 px-6 text-base font-bold !text-white shadow-lg transition hover:!bg-blue-700 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 min-[430px]:w-auto md:min-h-14 md:px-7"
        >
          Book a free site assessment
        </Link>

        <Link
          href="#platform"
          className={
            mobile
              ? "inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-base font-bold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 min-[430px]:w-auto"
              : "inline-flex min-h-14 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
          }
        >
          Explore the platform
        </Link>
      </div>
    </Reveal>
  );
}

export function HeroSection() {
  return (
    <>
      <section className="bg-white md:hidden">
        <div className="relative h-[52vh] min-h-[360px] max-h-[560px] w-full overflow-hidden bg-slate-900">
          <Image
            src="/assets/monitoring_room_mobile.webp"
            alt="Project team reviewing live particulate monitoring information in a site monitoring room"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="px-6 py-10 min-[430px]:py-12">
          <HeroCopy mobile />
        </div>
      </section>

      <section className="relative isolate hidden min-h-[42rem] overflow-hidden bg-slate-950 text-white md:block sm:min-h-[46rem] lg:min-h-[50rem]">
        <Image
          src="/assets/monitoring_room.webp"
          alt="Project team reviewing live particulate monitoring information in a site monitoring room"
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
          <HeroCopy />
        </div>
      </section>
    </>
  );
}
