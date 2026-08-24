import { publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";

function formatOffset(offsetMs: number): string {
  const totalMinutes = Math.floor(offsetMs / 60_000);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor((offsetMs % 60_000) / 1_000);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function actorFor(type: string): "SYSTEM" | "USER" {
  return type === "SCENARIO_STARTED" || type === "INCIDENT_OPENED" ? "SYSTEM" : "USER";
}

/**
 * Presentation projection of the validated scenario timeline. It deliberately
 * contains no independent event facts; changes must originate in the scenario.
 */
export const OPERATIONAL_TIMELINE = publicDemonstrationScenario.timelineEvents.map(
  (event) => [
    actorFor(event.type),
    formatOffset(event.offsetMs),
    event.title,
    event.description ?? "Recorded in the fictional demonstration timeline.",
  ] as const,
);

export type OperationalTimelineEntry = (typeof OPERATIONAL_TIMELINE)[number];
