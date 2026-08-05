import Link from "next/link";

import { SALES_EMAIL } from "@/lib/site";

import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="container">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-400">
                Discuss a structured pilot
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.45rem]">
                Review how VerifAir could support a carefully scoped monitoring pilot for your next dust-sensitive project.
              </h2>
              <div className="mt-5 h-0.5 w-12 bg-blue-500" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                className="inline-flex min-h-14 items-center justify-center rounded-xl !bg-blue-600 px-7 font-bold !text-white shadow-sm transition hover:!bg-blue-700 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
                href="/contact"
              >
                Discuss a pilot project
              </Link>
              <Link
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/25 !bg-transparent px-7 font-bold !text-white transition hover:!bg-white/10 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
                href={`mailto:${SALES_EMAIL}`}
              >
                Request a product walkthrough
              </Link>
            </div>
          </div>
        </Reveal>

        <p className="mt-10 max-w-5xl border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">
          Particulate readings do not identify the chemical or mineral
          composition of airborne material. VerifAir supplements, but does not
          replace, competent risk assessment, occupational-hygiene advice,
          specialist sampling, controls or project-specific legal obligations.
        </p>
      </div>
    </section>
  );
}
