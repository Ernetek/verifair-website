import Link from "next/link";

export function PolicyReadinessBanner() {
  return (
    <aside className="border-b border-blue-200 bg-blue-50" aria-label="Workplace exposure limit transition">
      <div className="container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Is your site ready?
          </p>
          <p className="mt-1 max-w-3xl text-base leading-7 text-slate-700">
            Australia moves to workplace exposure limits for airborne contaminants
            on 1 December 2026. Review your monitoring, response and reporting
            arrangements before the transition.
          </p>
        </div>
        <Link
          href="/resources/december-2026-workplace-exposure-limits"
          className="inline-flex min-h-11 shrink-0 items-center font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
        >
          Read the readiness guide →
        </Link>
      </div>
    </aside>
  );
}
