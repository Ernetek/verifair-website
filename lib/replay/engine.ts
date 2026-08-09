import type {
  IncidentTimelineEvent,
  Observation,
  ReplayEvaluationResult,
  ReplayIncidentState,
  ReplayMonitorState
} from "@/lib/replay/domain";
import type { ValidatedScenario } from "@/lib/replay/validation";

type TimedEntity = { readonly id: string; readonly offsetMs: number };

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareTimed(left: TimedEntity, right: TimedEntity): number {
  return left.offsetMs - right.offsetMs || compareIds(left.id, right.id);
}

function compareEvents(left: IncidentTimelineEvent, right: IncidentTimelineEvent): number {
  return compareTimed(left, right);
}

export function evaluateAt(scenario: ValidatedScenario, requestedOffsetMs: number): ReplayEvaluationResult {
  if (!Number.isSafeInteger(requestedOffsetMs)) {
    return {
      ok: false,
      error: { code: "INVALID_REQUESTED_OFFSET", requestedOffsetMs }
    };
  }

  const offsetMs = Math.min(scenario.durationMs, Math.max(0, requestedOffsetMs));
  const activeObservations = scenario.observations.filter((observation) => observation.offsetMs <= offsetMs).sort(compareTimed);

  const observationsByMonitor = new Map<string, Map<string, Observation>>();
  for (const observation of activeObservations) {
    const byMetric = observationsByMonitor.get(observation.monitorId) ?? new Map();
    byMetric.set(observation.metricId, observation);
    observationsByMonitor.set(observation.monitorId, byMetric);
  }

  const monitorStates: ReplayMonitorState[] = [...scenario.monitors]
    .sort((left, right) => compareIds(left.id, right.id))
    .map((monitor) => {
      const latestObservations = [...(observationsByMonitor.get(monitor.id)?.values() ?? [])].sort(
        (left, right) => compareIds(left.metricId, right.metricId) || compareTimed(left, right)
      );
      return {
        monitor,
        status: latestObservations.length === 0 ? "no-observation" : "observed",
        latestObservations
      };
    });

  const activeResolutions = scenario.resolutions.filter((resolution) => resolution.offsetMs <= offsetMs).sort(compareTimed);
  const resolutionByIncident = new Map(activeResolutions.map((resolution) => [resolution.incidentId, resolution]));

  const incidents: ReplayIncidentState[] = scenario.incidents
    .filter((incident) => incident.openedOffsetMs <= offsetMs)
    .sort((left, right) => left.openedOffsetMs - right.openedOffsetMs || compareIds(left.id, right.id))
    .map((incident) => {
      const resolution = resolutionByIncident.get(incident.id);
      return resolution === undefined ? { incident, status: "open" } : { incident, status: "resolved", resolution };
    });

  return {
    ok: true,
    state: {
      scenarioId: scenario.id,
      scenarioVersion: scenario.version,
      requestedOffsetMs,
      offsetMs,
      timestamp: new Date(Date.parse(scenario.startTimestamp) + offsetMs).toISOString(),
      isTerminal: offsetMs === scenario.durationMs,
      monitorStates,
      incidents,
      actions: scenario.actions.filter((action) => action.offsetMs <= offsetMs).sort(compareTimed),
      resolutions: activeResolutions,
      evidence: scenario.evidence.filter((item) => item.offsetMs <= offsetMs).sort(compareTimed),
      timelineEvents: scenario.timelineEvents.filter((event) => event.offsetMs <= offsetMs).sort(compareEvents)
    }
  };
}
