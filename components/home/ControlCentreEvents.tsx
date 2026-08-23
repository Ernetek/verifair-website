"use client";

import { ExclamationTriangleIcon, PaperClipIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";

import { PARTICULATE_UNIT } from "@/lib/metrics";
import { getDemonstrationMetricTrendSeries } from "@/lib/replay/demonstration-scenario";
import { selectLatestObservation } from "@/lib/replay/selectors";
import { DemonstrationSession, type DemonstrationSessionSnapshot } from "@/lib/demonstration/session";

const INCIDENT_ID = "VA-INC-2026-0042";
const operators = ["Site Supervisor", "Project Manager", "Environmental Advisor", "Facilities Coordinator"];

function currentValue(snapshot: DemonstrationSessionSnapshot) {
  const observation = selectLatestObservation(snapshot.replayState, "WORK_ZONE_A", "RESPIRABLE_DUST");
  return observation?.reading.status === "available" ? Math.round(observation.reading.value) : 0;
}

function workflowLabel(snapshot: DemonstrationSessionSnapshot) {
  const incident = snapshot.incidentState;
  if (incident.closed) return "Resolved";
  if (incident.phase === "Verify" || incident.phase === "Close") return "Verification";
  if (incident.investigationStarted) return "In progress";
  if (incident.assignedTo) return "Assigned";
  if (incident.acknowledged) return "Acknowledged";
  return "Open";
}

function advanceToWork(session: DemonstrationSession) {
  let incident = session.getSnapshot().incidentState;
  if (incident.phase === "Alert") session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Site Supervisor" });
  incident = session.getSnapshot().incidentState;
  if (incident.phase === "Acknowledge") session.dispatchIncidentEvent({ type: "ASSIGNED", assignee: "Site Supervisor", priority: "High" });
  incident = session.getSnapshot().incidentState;
  if (incident.phase === "Assign") session.dispatchIncidentEvent({ type: "INVESTIGATION_STARTED", startedBy: "Site Supervisor" });
}

function advanceWorkflowStep(session: DemonstrationSession, assignee: string) {
  const current = session.getSnapshot().incidentState;
  if (current.closed) return;
  if (current.phase === "Alert" || current.phase === "Acknowledge" || current.phase === "Assign") {
    advanceToWork(session);
    return;
  }
  if (current.phase === "Investigate") {
    session.dispatchIncidentEvent({ type: "VERIFICATION_STARTED", verifier: assignee, requestedBy: "Project Manager" });
    return;
  }
  if (current.phase === "Verify") {
    session.dispatchIncidentEvent({ type: "VERIFICATION_COMPLETED", verifier: assignee, outcome: "sufficient_to_close", notes: "Operational review completed from the Events workspace." });
    return;
  }
  if (current.phase === "Close") {
    session.dispatchIncidentEvent({ type: "INCIDENT_CLOSED", category: "Operational review complete", details: "Event explicitly resolved after workflow review.", closedBy: assignee });
  }
}

export function ControlCentreEvents({ session, snapshot, onWorkStarted }: { session: DemonstrationSession; snapshot: DemonstrationSessionSnapshot; onWorkStarted: () => void }) {
  const incident = snapshot.incidentState;
  const [selectedEvent, setSelectedEvent] = useState(INCIDENT_ID);
  const [assignee, setAssignee] = useState(incident.assignedTo ?? operators[0]);
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">(incident.priority ?? "High");
  const [responseType, setResponseType] = useState("Site inspection");
  const [observedConditions, setObservedConditions] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [comment, setComment] = useState("");
  const [evidencePreview, setEvidencePreview] = useState<{ name: string; url: string; type: string } | null>(null);
  const isCurrentEvent = selectedEvent === INCIDENT_ID;
  const canWork = incident.investigationStarted && !incident.closed;
  const trendValues = getDemonstrationMetricTrendSeries("WORK_ZONE_A", "RESPIRABLE_DUST", snapshot.replayState.offsetMs);
  const maxTrend = Math.max(...trendValues, 1);
  const trendPoints = trendValues.map((value, index) => `${20 + index * (580 / Math.max(trendValues.length - 1, 1))},${170 - (value / maxTrend) * 130}`).join(" ");
  const trendLabels = trendValues.map((_, index) => {
    const hoursAgo = (trendValues.length - 1 - index) * 2;
    return hoursAgo === 0 ? "Now" : `-${hoursAgo}h`;
  });
  const workflowActionLabel = incident.closed
    ? "Event resolved"
    : incident.phase === "Investigate"
      ? "MOVE TO VERIFICATION"
      : incident.phase === "Verify"
        ? "COMPLETE VERIFICATION"
        : incident.phase === "Close"
          ? "CLOSE EVENT"
          : "ACKNOWLEDGE, ASSIGN & START WORK";

  const acknowledgeAndStart = () => {
    advanceToWork(session);
    onWorkStarted();
  };

  const handlePrimaryWorkflowAction = () => {
    const current = session.getSnapshot().incidentState;
    if (current.closed) return;
    if (current.phase === "Alert" || current.phase === "Acknowledge" || current.phase === "Assign") {
      acknowledgeAndStart();
      return;
    }
    advanceWorkflowStep(session, assignee);
  };

  const changeWorkflow = (target: string) => {
    if (target === "Open") return;
    if (["Acknowledged", "Assigned", "In progress", "Verification", "Resolved"].includes(target)) {
      if (target === "Acknowledged" && session.getSnapshot().incidentState.phase === "Alert") {
        session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Site Supervisor" });
        return;
      }
      advanceToWork(session);
      onWorkStarted();
    }
    let current = session.getSnapshot().incidentState;
    if (["Verification", "Resolved"].includes(target) && current.phase === "Investigate") {
      session.dispatchIncidentEvent({ type: "VERIFICATION_STARTED", verifier: assignee, requestedBy: "Project Manager" });
    }
    current = session.getSnapshot().incidentState;
    if (target === "Resolved" && current.phase === "Verify") {
      session.dispatchIncidentEvent({ type: "VERIFICATION_COMPLETED", verifier: assignee, outcome: "sufficient_to_close", notes: "Operational review completed from the Events workspace." });
    }
    current = session.getSnapshot().incidentState;
    if (target === "Resolved" && current.phase === "Close") {
      session.dispatchIncidentEvent({ type: "INCIDENT_CLOSED", category: "Operational review complete", details: "Event explicitly resolved after workflow review.", closedBy: assignee });
    }
  };

  const changeAssignee = (value: string) => {
    setAssignee(value);
    if (incident.phase === "Alert") session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Site Supervisor" });
    if (session.getSnapshot().incidentState.phase === "Acknowledge") session.dispatchIncidentEvent({ type: "ASSIGNED", assignee: value, priority: priority as "Normal" | "High" | "Urgent" });
  };

  const saveWorkLog = () => {
    if (!canWork || (!observedConditions.trim() && !actionTaken.trim())) return;
    session.dispatchIncidentEvent({ type: "RESPONSE_RECORDED", responseType, details: `${observedConditions.trim()} ${actionTaken.trim()}`.trim(), performedBy: assignee });
    setObservedConditions("");
    setActionTaken("");
  };

  const addComment = () => {
    if (!canWork || !comment.trim()) return;
    session.dispatchIncidentEvent({ type: "RESPONSE_NOTE_ADDED", author: assignee, note: comment.trim() });
    setComment("");
  };

  const uploadEvidence = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canWork) return;
    const previewUrl = URL.createObjectURL(file);
    setEvidencePreview({ name: file.name, url: previewUrl, type: file.type });
    session.registerEvidenceAsset({ evidenceId: `EVD-${Date.now()}`, name: file.name, previewUrl });
    session.dispatchIncidentEvent({ type: "EVIDENCE_ATTACHED", evidenceId: `EVD-${file.lastModified}`, name: file.name, category: file.type.startsWith("video/") ? "Site video" : "Site photo", details: "Evidence attached from the Events workspace.", actor: assignee });
  };

  return (
    <section className="bg-slate-100" aria-labelledby="events-view-heading">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">Control Centre page</p>
        <h3 id="events-view-heading" className="mt-1 text-xl font-black text-slate-950">Alerts &amp; events</h3>
        <p className="mt-1 text-xs text-slate-500">Triage alerts, assign ownership and work the connected operational ticket.</p>
      </header>

      <div className="grid min-h-[46rem] lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-b border-slate-300 bg-white lg:border-b-0 lg:border-r" aria-label="Event queue">
          <div className="border-b border-slate-200 p-4"><label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Queue<select className="mt-2 min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900"><option>All open events</option><option>Assigned to me</option><option>Unassigned</option><option>Resolved</option></select></label></div>
          {[{ id: INCIDENT_ID, title: "Respirable Dust action condition", location: "Zone A · Monitoring Location 1", tone: "border-amber-500", state: incident.closed ? "Resolved" : workflowLabel(snapshot) }, { id: "VA-INC-2026-0038", title: "Observation freshness review", location: "Zone A · Monitoring Location 3", tone: "border-blue-500", state: "Resolved" }, { id: "VA-INC-2026-0031", title: "PM10 attention review", location: "Zone A · Monitoring Location 2", tone: "border-amber-500", state: "Resolved" }].map((item) => <button key={item.id} type="button" onClick={() => setSelectedEvent(item.id)} aria-pressed={selectedEvent === item.id} className={`w-full border-b border-l-4 border-slate-200 px-4 py-4 text-left hover:bg-slate-50 aria-pressed:bg-slate-100 ${item.tone}`}><span className="block text-sm font-black text-slate-950">{item.title}</span><span className="mt-1 block text-xs text-slate-500">{item.location}</span><span className="mt-2 flex items-center justify-between font-mono text-[10px] font-bold text-slate-500"><span>{item.id}</span><span>{item.state}</span></span></button>)}
        </aside>

        {!isCurrentEvent ? <div className="p-4 sm:p-6"><div className="border border-slate-300 bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Historical event</p><h4 className="mt-2 text-2xl font-black text-slate-950">{selectedEvent}</h4><p className="mt-3 text-sm text-slate-600">This fictional historical event is resolved. Select the current action condition to work the live demonstration ticket.</p></div></div> : (
          <div className="min-w-0 p-3 sm:p-5">
            <div className="border border-slate-300 bg-white">
              <div className="border-b border-slate-200 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] font-black text-amber-700">{INCIDENT_ID}</p><h4 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">Respirable Dust action condition</h4><p className="mt-1 text-sm text-slate-600">Zone A · Monitoring Location 1</p></div><span className="border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black uppercase text-amber-800">{workflowLabel(snapshot)}</span></div>
                {!incident.closed && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <p className="text-xs font-bold text-slate-600">Use the primary action below to move the workflow to the next step in sequence.</p>
                    {!incident.investigationStarted
                      ? <button type="button" onClick={acknowledgeAndStart} className="min-h-11 bg-amber-600 px-4 text-xs font-black text-white transition hover:bg-amber-700">ACKNOWLEDGE, ASSIGN &amp; START WORK</button>
                      : <button type="button" onClick={handlePrimaryWorkflowAction} className="min-h-11 bg-amber-600 px-4 text-xs font-black text-white transition hover:bg-amber-700">{workflowActionLabel}</button>}
                  </div>
                )}
              </div>

              <div className="grid gap-4 border-b border-slate-200 p-4 sm:grid-cols-3 sm:p-5">
                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Workflow status<select value={workflowLabel(snapshot)} onChange={(event) => changeWorkflow(event.target.value)} disabled={incident.closed} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-950"><option>Open</option><option>Acknowledged</option><option>Assigned</option><option>In progress</option><option>Verification</option><option>Resolved</option></select></label>
                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Assignee<select value={incident.assignedTo ?? assignee} onChange={(event) => changeAssignee(event.target.value)} disabled={Boolean(incident.assignedTo) || incident.closed} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-950 disabled:bg-slate-100">{operators.map((operator) => <option key={operator}>{operator}</option>)}</select></label>
                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Priority<select value={incident.priority ?? priority} onChange={(event) => setPriority(event.target.value as "Normal" | "High" | "Urgent")} disabled={Boolean(incident.assignedTo) || incident.closed} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-950 disabled:bg-slate-100"><option>Normal</option><option>High</option><option>Urgent</option></select></label>
              </div>

              <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
                <div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-black text-slate-700">Response type<select value={responseType} onChange={(event) => setResponseType(event.target.value)} disabled={!canWork} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-normal disabled:bg-slate-100"><option>Site inspection</option><option>Work method review</option><option>Containment adjustment</option><option>Stakeholder notification</option></select></label>
                    <label className="grid gap-1 text-xs font-black text-slate-700">Observed conditions<textarea value={observedConditions} onChange={(event) => setObservedConditions(event.target.value)} disabled={!canWork} rows={3} className="border border-slate-300 p-3 text-sm font-normal disabled:bg-slate-100" placeholder="Record what was observed" /></label>
                    <label className="grid gap-1 text-xs font-black text-slate-700 sm:col-span-2">Action taken<textarea value={actionTaken} onChange={(event) => setActionTaken(event.target.value)} disabled={!canWork} rows={3} className="border border-slate-300 p-3 text-sm font-normal disabled:bg-slate-100" placeholder="Describe the response or investigation work" /></label>
                  </div>
                  <button type="button" onClick={saveWorkLog} disabled={!canWork || (!observedConditions.trim() && !actionTaken.trim())} className="mt-3 min-h-10 border border-blue-700 px-4 text-xs font-black text-blue-800 disabled:border-slate-300 disabled:text-slate-400">Save work log</button>

                  <div className="mt-5 border-t border-slate-200 pt-5"><label className="grid gap-1 text-xs font-black text-slate-700">Add comment<textarea value={comment} onChange={(event) => setComment(event.target.value)} disabled={!canWork} rows={3} className="border border-slate-300 p-3 text-sm font-normal disabled:bg-slate-100" placeholder="Add an update for the project team" /></label><button type="button" onClick={addComment} disabled={!canWork || !comment.trim()} className="mt-3 min-h-10 border border-slate-300 px-4 text-xs font-black text-slate-700 disabled:text-slate-400">Add comment</button></div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Connected trend</p>
                  <div className="mt-2 border border-slate-200 bg-slate-50 p-3"><div className="flex items-end justify-between gap-3"><p className="text-sm font-black text-slate-950">Respirable Dust</p><p className="font-mono text-xl font-black text-slate-950">{currentValue(snapshot)} <span className="text-[10px] text-slate-500">{PARTICULATE_UNIT}</span></p></div><svg viewBox="0 0 620 220" className="mt-3 h-44 w-full" role="img" aria-label="Respirable Dust event trend">{[40, 80, 120, 160].map((y) => <line key={y} x1="20" x2="600" y1={y} y2={y} stroke="#cbd5e1" />)}<polyline points={trendPoints} fill="none" stroke="#0369a1" strokeWidth="5" strokeLinejoin="round" /><circle cx={20 + (trendValues.length - 1) * (580 / Math.max(trendValues.length - 1, 1))} cy={170 - ((trendValues.at(-1) ?? 0) / maxTrend) * 130} r="7" fill="#0369a1" className="motion-safe:animate-pulse" />{trendLabels.map((label, index) => <text key={label} x={20 + index * (580 / Math.max(trendLabels.length - 1, 1)) - 11} y="210" fontSize="10" fill="#64748b">{label}</text>)}</svg></div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"><label className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-slate-300 px-3 text-xs font-black ${canWork ? 'text-slate-700' : 'pointer-events-none bg-slate-100 text-slate-400'}`}><PhotoIcon className="size-4" aria-hidden="true" />Upload photo / video<input type="file" accept="image/*,video/*" onChange={uploadEvidence} disabled={!canWork} className="sr-only" /></label><button type="button" disabled={!canWork || incident.isEscalated} onClick={() => session.dispatchIncidentEvent({ type: "ESCALATED", escalatedBy: assignee, reason: "Project review requested", target: "Project Manager" })} className="inline-flex min-h-11 items-center justify-center gap-2 border border-red-300 px-3 text-xs font-black text-red-800 disabled:border-slate-300 disabled:text-slate-400"><ExclamationTriangleIcon className="size-4" aria-hidden="true" />Escalate</button></div>
                  {evidencePreview && <div className="mt-3 border border-slate-200 p-3"><p className="flex items-center gap-2 text-xs font-bold text-slate-700"><PaperClipIcon className="size-4" aria-hidden="true" />{evidencePreview.name}</p>{evidencePreview.type.startsWith("image/") && <Image src={evidencePreview.url} alt="Uploaded incident evidence preview" width={640} height={360} unoptimized className="mt-2 max-h-40 w-full object-cover" />}</div>}
                </div>
              </div>

              <div className="grid gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-3 sm:p-5"><div><p className="text-[10px] font-black uppercase text-slate-500">Work logs</p><p className="mt-1 text-lg font-black">{incident.responses.length}</p></div><div><p className="text-[10px] font-black uppercase text-slate-500">Comments</p><p className="mt-1 text-lg font-black">{incident.responseNotes.length}</p></div><div><p className="text-[10px] font-black uppercase text-slate-500">Evidence</p><p className="mt-1 text-lg font-black">{incident.evidence.length}</p></div></div>
            </div>
          </div>
        )}
      </div>
      <p className="border-t border-slate-200 bg-white px-4 py-3 text-[10px] leading-4 text-slate-500 sm:px-5">Fictional demonstration event and users. Workflow entries are retained in the deterministic incident record.</p>
    </section>
  );
}
