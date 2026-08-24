import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "components/home/HomepageInteractiveDemo.tsx"),
  "utf8",
);
const eventsSource = fs.readFileSync(path.join(process.cwd(), "components/home/ControlCentreEvents.tsx"), "utf8");
const reportsSource = fs.readFileSync(path.join(process.cwd(), "components/home/ControlCentreReports.tsx"), "utf8");

describe("homepage interactive VerifAir demonstration", () => {
  it("uses one shared replay session and canonical event identity", () => {
    expect(source).toContain("new DemonstrationSession()");
    expect(source).toContain('const INCIDENT_ID = "VA-INC-2026-0042"');
    expect(source).toContain("selectLatestObservation");
    expect(source).toContain("Demonstration Project");
    expect(source).toContain("See the VerifAir particulate monitoring and task management workspace in action.");
    expect(source).toContain("Air Quality Control Center");
    expect(source).toContain('src="/assets/verifair_erne_tech_logo.webp"');
    expect(source).toContain('id="monitoring" className="border-b border-slate-200 bg-white');
    expect(source).toContain('timeZone: "Australia/Sydney"');
    expect(source).toContain('className="h-auto w-20 sm:w-[5.5rem]"');
  });

  it("uses one Control Centre with internal reports and events pages", () => {
    expect(source).toContain("Control Centre");
    expect(source).toContain("OPEN RAISED EVENT");
    expect(source).toContain('aria-label="Events and alerts"');
    expect(source).toContain('setActiveView("events")');
    expect(source).toContain("<ControlCentreReports snapshot={snapshot} />");
    expect(source).toContain("<ControlCentreEvents");
    expect(source).not.toContain("Raised Events");
    expect(source).not.toContain('role="tablist" aria-label="Demonstration view"');
  });

  it("uses a two-by-two particulate wallboard and opens location incidents", () => {
    expect(source).toContain("setSelectedId");
    expect(source).toContain("setMetricId");
    expect(source).toContain('aria-label="Monitoring overview"');
    expect(source).toContain("sm:grid-cols-2");
    expect(source).toContain("border-l-emerald-500 border-t-emerald-500");
    expect(source).toContain("border-l-amber-500 border-t-amber-500");
    expect(source).toContain("border-l-red-500 border-t-red-500");
    expect(source).toContain("respirable dust recent trend");
    expect(source).toContain("getDemonstrationRespirableDustTrend");
    expect(source).toContain("metrics.slice(1)");
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-label="Close location details"');
    expect(source).toContain("Location incidents");
    expect(source).toContain("START WORK");
  });

  it("separates monitoring from the heart-accessed system health view", () => {
    expect(source).toContain("const ribbon =");
    expect(source).not.toContain("MONITORING · Demonstration Healthcare Construction Project");
    expect(source).toContain("{ribbon &&");
    expect(source).toContain("SystemHealthView");
    expect(source).toContain('aria-label="Health"');
    expect(source).toContain('title="Health"');
    expect(source).toContain("Site overview");
    expect(source).toContain("Gateway serial");
    expect(source).toContain("Next calibration");
    expect(source).toContain('id="health-zone"');
    expect(source).toContain('id="health-hardware"');
    expect(source).toContain("Site overview");
    expect(source).toContain("Select a zone first");
    expect(source).toContain("Monitored zones");
    expect(source).toContain("Sensors online");
    expect(source).not.toContain("System and site health");
    expect(source).not.toContain("All monitoring equipment reporting");
    expect(source).toContain('aria-label="Selected asset health details"');
    expect(source).toContain("4/4 sensors online");
    expect(source).toContain("System / data health");
    expect(source).toContain("DEGRADED");
    expect(source).toContain("STALE");
    expect(source).toContain("OFFLINE");
    expect(source.match(/Fictional demonstration\./g)?.length).toBe(1);
  });

  it("keeps health and operational state derived independently", () => {
    expect(source).toContain("DEMONSTRATION_DEVICE_HEALTH");
    expect(source).toContain("stateFor(snapshot, monitorId)");
    expect(source).not.toMatch(/stateFor\([^)]*health/i);
  });

  it("provides Jira-style event work and searchable branded reports", () => {
    expect(eventsSource).toContain("START WORK");
    expect(eventsSource).toContain('type: "ACKNOWLEDGED"');
    expect(eventsSource).toContain('type: "ASSIGNED"');
    expect(eventsSource).toContain('type: "INVESTIGATION_STARTED"');
    expect(eventsSource).toContain("Workflow status");
    expect(eventsSource).toContain("Observed conditions");
    expect(eventsSource).toContain("Action taken");
    expect(eventsSource).toContain("Attach site photo");
    expect(eventsSource).toContain("Escalate");
    expect(eventsSource).toContain("Operational work log");
    expect(reportsSource).toContain("Saved ticket work log");
    expect(reportsSource).toContain("Search reports");
    expect(reportsSource).toContain("Where it is");
    expect(reportsSource).toContain("Date range");
    expect(reportsSource).toContain("Date range · demo preview");
    expect(reportsSource).toContain("Demo preview only — no file is generated.");
    expect(reportsSource).not.toContain("matchesDateRange");
    expect(reportsSource).toContain("All locations");
    expect(reportsSource).toContain("Operational event report");
    expect(reportsSource).toContain("System health and data availability");
    expect(reportsSource).toContain("Evidence register");
    expect(reportsSource).toContain('src="/assets/verifair_erne_tech__light_logo.webp"');
    expect(source).toContain("snapshot.incidentState.closed");
    expect(source).toContain("recordOpen && eventResolved");
    expect(source).toContain("VIEW EVENT RECORD");
    expect(source).toContain("VIEW GENERATED REPORT");
  });

  it("provides completion-gated controls in a compact guide above the board", () => {
    expect(source).toContain("const sequenceSteps =");
    expect(source).toContain("offsetMs: 120_000");
    expect(source).toContain("offsetMs: 480_000");
    expect(source).toContain('aria-label="Demonstration guide"');
    expect(source).toContain('bg-slate-900 px-4 py-3 text-white');
    expect(source).toContain("lg:grid-cols-[11rem_minmax(0,1fr)_auto]");
    expect(source).not.toContain("lg:sticky lg:top-4");
    expect(source).toContain('aria-label="Control Centre sections"');
    expect(source).toContain('aria-label="Events and alerts"');
    expect(source).toContain('aria-label="Reports"');
    expect(source).toContain('aria-label="Trends"');
    expect(source).toContain('setActiveView("trends")');
    expect(source).toContain('setActiveView("reports")');
    expect(source).toContain('setActiveView("events")');
    expect(source).toContain('title="Monitoring"');
    expect(source).toContain('title="Trends"');
    expect(source).toContain("bg-red-500");
    expect(source).not.toContain("detailsRequest");
    expect(source).not.toContain("Situational explainer");
    expect(source).not.toContain("Required step");
    expect(source).toContain("START DEMO");
    expect(source).not.toContain("START CHANGING-CONDITION SCENARIO");
    expect(source).not.toContain("COMPLETE BASELINE CHECK");
    expect(source).toContain("OPEN RAISED EVENT");
    expect(source).not.toContain("COMPLETE ATTENTION REVIEW");
    expect(source).toContain("COMPLETE MONITORING PERIOD");
    expect(source).toContain("Particulate / operational state");
    expect(source).toContain("Below configured attention level");
    expect(source).toContain("Configured attention level reached");
    expect(source).toContain("Configured action level reached");
    expect(source).not.toContain("setInterval");
    expect(source).not.toContain("Play demo sequence");
    expect(source).not.toContain("Pause demo sequence");
    expect(source).toContain("Reset demonstration");
    expect(source).toContain('aria-label="ACTION history, current state HEALTHY"');
  });
});
