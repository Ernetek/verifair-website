import type { Observation, ReplayState } from "@/lib/replay/domain";
import type { ValidatedScenario } from "@/lib/replay/validation";

export function selectMonitorState(state: ReplayState, monitorId: string) {
  return state.monitorStates.find(({ monitor }) => monitor.id === monitorId);
}

export function selectLatestObservation(
  state: ReplayState,
  monitorId: string,
  metricId: string,
): Observation | undefined {
  return selectMonitorState(state, monitorId)?.latestObservations.find(
    (observation) => observation.metricId === metricId,
  );
}

export function selectObservationHistory(
  scenario: ValidatedScenario,
  state: ReplayState,
  monitorId: string,
  metricId: string,
): readonly Observation[] {
  return scenario.observations.filter(
    (observation) =>
      observation.monitorId === monitorId &&
      observation.metricId === metricId &&
      observation.offsetMs <= state.offsetMs,
  );
}
