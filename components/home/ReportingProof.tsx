import {
  ArrowRightIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { PARTICULATE_UNIT } from "@/lib/metrics";

const reportSummary = [
  ["Monitoring period", "Neutral sample period"],
  ["Configured locations", "4 monitoring zones"],
  ["Recorded events", "1 review event"],
  ["Review status", "Completed"],
];

const eventRecord = [
  {
    time: "10:42",
    title: "Review condition detected",
    body: "PM2.5 at Work Zone A crossed the configured demonstration review line for three consecutive samples.",
  },
  {
    time: "10:44",
    title: "Site contact acknowledged",
    body: "The nominated contact confirmed receipt and checked nearby work activity.",
  },
  {
    time: "10:51",
    title: "Example action recorded",
    body: "Stopped dry sweeping, checked temporary barriers and changed the work area to vacuum-assisted cleanup.",
  },
  {
    time: "11:20",
    title: "Event reviewed and closed",
    body: "PM2.5 returned below the configured review line and the example response was marked complete.",
  },
];

const exportContents = [
  "Reporting period and configured locations",
  "PM1 and PM2.5 trend views",
  "System and connection status",
  "Recorded event chronology",
  "Acknowledgement and response actions",
  "Review status and generation date",
];

export function ReportingProof() {
  return (
    <section
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="report-proof-title"
    >
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Demonstration reporting
            </p>
            <h2
              id="report-proof-title"
              className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl"
            >
              A structured record of conditions, events and response.
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              VerifAir reporting brings monitored conditions, configured
              locations, event timing, acknowledgements and response actions
              into one reviewable project-period document.
            </p>

            <Link
              href="/reporting"
              className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600 hover:underline"
            >
              View the demonstration report
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <article className="mt-12 overflow-hidden border border-slate-300 bg-slate-50 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.45)]">
          <header className="grid gap-6 border-b border-slate-300 bg-slate-950 px-5 py-6 text-white sm:px-8 lg:grid-cols-[1fr_auto] lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                Demonstration data
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Project-period monitoring report
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Demonstration Project · neutral sample period
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-slate-400">Document</dt>
                <dd className="mt-1 font-semibold text-white">DEMO-RPT-001</dd>
              </div>
              <div>
                <dt className="text-slate-400">Status</dt>
                <dd className="mt-1 font-semibold text-emerald-300">
                  Review completed
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Project</dt>
                <dd className="mt-1 font-semibold text-white">
                  Demonstration Project
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Generated</dt>
                <dd className="mt-1 font-semibold text-white">
                  Demonstration date
                </dd>
              </div>
            </dl>
          </header>

          <div className="grid border-b border-slate-300 bg-white sm:grid-cols-2 lg:grid-cols-4">
            {reportSummary.map(([label, value]) => (
              <div
                key={label}
                className="border-b border-slate-200 px-5 py-5 last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <p className="mt-2 font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            <section
              className="border-b border-slate-300 bg-white px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10"
              aria-labelledby="report-trend-title"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    Work Zone A
                  </p>
                  <h4
                    id="report-trend-title"
                    className="mt-2 text-xl font-bold text-slate-950"
                  >
                    PM2.5 trend and recorded event
                  </h4>
                  <p className="mt-2 text-sm text-slate-500">
                    Concentrations shown in {PARTICULATE_UNIT}.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 border-l-2 border-blue-600 pl-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Latest
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">
                      18{" "}
                      <span className="text-sm font-medium text-slate-500">
                        {PARTICULATE_UNIT}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Peak
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">
                      31{" "}
                      <span className="text-sm font-medium text-slate-500">
                        {PARTICULATE_UNIT}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 overflow-x-auto">
                <svg
                  viewBox="0 0 760 330"
                  className="min-w-[42rem] w-full"
                  role="img"
                  aria-labelledby="report-chart-title report-chart-description"
                >
                  <title id="report-chart-title">
                    Demonstration PM2.5 trend for Work Zone A
                  </title>
                  <desc id="report-chart-description">
                    PM2.5 rises above the configured review line before
                    declining after the recorded example response.
                  </desc>

                  <defs>
                    <linearGradient id="reportArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {[40, 100, 160, 220, 280].map((y) => (
                    <line
                      key={y}
                      x1="70"
                      y1={y}
                      x2="730"
                      y2={y}
                      stroke="#e2e8f0"
                    />
                  ))}

                  <g fill="#64748b" fontSize="13">
                    <text x="28" y="45">40</text>
                    <text x="28" y="105">30</text>
                    <text x="28" y="165">20</text>
                    <text x="28" y="225">10</text>
                    <text x="38" y="285">0</text>
                    <text x="70" y="315">09:30</text>
                    <text x="220" y="315">10:00</text>
                    <text x="370" y="315">10:30</text>
                    <text x="520" y="315">11:00</text>
                    <text x="680" y="315">11:30</text>
                  </g>

                  <line
                    x1="70"
                    y1="130"
                    x2="730"
                    y2="130"
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                  <text
                    x="535"
                    y="119"
                    fill="#92400e"
                    fontSize="13"
                    fontWeight="700"
                  >
                    Configured review line
                  </text>

                  <path
                    d="M70 280 L70 245 C120 238 155 225 195 218 C240 210 270 190 310 198 C345 205 370 135 415 112 C455 92 485 145 520 158 C560 174 595 188 630 176 C670 164 695 172 730 168 L730 280 Z"
                    fill="url(#reportArea)"
                  />
                  <path
                    d="M70 245 C120 238 155 225 195 218 C240 210 270 190 310 198 C345 205 370 135 415 112 C455 92 485 145 520 158 C560 174 595 188 630 176 C670 164 695 172 730 168"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  <line
                    x1="415"
                    y1="112"
                    x2="415"
                    y2="280"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="5 6"
                  />
                  <circle
                    cx="415"
                    cy="112"
                    r="8"
                    fill="#ffffff"
                    stroke="#dc2626"
                    strokeWidth="4"
                  />

                  <g transform="translate(435 54)">
                    <rect
                      width="212"
                      height="58"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                    />
                    <text
                      x="14"
                      y="23"
                      fill="#0f172a"
                      fontSize="13"
                      fontWeight="700"
                    >
                      Review event recorded
                    </text>
                    <text x="14" y="43" fill="#64748b" fontSize="12">
                      10:42 · Work Zone A
                    </text>
                  </g>
                </svg>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 border-t border-slate-200 pt-5 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-7 bg-blue-600" aria-hidden="true" />
                  PM2.5 trend
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-0 w-7 border-t-2 border-dashed border-amber-600"
                    aria-hidden="true"
                  />
                  Configured review line
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-600" aria-hidden="true" />
                  Recorded event
                </span>
              </div>
            </section>

            <section
              className="bg-slate-50 px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
              aria-labelledby="report-event-title"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Event chronology
              </p>
              <h4
                id="report-event-title"
                className="mt-2 text-xl font-bold text-slate-950"
              >
                From detection to closure
              </h4>

              <ol className="relative mt-7 border-l border-slate-300">
                {eventRecord.map((event, index) => (
                  <li
                    key={`${event.time}-${event.title}`}
                    className="relative pb-7 pl-6 last:pb-0"
                  >
                    <span
                      className={`absolute -left-[5px] top-1 size-2.5 rounded-full ${
                        index === eventRecord.length - 1
                          ? "bg-emerald-600"
                          : "bg-blue-600"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="flex items-baseline justify-between gap-4">
                      <h5 className="font-bold text-slate-950">{event.title}</h5>
                      <time className="font-mono text-xs font-bold text-slate-500">
                        {event.time}
                      </time>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {event.body}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <footer className="grid border-t border-slate-300 bg-white lg:grid-cols-[1.25fr_0.75fr]">
            <section className="px-5 py-8 sm:px-8 lg:border-r lg:border-slate-300 lg:px-10">
              <div className="flex items-start gap-4">
                <DocumentArrowDownIcon
                  className="mt-0.5 size-6 shrink-0 text-blue-600"
                  aria-hidden="true"
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-950">
                    Included in the export
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The demonstration export shows how monitoring and response
                    information can be assembled into one project-period record.
                  </p>
                </div>
              </div>

              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {exportContents.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                  >
                    <CheckCircleIcon
                      className="mt-0.5 size-4 shrink-0 text-blue-600"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="border-t border-slate-300 px-5 py-8 sm:px-8 lg:flex lg:flex-col lg:justify-between lg:border-t-0 lg:px-10">
              <p className="text-sm leading-6 text-slate-600">
                Values, times, locations and actions shown here are fictional demonstration data and do not represent a customer deployment, exposure determination or material identification.
              </p>

              <Link
                href="/reporting"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 bg-blue-600 px-5 font-bold text-white hover:bg-blue-700"
              >
                View demonstration report
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </section>
  );
}
