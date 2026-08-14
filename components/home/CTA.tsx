import Link from "next/link";

import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="container">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
                DISCUSS YOUR PROJECT
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.45rem]">
                What would VerifAir look like on your project?
              </h2>
              <div className="mt-5 h-0.5 w-12 bg-blue-500" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                className="inline-flex min-h-14 items-center justify-center rounded-xl !bg-blue-500 px-7 font-bold !text-slate-950 shadow-sm transition hover:!bg-blue-400 hover:!text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
                href="/contact"
              >
                Discuss Your Project
              </Link>
              <Link
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/35 !bg-transparent px-7 font-bold !text-white transition hover:!bg-white/10 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
                href="/demonstration"
              >
                See VerifAir in Action
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
