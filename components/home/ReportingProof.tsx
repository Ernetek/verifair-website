import { PARTICULATE_UNIT } from "@/lib/metrics";

export function ReportingProof() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24" aria-labelledby="report-proof-title">
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Reporting proof</p>
        <h2 id="report-proof-title" className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
          A reviewable record from current conditions to final export.
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="border border-slate-300 bg-white p-8 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Demonstration report</p>
            <h3 className="mt-16 text-3xl font-bold text-slate-950">Project-period monitoring report</h3>
            <p className="mt-4 text-slate-600">Demonstration Project · neutral sample period</p>
            <div className="mt-20 border-t border-slate-200 pt-5 text-sm text-slate-500">
              Generated for demonstration only
            </div>
          </div>

          <div>
            <div className="border-y border-slate-300 py-7">
              <p className="text-sm font-bold text-slate-950">Trend view · demonstration data</p>
              <svg viewBox="0 0 700 220" className="mt-5 w-full" role="img" aria-label="Demonstration PM2.5 trend">
                <title>Demonstration PM2.5 trend</title>
                <path d="M0 180 C80 170 100 120 160 145 C220 170 250 55 320 80 C390 110 420 70 480 95 C550 125 600 55 700 70" fill="none" stroke="#2563eb" strokeWidth="6"/>
                <line x1="0" x2="700" y1="120" y2="120" stroke="#d97706" strokeDasharray="10 10"/>
              </svg>
              <p className="mt-2 text-sm text-slate-500">PM2.5 shown in {PARTICULATE_UNIT}.</p>
            </div>

            <div className="grid border-b border-slate-300 sm:grid-cols-2">
              <div className="py-7 sm:pr-8">
                <p className="text-sm font-bold text-slate-950">Event timeline</p>
                <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                  <li><strong>10:42</strong> · Demonstration event recorded</li>
                  <li><strong>10:44</strong> · Notification acknowledged</li>
                  <li><strong>10:51</strong> · Site response note added</li>
                  <li><strong>11:20</strong> · Review completed</li>
                </ol>
              </div>
              <div className="border-t border-slate-300 py-7 sm:border-l sm:border-t-0 sm:pl-8">
                <p className="text-sm font-bold text-slate-950">Export example</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Reporting period, monitored zones, particulate trends, system
                  status, events, notes and generation date.
                </p>
                <button type="button" className="mt-5 font-bold text-blue-600">Preview sample export →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
