"use client";

import { ExclamationTriangleIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

import { DemonstrationSession, type DemonstrationSessionSnapshot } from "@/lib/demonstration/session";

const INCIDENT_ID = "VA-INC-2026-0042";
const operators = ["Monitoring room operator", "Project manager", "Environmental advisor", "Facilities coordinator"];
const assignmentRoster = {
  air_response: ["Monitoring room operator", "Environmental advisor"],
  site_response: ["Project manager", "Facilities coordinator"],
} as const;
type AssignmentGroup = keyof typeof assignmentRoster;
const OTHER_OPTION = "Other — see notes";

const OBSERVED_CONDITIONS_OPTIONS = [
  "Elevated dust visible in work zone",
  "Cutting or grinding activity in progress",
  "Containment barrier compromised",
  "Increased foot traffic through zone",
  "HVAC system operating in recirculation mode",
  OTHER_OPTION,
] as const;

const ACTION_TAKEN_OPTIONS = [
  "Stopped work and assessed area",
  "Increased water suppression / wet methods",
  "Adjusted containment and ventilation",
  "Notified affected trades and supervisors",
  "Reviewed and updated work method statement",
  OTHER_OPTION,
] as const;

const CLOSE_REASON_OPTIONS = [
  "Readings returned to normal — no further action required",
  "Operational controls reviewed and confirmed adequate",
  "Work method updated and team briefed",
  "False positive — equipment issue identified",
  OTHER_OPTION,
] as const;

const DEMO_EVIDENCE_ASSET = {
  name: "site-investigation-photo.webp",
  url: "/assets/workflow-site-investigation.webp",
  type: "image/webp",
} as const;

function workflowLabel(snapshot: DemonstrationSessionSnapshot) {
  const incident = snapshot.incidentState;
  if (incident.closed) return "Resolved";
  if (incident.phase === "Verify" || incident.phase === "Close") return "Verification";
  if (incident.investigationStarted) return "In progress";
  if (incident.assignedTo) return "Assigned";
  if (incident.acknowledged) return "Acknowledged";
  return "Open";
}

function advanceToWork(session: DemonstrationSession, assignmentGroup: AssignmentGroup, assignee: string, priority: "Normal" | "High" | "Urgent") {
  let incident = session.getSnapshot().incidentState;
  if (incident.phase === "Alert") session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Monitoring room operator" });
  incident = session.getSnapshot().incidentState;
  if (incident.phase === "Acknowledge") session.dispatchIncidentEvent({ type: "ASSIGNED", assigneeGroup: assignmentGroup, assignee, priority });
  incident = session.getSnapshot().incidentState;
  if (incident.phase === "Assign") session.dispatchIncidentEvent({ type: "INVESTIGATION_STARTED", startedBy: "Monitoring room operator" });
}

export function ControlCentreEvents({ session, snapshot, onWorkStarted, onResponseRecorded = () => {} }: { session: DemonstrationSession; snapshot: DemonstrationSessionSnapshot; onWorkStarted: () => void; onResponseRecorded?: () => void }) {
  const incident = snapshot.incidentState;
  const [selectedEvent, setSelectedEvent] = useState(INCIDENT_ID);
  const [assignedGroup, setAssignedGroup] = useState<AssignmentGroup>((incident.assignedGroup as AssignmentGroup) ?? "air_response");
  const [assignee, setAssignee] = useState(incident.assignedTo ?? operators[0]);
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">(incident.priority ?? "High");
  const [responseType, setResponseType] = useState("");
  const [observedConditions, setObservedConditions] = useState("");
  const [observedOther, setObservedOther] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [actionOther, setActionOther] = useState("");
  const [evidenceAttached, setEvidenceAttached] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [closeOther, setCloseOther] = useState("");
  const [workLogStatus, setWorkLogStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const isCurrentEvent = selectedEvent === INCIDENT_ID;
  const canWork = incident.investigationStarted && !incident.closed;
  const isInvestigating = incident.investigationStarted && !incident.closed;
  const canClose = incident.phase === "Close";

  const startWork = () => {
    advanceToWork(session, assignedGroup, assignee, priority);
    onWorkStarted();
  };

  const saveWorkLog = () => {
    if (!canWork) {
      setWorkLogStatus({ tone: "error", message: "Start the investigation before saving a work log." });
      return;
    }
    if (!responseType.trim() || !observedConditions.trim() || !actionTaken.trim()) {
      setWorkLogStatus({ tone: "error", message: "Select the response type, observed conditions, and action taken before saving." });
      return;
    }
    const observedText = observedConditions === OTHER_OPTION ? observedOther.trim() : observedConditions.trim();
    const actionText = actionTaken === OTHER_OPTION ? actionOther.trim() : actionTaken.trim();
    if (!observedText || !actionText) {
      setWorkLogStatus({ tone: "error", message: "Complete the notes for any 'Other' selections before saving." });
      return;
    }
    const responseResult = session.dispatchIncidentEvent({
      type: "RESPONSE_RECORDED",
      responseType,
      details: `Observed: ${observedText}. Action: ${actionText}.`,
      performedBy: assignee,
    });
    if (!responseResult.ok) {
      setWorkLogStatus({ tone: "error", message: responseResult.error });
      return;
    }
    setWorkLogStatus({ tone: "success", message: "Work log saved to the incident record." });
    setResponseType("");
    setObservedConditions("");
    setObservedOther("");
    setActionTaken("");
    setActionOther("");
    onResponseRecorded();
  };

  const attachDemoEvidence = () => {
    if (!canWork || evidenceAttached) return;
    setEvidenceAttached(true);
    session.registerEvidenceAsset({ evidenceId: "EVD-DEMO-001", name: DEMO_EVIDENCE_ASSET.name, previewUrl: DEMO_EVIDENCE_ASSET.url });
    session.dispatchIncidentEvent({ type: "EVIDENCE_ATTACHED", evidenceId: "EVD-DEMO-001", name: DEMO_EVIDENCE_ASSET.name, category: "Site photo", details: "Site investigation photo attached.", actor: assignee });
  };

  const advancePhase = () => {
    const current = session.getSnapshot().incidentState;
    if (current.closed) return;
    if (current.phase === "Investigate") {
      session.dispatchIncidentEvent({ type: "VERIFICATION_STARTED", verifier: assignee, requestedBy: "Project Manager" });
    } else if (current.phase === "Verify") {
      session.dispatchIncidentEvent({ type: "VERIFICATION_COMPLETED", verifier: assignee, outcome: "sufficient_to_close", notes: "Operational review completed." });
    }
  };

  const closeEvent = () => {
    const current = session.getSnapshot().incidentState;
    if (current.phase !== "Close") return;
    const reasonText = closeReason === OTHER_OPTION ? closeOther.trim() : closeReason;
    session.dispatchIncidentEvent({ type: "INCIDENT_CLOSED", category: "Operational review complete", details: reasonText, closedBy: assignee });
  };

  const changeGroup = (value: AssignmentGroup) => {
    setAssignedGroup(value);
    const nextAssignee = assignmentRoster[value][0];
    setAssignee(nextAssignee);
    const current = session.getSnapshot().incidentState;
    if (current.phase === "Alert") {
      session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Monitoring room operator" });
      if (session.getSnapshot().incidentState.phase === "Acknowledge") {
        session.dispatchIncidentEvent({ type: "ASSIGNED", assigneeGroup: value, assignee: nextAssignee, priority });
      }
      return;
    }
    if (current.phase === "Acknowledge" || current.phase === "Assign" || current.phase === "Investigate" || current.phase === "Verify") {
      session.dispatchIncidentEvent({ type: "ASSIGNED", assigneeGroup: value, assignee: nextAssignee, priority });
    }
  };

  const changeAssignee = (value: string) => {
    setAssignee(value);
    const current = session.getSnapshot().incidentState;
    if (current.phase === "Alert") {
      session.dispatchIncidentEvent({ type: "ACKNOWLEDGED", acknowledgedBy: "Monitoring room operator" });
      if (session.getSnapshot().incidentState.phase === "Acknowledge") {
        session.dispatchIncidentEvent({ type: "ASSIGNED", assigneeGroup: assignedGroup, assignee: value, priority });
      }
      return;
    }
    if (current.phase === "Acknowledge" || current.phase === "Assign" || current.phase === "Investigate" || current.phase === "Verify") {
      session.dispatchIncidentEvent({ type: "ASSIGNED", assigneeGroup: assignedGroup, assignee: value, priority });
    }
  };

  const changePriority = (value: "Normal" | "High" | "Urgent") => {
    setPriority(value);
    const current = session.getSnapshot().incidentState;
    if (current.closed || current.phase === "Alert") return;
    if (current.phase === "Acknowledge" || current.phase === "Assign" || current.phase === "Investigate" || current.phase === "Verify") {
      session.dispatchIncidentEvent({ type: "ASSIGNED", assigneeGroup: assignedGroup, assignee, priority: value });
    }
  };

  const workflowStatus = workflowLabel(snapshot);
  const currentAssignmentGroup = (incident.assignedGroup ?? assignedGroup) as AssignmentGroup;

  return (
    <section className="bg-slate-100" aria-labelledby="events-view-heading">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">Particulate monitoring &amp; task management</p>
        <h3 id="events-view-heading" className="mt-1 text-xl font-black text-slate-950">Operational event response</h3>
        <p className="mt-1 text-xs text-slate-500">Triage alerts, assign ownership and work the connected operational ticket.</p>
      </header>

      <div className="grid min-h-[46rem] lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-b border-slate-300 bg-white lg:border-b-0 lg:border-r" aria-label="Event queue">
          <div className="border-b border-slate-200 p-4"><label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Queue<select className="mt-2 min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900"><option>All open events</option><option>Assigned to me</option><option>Unassigned</option><option>Resolved</option></select></label></div>
          {[{ id: INCIDENT_ID, title: "Respirable Dust action condition", location: "Zone A Â· Monitoring Location 1", tone: "border-amber-500", state: incident.closed ? "Resolved" : workflowStatus }, { id: "VA-INC-2026-0038", title: "Observation freshness review", location: "Zone A Â· Monitoring Location 3", tone: "border-blue-500", state: "Resolved" }, { id: "VA-INC-2026-0031", title: "PM10 attention review", location: "Zone A Â· Monitoring Location 2", tone: "border-amber-500", state: "Resolved" }].map((item) => <button key={item.id} type="button" onClick={() => setSelectedEvent(item.id)} aria-pressed={selectedEvent === item.id} className={`w-full border-b border-l-4 border-slate-200 px-4 py-4 text-left hover:bg-slate-50 aria-pressed:bg-slate-100 ${item.tone}`}><span className="block text-sm font-black text-slate-950">{item.title}</span><span className="mt-1 block text-xs text-slate-500">{item.location}</span><span className="mt-2 flex items-center justify-between font-mono text-[10px] font-bold text-slate-500"><span>{item.id}</span><span>{item.state}</span></span></button>)}
        </aside>

        {!isCurrentEvent ? <div className="p-4 sm:p-6"><div className="border border-slate-300 bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Historical event</p><h4 className="mt-2 text-2xl font-black text-slate-950">{selectedEvent}</h4><p className="mt-3 text-sm text-slate-600">This fictional historical event is resolved. Select the current action condition to work the live demonstration ticket.</p></div></div> : (
          <div className="min-w-0 p-3 sm:p-5">
            <div className="border border-slate-300 bg-white">

              {/* Header â€” ID, title, live status badge */}
              <div className="border-b border-slate-200 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><p className="font-mono text-[10px] font-black text-amber-700">{INCIDENT_ID}</p><h4 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">Respirable Dust action condition</h4><p className="mt-1 text-sm text-slate-600">Zone A Â· Monitoring Location 1</p></div>
                  <span className={`px-3 py-2 text-xs font-black uppercase ${incident.closed ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "border border-amber-200 bg-amber-50 text-amber-800"}`}>{workflowStatus}</span>
                </div>
                {!incident.investigationStarted && !incident.closed && (
                  <button type="button" onClick={startWork} className="mt-4 min-h-11 bg-amber-600 px-5 text-xs font-black text-white transition hover:bg-amber-700">START WORK</button>
                )}
              </div>

              {/* Assignee / priority */}
              <div className="grid gap-4 border-b border-slate-200 p-4 sm:grid-cols-3 sm:p-5">
                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Group<select value={currentAssignmentGroup} onChange={(event) => changeGroup(event.target.value as AssignmentGroup)} disabled={incident.closed} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-950 disabled:bg-slate-100"><option value="air_response">air_response</option><option value="site_response">site_response</option></select></label>
                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Assignee<select value={incident.assignedTo ?? assignee} onChange={(event) => changeAssignee(event.target.value)} disabled={incident.closed} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-950 disabled:bg-slate-100">{assignmentRoster[currentAssignmentGroup].map((operator) => <option key={operator}>{operator}</option>)}</select></label>
                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Priority<select value={incident.priority ?? priority} onChange={(event) => changePriority(event.target.value as "Normal" | "High" | "Urgent")} disabled={incident.closed} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-950 disabled:bg-slate-100"><option>Normal</option><option>High</option><option>Urgent</option></select></label>
                <div className="grid gap-1"><p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Workflow status</p><p className={`flex min-h-11 items-center px-3 text-sm font-bold ${incident.closed ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{workflowStatus}</p></div>
              </div>

              {/* Work area */}
              <div className="p-4 sm:p-5">
                <div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-black text-slate-700">Response type
                      <select value={responseType} onChange={(event) => setResponseType(event.target.value)} disabled={!canWork} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-normal disabled:bg-slate-100">
                        <option value="">Select response type</option>
                        <option value="Site inspection">Site inspection</option>
                        <option value="Work method review">Work method review</option>
                        <option value="Containment adjustment">Containment adjustment</option>
                        <option value="Stakeholder notification">Stakeholder notification</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-black text-slate-700">
                      Observed conditions
                      <select value={observedConditions} onChange={(event) => setObservedConditions(event.target.value)} disabled={!canWork} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-normal disabled:bg-slate-100">
                        <option value="">Select observed condition</option>
                        {OBSERVED_CONDITIONS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      {observedConditions === OTHER_OPTION && <textarea value={observedOther} onChange={(event) => setObservedOther(event.target.value)} disabled={!canWork} rows={2} className="mt-1 border border-slate-300 p-2 text-sm font-normal disabled:bg-slate-100" placeholder="Describe what was observed" />}
                    </label>
                    <label className="grid gap-1 text-xs font-black text-slate-700 sm:col-span-2">
                      Action taken
                      <select value={actionTaken} onChange={(event) => setActionTaken(event.target.value)} disabled={!canWork} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-normal disabled:bg-slate-100">
                        <option value="">Select action taken</option>
                        {ACTION_TAKEN_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      {actionTaken === OTHER_OPTION && <textarea value={actionOther} onChange={(event) => setActionOther(event.target.value)} disabled={!canWork} rows={2} className="mt-1 border border-slate-300 p-2 text-sm font-normal disabled:bg-slate-100" placeholder="Describe the action taken" />}
                    </label>
                  </div>
                  <button type="button" onClick={saveWorkLog} disabled={!canWork || !responseType.trim() || !observedConditions.trim() || !actionTaken.trim() || (observedConditions === OTHER_OPTION && !observedOther.trim()) || (actionTaken === OTHER_OPTION && !actionOther.trim())} className="mt-3 min-h-10 border border-blue-700 px-4 text-xs font-black text-blue-800 disabled:border-slate-300 disabled:text-slate-400">Save work log</button>
                  {workLogStatus ? (
                    <p role="status" className={`mt-3 text-xs font-bold ${workLogStatus.tone === "success" ? "text-emerald-700" : "text-red-700"}`}>
                      {workLogStatus.message}
                    </p>
                  ) : null}

                  {/* Evidence â€” auto-attaches demo asset, no file browser */}
                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-500">Evidence</p>
                    {!evidenceAttached
                      ? <button type="button" onClick={attachDemoEvidence} disabled={!canWork} className="mt-2 inline-flex min-h-10 items-center gap-2 border border-slate-300 px-4 text-xs font-black text-slate-700 disabled:text-slate-400"><PaperClipIcon className="size-4" aria-hidden="true" />Attach site photo</button>
                      : <div className="mt-2 border border-slate-200 p-3"><p className="flex items-center gap-2 text-xs font-bold text-slate-700"><PaperClipIcon className="size-4" aria-hidden="true" />{DEMO_EVIDENCE_ASSET.name}</p><Image src={DEMO_EVIDENCE_ASSET.url} alt="Site investigation evidence" width={640} height={360} className="mt-2 max-h-40 w-full object-cover" /></div>}
                  </div>

                  {/* Escalate */}
                  <div className="mt-4">
                    <button type="button" disabled={!isInvestigating || incident.isEscalated} onClick={() => session.dispatchIncidentEvent({ type: "ESCALATED", escalatedBy: assignee, reason: "Project review requested", target: "Project Manager" })} className="inline-flex min-h-10 items-center gap-2 border border-red-300 px-4 text-xs font-black text-red-800 disabled:border-slate-300 disabled:text-slate-400"><ExclamationTriangleIcon className="size-4" aria-hidden="true" />Escalate</button>
                  </div>

                  {/* Advance phase â€” only visible while investigating, hides once in Close phase */}
                  {isInvestigating && !canClose && (
                    <div className="mt-5 border-t border-slate-200 pt-5">
                      <button type="button" onClick={advancePhase} className="min-h-10 bg-slate-700 px-4 text-xs font-black text-white transition hover:bg-slate-800">
                        {incident.phase === "Investigate" ? "MOVE TO VERIFICATION" : "COMPLETE VERIFICATION"}
                      </button>
                    </div>
                  )}

                  {/* Close panel â€” appears at the bottom once ready to close */}
                  {canClose && (
                    <div className="mt-5 grid gap-3 border border-emerald-300 bg-emerald-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-800">Ready to close</p>
                      <label className="grid gap-1 text-xs font-black text-slate-700">
                        Close reason
                        <select value={closeReason} onChange={(event) => setCloseReason(event.target.value)} className="min-h-11 border border-slate-300 bg-white px-3 text-sm font-normal">
                          {CLOSE_REASON_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
                        </select>
                        {closeReason === OTHER_OPTION && <textarea value={closeOther} onChange={(event) => setCloseOther(event.target.value)} rows={2} className="mt-1 border border-slate-300 p-2 text-sm font-normal" placeholder="Describe the reason for closing" />}
                      </label>
                      <button type="button" onClick={closeEvent} className="min-h-11 bg-emerald-700 px-5 text-xs font-black text-white transition hover:bg-emerald-800">RESOLVE &amp; CLOSE EVENT</button>
                    </div>
                  )}
                </div>
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Operational work log</p>
                      <p className="mt-1 text-sm font-bold text-slate-700">Saved ticket activity retained in sequence for reporting.</p>
                    </div>
                    <span className="border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">
                      {incident.responses.length} saved entr{incident.responses.length === 1 ? "y" : "ies"}
                    </span>
                  </div>
                  {incident.responses.length > 0 ? (
                    <ol className="mt-4 space-y-3">
                      {[...incident.responses].slice().reverse().map((response) => (
                        <li key={`${response.timestampMs}-${response.responseType}`} className="border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-black uppercase tracking-[0.08em] text-blue-700">{response.responseType}</p>
                            <p className="text-[11px] font-bold text-slate-500">Saved by {response.performedBy}</p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{response.details}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="mt-4 border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                      Saved work entries will appear here after you log the response steps for this ticket.
                    </div>
                  )}
                </div>
              </div>

              {/* Activity summary footer */}
              <div className="grid gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-3 sm:p-5"><div><p className="text-[10px] font-black uppercase text-slate-500">Work logs</p><p className="mt-1 text-lg font-black">{incident.responses.length}</p></div><div><p className="text-[10px] font-black uppercase text-slate-500">Evidence</p><p className="mt-1 text-lg font-black">{incident.evidence.length}</p></div><div><p className="text-[10px] font-black uppercase text-slate-500">Status</p><p className={`mt-1 text-lg font-black ${incident.closed ? "text-emerald-700" : "text-amber-700"}`}>{workflowStatus}</p></div></div>
            </div>
          </div>
        )}
      </div>
      <p className="border-t border-slate-200 bg-white px-4 py-3 text-[10px] leading-4 text-slate-500 sm:px-5">Fictional demonstration event and users. Workflow entries are retained in the deterministic incident record.</p>
    </section>
  );
}

/** Self-contained wrapper used by the standalone workflow demonstration page. */
export function ControlCentreEventsWorkspace() {
  const [session] = useState(() => new DemonstrationSession());
  const snapshot = useSyncExternalStore(
    session.subscribe.bind(session),
    session.getSnapshot.bind(session),
    session.getSnapshot.bind(session)
  );
  return <ControlCentreEvents session={session} snapshot={snapshot} onWorkStarted={() => {}} />;
}
