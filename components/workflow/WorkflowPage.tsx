"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { ArrowRightIcon, CheckCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import { ControlCentreEvents } from "@/components/home/ControlCentreEvents";
import { DemonstrationSession } from "@/lib/demonstration/session";
import { DEMONSTRATION_METRICS, publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";
import { PARTICULATE_UNIT } from "@/lib/metrics";
import { OPERATIONAL_TIMELINE } from "@/lib/demonstration/operational-timeline";

const EVENT_OFFSET_MS = 240_000;
const eventMonitor = publicDemonstrationScenario.monitors[0];

function valueAt(metricId: (typeof DEMONSTRATION_METRICS)[number]["id"]) {
  const readings = publicDemonstrationScenario.observations.filter(
    (observation) =>
      observation.monitorId === eventMonitor.id && observation.metricId === metricId && observation.offsetMs <= EVENT_OFFSET_MS
  );
  const observation = readings[readings.length - 1];
  return observation?.reading.status === "available" ? observation.reading.value : 0;
}

const observations = DEMONSTRATION_METRICS.map((metric) => ({
  ...metric,
  value: valueAt(metric.id)
}));

const observationOrder = ["RESPIRABLE_DUST", "PM1", "PM2_5", "PM10"] as const;

const recordItems = [
  "Observations",
  "Trigger / event",
  "Alert",
  "Notifications",
  "Acknowledgement",
  "Assignment",
  "Investigation",
  "Recorded actions",
  "Comments",
  "Continued observations",
  "Review",
  "Resolution",
  "Evidence",
  "Generated report"
];

function WorkflowStatus({ label, tone = "blue" }: { label: string; tone?: "blue" | "red" | "amber" | "green" }) {
  const styles = {
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    red: "border-red-200 bg-red-50 text-red-900",
    amber: "border-amber-200 bg-amber-50 text-amber-950",
    green: "border-emerald-200 bg-emerald-50 text-emerald-900"
  };
  return (
    <span className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-black uppercase tracking-[0.08em] ${styles[tone]}`}>
      <span aria-hidden="true" className="size-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

function EventObservations() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {observationOrder.map((metricId, index) => {
        const observation = observations.find((item) => item.id === metricId) ?? observations[0];
        return (
          <div key={observation.id} className={`border p-3 ${index === 0 ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
              {observation.label === "Respirable Dust" ? "Respirable" : observation.label}
            </p>
            <p className="mt-2 text-2xl font-black text-slate-950">{observation.value}</p>
            <p className="text-[10px] font-bold text-slate-500">{PARTICULATE_UNIT}</p>
          </div>
        );
      })}
    </div>
  );
}

function IncidentCentre() {
  const [selected, setSelected] = useState("WORK_ZONE_A");
  return (
    <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
      <aside className="border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-700">Incident Centre</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">Sydney Hospital Project</h2>
          </div>
          <WorkflowStatus label="Active" tone="red" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="border border-red-200 bg-red-50 p-3">
            <p className="text-2xl font-black text-red-800">1</p>
            <p className="text-[10px] font-black uppercase text-red-800">Active</p>
          </div>
          <div className="border border-amber-200 bg-amber-50 p-3">
            <p className="text-2xl font-black text-amber-900">1</p>
            <p className="text-[10px] font-black uppercase text-amber-900">Attention</p>
          </div>
          <div className="border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-2xl font-black text-emerald-800">2</p>
            <p className="text-[10px] font-black uppercase text-emerald-800">Resolved</p>
          </div>
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Active event</p>
        <button
          type="button"
          onClick={() => setSelected("WORK_ZONE_A")}
          aria-pressed={selected === "WORK_ZONE_A"}
          className="mt-2 w-full border-l-8 border-red-600 bg-red-50 p-4 text-left ring-2 ring-blue-500 ring-offset-2 focus-visible:outline-none"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black uppercase text-red-900">Work Zone</span>
            <span aria-hidden="true" className="text-xl text-red-700">
              ●
            </span>
          </div>
          <p className="mt-3 text-4xl font-black text-slate-950">
            {valueAt("RESPIRABLE_DUST")} <span className="text-xs font-bold">{PARTICULATE_UNIT}</span>
          </p>
          <p className="mt-1 text-xs font-black uppercase text-red-800">ACTION · Configured action level reached</p>
          <p className="mt-4 text-xs font-bold text-slate-600">Triggered: 00:02 · Last Sensor Reading: 00:04</p>
        </button>
      </aside>
      <EventDetail />
    </div>
  );
}

function EventDetail() {
  return (
    <section className="border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-950 p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-300">Active event · Work Zone</p>
            <h2 className="mt-2 text-2xl font-black">Work Zone / Monitor 01</h2>
            <p className="mt-1 text-xs text-slate-300">Event ID: INCIDENT_WORK_ZONE_REVIEW · Created at scenario offset 00:02</p>
          </div>
          <WorkflowStatus label="Action" tone="red" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <WorkflowStatus label="Acknowledged" tone="blue" />
          <span className="inline-flex min-h-9 items-center gap-2 border border-slate-600 px-3 text-xs font-black uppercase text-slate-200">
            <UserCircleIcon className="size-4" aria-hidden="true" />
            Assigned to Site Supervisor
          </span>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Latest readings</p>
            <div className="mt-3">
              <EventObservations />
            </div>
            <dl className="mt-4 grid gap-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Observation freshness</dt>
                <dd className="font-black text-emerald-800">CURRENT</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">System / data health</dt>
                <dd className="font-black text-emerald-800">HEALTHY</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Acknowledged by</dt>
                <dd className="font-black text-slate-950">Site Manager · 00:03</dd>
              </div>
            </dl>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Notes / comments</p>
            <div className="mt-3 border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              Response owner reviewed the event context and recorded the site inspection. No source attribution or causal conclusion is
              made.
            </div>
            <div className="mt-4 border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-900">Recorded action</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                Temporary dust control reviewed and work area inspected.
              </p>
              <p className="mt-2 text-xs text-slate-600">Recorded by Site Supervisor · 00:07</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityTimeline() {
  return (
    <section className="border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">ACT · Activity timeline</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Every response step remains connected.</h2>
        </div>
        <p className="text-xs font-bold text-slate-500">System events and user actions are labelled separately.</p>
      </div>
      <ol className="mt-7 border-l-2 border-slate-200 pl-5 sm:pl-8">
        {OPERATIONAL_TIMELINE.map(([actor, time, title, description]) => (
          <li key={`${time}-${title}`} className="relative pb-6 last:pb-0">
            <span
              className={`absolute -left-[1.65rem] top-0 flex size-5 items-center justify-center rounded-full border-2 border-white text-[9px] font-black text-white sm:-left-[2.65rem] ${actor === "SYSTEM" ? "bg-blue-700" : "bg-slate-700"}`}
              aria-hidden="true"
            >
              {actor === "SYSTEM" ? "S" : "U"}
            </span>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                {actor === "SYSTEM" ? "System event" : "User action"}
              </span>
              <time className="font-mono text-xs font-bold text-blue-700">{time}</time>
            </div>
            <h3 className="mt-1 text-base font-black text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function RecordPreview() {
  return (
    <section className="border border-slate-300 bg-slate-50 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">RECORD preview</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">One connected operational history.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            The workflow keeps observations, response activity and closure information connected for review. Full reporting depth belongs on
            Reporting.
          </p>
        </div>
        <CheckCircleIcon className="size-8 text-emerald-700" aria-hidden="true" />
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {recordItems.map((item, index) => (
          <div key={item} className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700">
            <span className="font-mono text-blue-700">{String(index + 1).padStart(2, "0")}</span>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkflowIncidentDemo() {
  const [session] = useState(() => new DemonstrationSession());
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);

  return (
    <section id="incident-centre" className="border-b border-slate-200 bg-slate-50 py-6 sm:py-8">
      <div className="container">
        <ControlCentreEvents session={session} snapshot={snapshot} onWorkStarted={() => {}} />
      </div>
    </section>
  );
}

export function WorkflowPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="border-b border-slate-800 bg-slate-950 py-20 text-white sm:py-28">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">VERIFAIR WORKFLOW</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl">
              From changing conditions to coordinated action.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              VerifAir connects particulate observations, alerts, response activity and the operational record in a single workflow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#incident-centre" className="cta-primary inline-flex min-h-12 items-center justify-center px-6 font-black">
                See the Workflow
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center border border-white/50 px-6 font-black text-white hover:bg-white/10"
              >
                Discuss Your Requirements
              </Link>
            </div>
          </div>
          <Image
            src="/assets/workflow-site-investigation.png"
            alt="VerifAir ACT workflow response context"
            width={1536}
            height={1024}
            className="h-full max-h-[34rem] w-full object-cover"
            priority
            unoptimized
          />
        </div>
      </section>
      <section id="incident-centre" className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
        <div className="container">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">ACT · Incident Centre</p>
          <div className="mt-5">
            <IncidentCentre />
          </div>
        </div>
      </section>
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-18">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <span className="border border-slate-300 bg-white px-5 py-3 text-sm font-black">
              ASSESS
              <br />
              <span className="text-xs text-slate-500">Monitoring establishes the event</span>
            </span>
            <ArrowRightIcon className="size-5 text-blue-700" aria-hidden="true" />
            <span className="border-2 border-blue-700 bg-blue-50 px-7 py-4 text-base font-black text-blue-950">
              ACT
              <br />
              <span className="text-xs text-blue-700">Workflow coordinates response</span>
            </span>
            <ArrowRightIcon className="size-5 text-blue-700" aria-hidden="true" />
            <span className="border border-slate-300 bg-white px-5 py-3 text-sm font-black">
              RECORD
              <br />
              <span className="text-xs text-slate-500">History leads to reporting</span>
            </span>
          </div>
        </div>
      </section>
      <section className="border-b border-slate-200 py-14 sm:py-20">
        <div className="container">
          <ActivityTimeline />
        </div>
      </section>
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
        <div className="container grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Recorded action → continued monitoring</p>
            <h2 className="mt-3 text-3xl font-black">Response activity stays connected to subsequent observations.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              After a user records an action, monitoring continues and subsequent observations remain visible in the same event history. The
              sequence does not claim that the recorded action caused later readings.
            </p>
          </div>
          <div className="border border-slate-300 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Subsequent observations</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {valueAt("RESPIRABLE_DUST")} <span className="text-sm font-bold text-slate-500">{PARTICULATE_UNIT}</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-700">Work Zone · observation retained after the recorded action</p>
          </div>
        </div>
      </section>
      <section className="border-b border-slate-200 py-14 sm:py-20">
        <div className="container">
          <RecordPreview />
        </div>
      </section>
      <section className="bg-blue-700 py-16 text-white sm:py-20">
        <div className="container flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">Continue to the next capability</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-4xl">
              Turn monitoring events into a coordinated operational record.
            </h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/contact" className="cta-primary-inverse inline-flex min-h-12 items-center justify-center px-6 font-black">
              Discuss Your Requirements
            </Link>
            <Link
              href="/reporting"
              className="inline-flex min-h-12 items-center justify-center border border-white/60 px-6 font-black text-white hover:bg-white/10"
            >
              Explore Reporting
            </Link>
          </div>
        </div>
      </section>
      <p className="container py-4 text-xs text-slate-500">Demonstration only. Sites, events, people and readings shown are fictional and are used to demonstrate VerifAir functionality.</p>
      <WorkflowIncidentDemo />
    </main>
  );
}
