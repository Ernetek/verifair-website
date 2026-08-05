import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import { Reveal } from "./Reveal";

export function PolicyUpdateSection() {
  return (
    <section className="border-b border-blue-200 bg-blue-50 py-12 sm:py-14">
      <div className="container">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Prepare for 1 December 2026
              </p>
              <h2 className="mt-3 max-w-4xl text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                Australia is moving from workplace exposure standards to
                workplace exposure limits for airborne contaminants.
              </h2>
              <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700">
                Safe Work Australia advises PCBUs to review controls and
                monitoring arrangements before the new WEL framework takes
                effect. VerifAir can support continuous project visibility and
                records, but it does not replace competent exposure assessment.
              </p>
            </div>

            <a
              href="https://www.safeworkaustralia.gov.au/safety-topic/managing-health-and-safety/workplace-exposure-limits-airborne-contaminants"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              View official guidance
              <ArrowTopRightOnSquareIcon className="size-5" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
