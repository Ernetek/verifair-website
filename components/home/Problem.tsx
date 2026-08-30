import Image from "next/image";
import Link from "next/link";

import {
  getDemonstrationMetricTrendSeries,
  publicDemonstrationScenario,
} from "@/lib/replay/demonstration-scenario";

const ALERT_OFFSET_MS = 120_000;
const PEAK_OFFSET_MS = 240_000;

function formatScenarioTime(offsetMs: number) {
  const timestamp = new Date(Date.parse(publicDemonstrationScenario.startTimestamp) + offsetMs);
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: publicDemonstrationScenario.metadata.displayTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(timestamp);
}

function getMetricReading(offsetMs: number, monitorId: string, metricId: string) {
  const observation = publicDemonstrationScenario.observations.find(
    (item) => item.offsetMs === offsetMs && item.monitorId === monitorId && item.metricId === metricId,
  );
  return observation?.reading.status === "available" ? observation.reading.value : null;
}

const monitor = publicDemonstrationScenario.monitors.find((item) => item.id === "WORK_ZONE_A");
const alertReading = getMetricReading(ALERT_OFFSET_MS, "WORK_ZONE_A", "PM2_5");
const peakReading = getMetricReading(PEAK_OFFSET_MS, "WORK_ZONE_A", "PM2_5");
const trendSeries = getDemonstrationMetricTrendSeries("WORK_ZONE_A", "PM2_5", PEAK_OFFSET_MS, 7);
const trendMax = Math.max(...trendSeries, 1);
const trendPoints = trendSeries
  .map((value, index) => {
    const x = (index / Math.max(trendSeries.length - 1, 1)) * 320;
    const y = 118 - (value / trendMax) * 96;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ");

const responseEvents = publicDemonstrationScenario.timelineEvents
  .filter((event) => event.offsetMs >= ALERT_OFFSET_MS)
  .map((event) => ({
    state:
      event.type === "INCIDENT_OPENED"
        ? "ALERT TRIGGERED"
        : event.type === "ACTION_RECORDED"
          ? "ACTION RECORDED"
          : event.type === "EVIDENCE_RETAINED"
            ? "FOLLOW-UP RETAINED"
            : "EVENT CLOSED",
    detail: event.title,
    time: formatScenarioTime(event.offsetMs),
    tone: event.type === "INCIDENT_RESOLVED" || event.type === "EVIDENCE_RETAINED" ? "green" : "blue",
    icon: event.type === "INCIDENT_RESOLVED" ? "✓" : event.type === "EVIDENCE_RETAINED" ? "↘" : "○",
  }));

const locations = publicDemonstrationScenario.monitors.map((item, index) => [
  `M${index + 1}`,
  item.name.replace("Zone A · ", ""),
  item.id,
] as const);

export function ProblemSection() {
  return (
    <section
      id="operational-gap"
      aria-labelledby="operational-gap-title"
      className="border-b border-slate-200 bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <header className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold tracking-[0.18em] text-[#1265c7] sm:text-base">
            MONITORING IS ONLY THE START
          </p>

          <h2
            id="operational-gap-title"
            className="mt-4 text-4xl font-bold tracking-[-0.035em] text-[#071a38] sm:text-5xl lg:text-[64px] lg:leading-[1.05]"
          >
            The alert isn&apos;t the end of the job.
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-600 sm:text-xl">
            When particulate conditions change, someone still has to respond. Who saw it? Who took ownership? What was
            investigated? What action was taken? Did conditions recover? And can you reconstruct the sequence afterwards?
          </p>
        </header>

        <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-[0.78fr_1.12fr_0.9fr]">
          <article className="rounded-[28px] border border-red-100 bg-[#fff9f8] p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-xl text-red-600 ring-1 ring-red-100">
                !
              </div>

              <div>
                <p className="font-bold uppercase tracking-[0.04em] text-red-600">The monitor raises the alert</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">A meaningful change is detected.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold tracking-[0.08em] text-blue-800">
                SIMULATED DEMONSTRATION DATA
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold tracking-tight text-[#071a38]">{formatScenarioTime(ALERT_OFFSET_MS)}</p>
                  <p className="mt-1 text-sm text-slate-500">Approved public replay scenario</p>
                </div>

                <span className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold tracking-wide text-red-600">
                  CONFIGURED ALERT ●
                </span>
              </div>

              <div className="mt-8">
                <p className="text-lg font-bold text-[#071a38]">PM2.5 rising</p>
                <p className="mt-1 text-sm text-slate-500">{monitor?.name ?? "Zone A · Monitoring Location 1"}</p>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight text-red-600">{alertReading ?? 26}</span>
                  <span className="pb-1 text-base text-slate-600">µg/m³</span>
                </div>

                <p className="mt-1 text-sm text-slate-500">Later simulated peak: {peakReading ?? 38} µg/m³</p>
              </div>

              <div className="mt-7" aria-label="Simulated PM2.5 trend from the approved public replay scenario">
                <svg
                  viewBox="0 0 320 130"
                  className="h-auto w-full"
                  role="img"
                  aria-label="Simulated PM2.5 trend rising through the approved public replay scenario"
                >
                  <polyline
                    points={trendPoints}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="320" cy={118 - ((peakReading ?? 38) / trendMax) * 96} r="5" fill="#dc2626" />
                </svg>

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Earlier</span>
                  <span>Configured alert</span>
                  <span>Later peak</span>
                </div>
              </div>

              <div className="mt-5 flex justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                <span>Scenario provenance</span>
                <span className="text-right font-medium text-slate-700">Frozen fictional dataset</span>
              </div>
            </div>
          </article>

          <article className="flex flex-col">
            <div className="mb-5 flex items-start gap-3 px-1">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 font-bold text-blue-600">
                ?
              </div>

              <div>
                <p className="font-bold uppercase tracking-[0.04em] text-[#1265c7]">The operational gap</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Data alone doesn&apos;t close the loop.</p>
              </div>
            </div>

            <div className="relative min-h-[540px] flex-1 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-sm">
              <Image
                src="/assets/landing-hero.webp"
                alt="Healthcare refurbishment works beside an occupied hospital environment"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,56,0.06),rgba(7,26,56,0.16))]" aria-hidden="true" />

              <div className="relative z-10 flex h-full min-h-[540px] flex-col justify-center gap-4 p-6 sm:p-8">
                {[
                  ["01", "Who owns it?"],
                  ["02", "What was done?"],
                  ["03", "Was it resolved?"],
                ].map(([number, question]) => (
                  <div
                    key={number}
                    className="ml-auto flex w-full max-w-[340px] items-center gap-4 rounded-2xl border border-white/80 bg-white/95 px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.13)] backdrop-blur-sm"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1265c7] text-sm font-bold text-white">
                      {number}
                    </span>
                    <span className="text-lg font-bold text-[#071a38]">{question}</span>
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                <div className="relative grid grid-cols-4 gap-2">
                  <div className="absolute left-[12.5%] right-[12.5%] top-[11px] h-[2px] bg-slate-300" />

                  {locations.map(([id, label, monitorId], index) => (
                    <div key={monitorId} className="relative z-10 flex flex-col items-center text-center">
                      <span
                        className={[
                          "size-6 rounded-full border-[3px] bg-white",
                          index === 0 ? "border-red-500" : "border-slate-500",
                        ].join(" ")}
                      />
                      <span className={["mt-2 text-xs font-bold", index === 0 ? "text-red-600" : "text-[#071a38]"].join(" ")}>
                        {id}
                      </span>
                      <span className="mt-1 hidden max-w-24 text-[11px] leading-4 text-slate-500 sm:block">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-emerald-100 bg-[#f7fcf9] p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-700 ring-1 ring-emerald-100">
                ✓
              </div>

              <div>
                <p className="font-bold uppercase tracking-[0.04em] text-emerald-700">VerifAir manages the response</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  The validated demonstration record stays connected from alert through review and closure.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)]">
              <ol className="relative">
                <div aria-hidden="true" className="absolute bottom-5 left-[17px] top-5 w-px bg-slate-200" />

                {responseEvents.map((event) => {
                  const green = event.tone === "green";

                  return (
                    <li key={`${event.state}-${event.time}`} className="relative flex gap-4 pb-5 last:pb-0">
                      <span
                        className={[
                          "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 bg-white text-sm font-bold",
                          green ? "border-emerald-300 text-emerald-700" : "border-blue-200 text-blue-700",
                        ].join(" ")}
                      >
                        {event.icon}
                      </span>

                      <div className="min-w-0 pt-0.5">
                        <p className={["text-sm font-bold", green ? "text-emerald-700" : "text-[#1265c7]"].join(" ")}>
                          {event.state}
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {event.detail}
                          <span className="mx-2 text-slate-300">·</span>
                          <time>{event.time}</time>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white font-bold text-emerald-700 ring-1 ring-emerald-100">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-bold text-emerald-800">VALIDATED EVENT RECORD</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600">Canonical simulated events retained in sequence.</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-[24px] border border-blue-100 bg-[#f6faff] px-6 py-6 sm:px-8 lg:flex-row lg:items-center">
          <div className="flex max-w-3xl items-center gap-5">
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-full bg-[#1265c7] text-2xl font-bold text-white sm:flex">
              ✓
            </span>

            <p className="text-xl font-bold leading-8 text-[#071a38] sm:text-2xl">
              VerifAir connects the moment conditions change with the response record and evidence that follow.
            </p>
          </div>

          <Link
            href="#monitoring"
            className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#1265c7] px-6 py-3.5 font-bold text-white transition hover:bg-[#0d54aa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            SEE VERIFAIR IN ACTION
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Simulated VerifAir demonstration using the approved frozen fictional replay dataset. Operational levels and responses are project configured.
        </p>
      </div>
    </section>
  );
}
