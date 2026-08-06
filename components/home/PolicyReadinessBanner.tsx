import Link from "next/link";

export function PolicyReadinessBanner() {
  return (
    <aside
      className="border border-blue-200 bg-white/95 shadow-2xl backdrop-blur"
      aria-label="Workplace exposure limit transition"
    >
      <div className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            Are you ready for December 2026?
          </p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-700">
            Review your monitoring, response and reporting arrangements before
            Australia moves to workplace exposure limits for airborne contaminants.
          </p>
        </div>

        <Link
          href="/resources/december-2026-workplace-exposure-limits"
          className="inline-flex min-h-10 items-center justify-center bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
        >
          Read the guide →
        </Link>
      </div>
    </aside>
  );
}
