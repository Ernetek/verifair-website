"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { PARTICULATE_UNIT } from "@/lib/metrics";
import { DEMO_DISCLOSURE } from "@/lib/product-model";

const reportTypes = [
  {
    title: "Operational snapshot",
    description:
      "A current view of selected locations, readings, system state and open events.",
  },
  {
    title: "Trend and event review",
    description:
      "A focused review of particulate trends, configured events, acknowledgements and response notes.",
  },
  {
    title: "Project-period report",
    description:
      "A structured record covering the reporting period, monitoring locations, data availability, events and review notes.",
  },
] as const;

const snapshotZones = [
  ["Work Zone A", "PM2.5", "18", "ATTENTION"],
  ["Occupied Interface", "Respirable Dust", "6", "NORMAL"],
  ["External Boundary", "PM10", "21", "NORMAL"],
] as const;

function OperationalSnapshot() {
  return (
    <div>
      <div className="grid border-y border-slate-300 sm:grid-cols-3">
        {snapshotZones.map(([zone, metric, value, status]) => (
          <div
            key={zone}
            className="border-b border-slate-300 p-5 sm:border-b-0 sm:border-r last:border-r-0"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {zone}
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {value}{" "}
              <span className="text-sm font-semibold text-slate-500">
                {PARTICULATE_UNIT}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-500">{metric}</p>
            <span
              className={`mt-4 inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                status === "ATTENTION"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-emerald-100 text-emerald-900"
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>

      <dl className="mt-6 grid gap-5 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            System health
          </dt>
          <dd className="mt-2 font-bold">3 locations online</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Open events
          </dt>
          <dd className="mt-2 font-bold">1 under review</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Latest update
          </dt>
          <dd className="mt-2 font-bold">10:58</dd>
        </div>
      </dl>
    </div>
  );
}

function TrendEventReview() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-5 border-y border-slate-300 py-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Selected location
          </p>
          <p className="mt-2 text-xl font-bold">Work Zone A</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Review period
          </p>
          <p className="mt-2 font-semibold">Neutral demonstration period</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox="0 0 620 250"
          className="min-w-[36rem] w-full"
          role="img"
          aria-labelledby="homepage-reporting-trend-title homepage-reporting-trend-desc"
        >
          <title id="homepage-reporting-trend-title">
            Demonstration PM2.5 trend and event
          </title>
          <desc id="homepage-reporting-trend-desc">
            A demonstration trend crosses a project-specific review line before
            returning below it.
          </desc>
          {[35, 85, 135, 185, 225].map((y) => (
            <line key={y} x1="38" y1={y} x2="600" y2={y} stroke="#e2e8f0" />
          ))}
          <line
            x1="38"
            y1="120"
            x2="600"
            y2="120"
            stroke="#d97706"
            strokeWidth="2"
            strokeDasharray="8 8"
          />
          <text x="390" y="108" fill="#92400e" fontSize="13" fontWeight="700">
            Example project review line
          </text>
          <path
            d="M38 205 C100 198 135 180 185 185 C235 190 260 148 310 154 C355 159 380 104 430 92 C480 80 520 132 600 116"
            fill="none"
            stroke="#2563eb"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="430" cy="92" r="7" fill="#fff" stroke="#dc2626" strokeWidth="4" />
        </svg>
      </div>

      <ol className="mt-7 border-y border-slate-300">
        {[
          "10:42 · Event recorded",
          "10:44 · Nominated contact acknowledged",
          "10:51 · Example response note added",
          "11:20 · Review completed",
        ].map((item) => (
          <li key={item} className="border-b border-slate-300 py-4 last:border-b-0">
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProjectPeriodReport() {
  const fields = [
    ["Project", "Demonstration Project"],
    ["Reporting period", "Neutral demonstration period"],
    ["Monitoring locations", "3 configured locations"],
    ["Metrics", "Respirable Dust, PM1, PM2.5 and PM10"],
    ["Data availability", "Illustrative system status summary"],
    ["Recorded events", "1 reviewed demonstration event"],
    ["Review notes", "3 time-stamped response entries"],
    ["Generated", "Demonstration date"],
  ];

  return (
    <div>
      <div className="border-y border-slate-300">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-2 border-b border-slate-300 py-4 last:border-b-0 sm:grid-cols-[12rem_1fr]"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-l-4 border-blue-600 bg-blue-50 p-4">
        <p className="font-bold text-slate-950">Report record ready for review</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The demonstration export brings together project context, selected
          readings, event chronology and response notes.
        </p>
      </div>
    </div>
  );
}

function ReportPanel({ active }: { active: number }) {
  if (active === 0) return <OperationalSnapshot />;
  if (active === 1) return <TrendEventReview />;
  return <ProjectPeriodReport />;
}

export function ReportingProof() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectTab(index: number) {
    setActive(index);
    window.requestAnimationFrame(() => tabRefs.current[index]?.focus());
  }

  return (
    <section
      id="reportpreview"
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          Reporting
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
          Monitoring information organised for operational review.
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Explore three distinct demonstration views using neutral project
          labels and example settings. {DEMO_DISCLOSURE}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.3fr_0.7fr]">
          <div
            role="tablist"
            aria-label="Report type"
            className="border-y border-slate-300"
          >
            {reportTypes.map((type, index) => (
              <button
                key={type.title}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`homepage-report-tab-${index}`}
                role="tab"
                aria-selected={active === index}
                aria-controls="homepage-report-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  let next: number | null = null;
                  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    next = (index + 1) % reportTypes.length;
                  } else if (
                    event.key === "ArrowUp" ||
                    event.key === "ArrowLeft"
                  ) {
                    next = (index - 1 + reportTypes.length) % reportTypes.length;
                  } else if (event.key === "Home") {
                    next = 0;
                  } else if (event.key === "End") {
                    next = reportTypes.length - 1;
                  }

                  if (next !== null) {
                    event.preventDefault();
                    selectTab(next);
                  }
                }}
                className="block w-full border-b border-slate-300 border-l-2 border-l-transparent px-4 py-5 text-left last:border-b-0 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-selected:border-l-blue-600 aria-selected:text-blue-600"
              >
                <span className="block font-bold">{type.title}</span>
                <span className="mt-2 block text-sm leading-6 text-slate-500">
                  {type.description}
                </span>
              </button>
            ))}
          </div>

          <div
            id="homepage-report-panel"
            role="tabpanel"
            aria-labelledby={`homepage-report-tab-${active}`}
            className="border border-slate-300 bg-slate-50 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-300 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  {DEMO_DISCLOSURE}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  {reportTypes[active].title}
                </h3>
              </div>
              <p className="text-sm text-slate-500">Demonstration Project</p>
            </div>
            <div className="mt-7">
              <ReportPanel active={active} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="cta-primary inline-flex min-h-12 items-center justify-center px-6 font-bold"
          >
            Request a reporting walkthrough
          </Link>
          <Link
            href="/downloads/verifair-demonstration-report.pdf"
            className="inline-flex min-h-12 items-center justify-center border border-slate-300 px-6 font-bold text-slate-900 hover:bg-slate-50"
          >
            Download demonstration report
          </Link>
        </div>
      </div>
    </section>
  );
}
