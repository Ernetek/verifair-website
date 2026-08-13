import type { Observation, ScenarioDefinition } from "@/lib/replay/domain";
import { validateScenario } from "@/lib/replay/validation";

const START_TIMESTAMP = "2026-08-13T02:00:00.000Z";

export const DEMONSTRATION_METRICS = [
  { id: "PM1", label: "PM1" },
  { id: "PM2_5", label: "PM2.5" },
  { id: "RESPIRABLE_DUST", label: "Respirable dust" },
  { id: "PM10", label: "PM10" },
] as const;

const monitors = [
  { id: "WORK_ZONE_A", name: "Work Zone A" },
  { id: "OCCUPIED_INTERFACE", name: "Occupied Interface" },
  { id: "SHARED_CORRIDOR", name: "Shared Corridor" },
  { id: "EXTERNAL_BOUNDARY", name: "External Boundary" },
] as const;

const rows = [
  [0, "WORK_ZONE_A", 8, 12, 10, 18],
  [0, "OCCUPIED_INTERFACE", 4, 7, 6, 12],
  [0, "SHARED_CORRIDOR", 3, 5, 4, 9],
  [0, "EXTERNAL_BOUNDARY", 6, 9, 8, 15],
  [120_000, "WORK_ZONE_A", 16, 26, 21, 38],
  [120_000, "OCCUPIED_INTERFACE", 5, 8, 7, 14],
  [120_000, "SHARED_CORRIDOR", 4, 6, 5, 11],
  [120_000, "EXTERNAL_BOUNDARY", 7, 11, 9, 18],
  [240_000, "WORK_ZONE_A", 22, 38, 31, 56],
  [240_000, "OCCUPIED_INTERFACE", 7, 11, 9, 18],
  [240_000, "SHARED_CORRIDOR", 5, 8, 7, 14],
  [240_000, "EXTERNAL_BOUNDARY", 8, 13, 11, 21],
  [360_000, "WORK_ZONE_A", 18, 29, 24, 45],
  [360_000, "OCCUPIED_INTERFACE", 6, 10, 8, 16],
  [360_000, "SHARED_CORRIDOR", 4, 7, 6, 12],
  [360_000, "EXTERNAL_BOUNDARY", 7, 12, 10, 19],
  [480_000, "WORK_ZONE_A", 11, 17, 14, 27],
  [480_000, "OCCUPIED_INTERFACE", 5, 8, 7, 13],
  [480_000, "SHARED_CORRIDOR", 3, 6, 5, 10],
  [480_000, "EXTERNAL_BOUNDARY", 6, 10, 8, 16],
] as const;

function timestampAt(offsetMs: number): string {
  return new Date(Date.parse(START_TIMESTAMP) + offsetMs).toISOString();
}

const observations: Observation[] = rows.flatMap(
  ([offsetMs, monitorId, pm1, pm25, respirableDust, pm10]) =>
    [pm1, pm25, respirableDust, pm10].map((value, metricIndex) => {
      const metricId = DEMONSTRATION_METRICS[metricIndex].id;
      return {
        id: `OBS_${monitorId}_${metricId}_${offsetMs}`,
        monitorId,
        offsetMs,
        timestamp: timestampAt(offsetMs),
        metricId,
        unit: "µg/m³",
        reading: { status: "available", value, quality: "good" },
      };
    }),
);

const definition: ScenarioDefinition = {
  id: "VERIFAIR_PUBLIC_CONSTRUCTION_DEMO",
  version: "2026-08-13.1",
  startTimestamp: START_TIMESTAMP,
  durationMs: 480_000,
  interpolationPolicy: "hold-last-known-value",
  metadata: {
    dataLabel: "SIMULATED_DEMONSTRATION_DATA",
    provenance:
      "Frozen fictional dataset approved by Niall on 13 August 2026 for the public VerifAir product demonstration. Metric fields reflect the verified Dustlight BLE payload; values are not device measurements.",
    reviewStatus: "APPROVED_PUBLIC_DEMONSTRATION",
    displayTimezone: "Australia/Sydney",
  },
  monitors,
  observations,
  incidents: [
    {
      id: "INCIDENT_WORK_ZONE_REVIEW",
      monitorId: "WORK_ZONE_A",
      openedOffsetMs: 120_000,
      openedTimestamp: timestampAt(120_000),
      title: "Configured alert triggered and site contact notified",
      description:
        "A review was started for Work Zone A and the nominated demonstration contact received the notification.",
      severity: "review",
      category: "environmental-observation",
    },
  ],
  actions: [
    {
      id: "ACTION_WORK_REVIEWED",
      incidentId: "INCIDENT_WORK_ZONE_REVIEW",
      offsetMs: 240_000,
      timestamp: timestampAt(240_000),
      title: "Work reviewed and local controls checked",
    },
  ],
  evidence: [
    {
      id: "EVIDENCE_FOLLOW_UP",
      incidentId: "INCIDENT_WORK_ZONE_REVIEW",
      offsetMs: 360_000,
      timestamp: timestampAt(360_000),
      title: "Follow-up readings and response note retained",
    },
  ],
  resolutions: [
    {
      id: "RESOLUTION_REVIEW_COMPLETE",
      incidentId: "INCIDENT_WORK_ZONE_REVIEW",
      offsetMs: 480_000,
      timestamp: timestampAt(480_000),
      summary: "Demonstration incident closed after review",
      description:
        "The sequence does not claim that the recorded action caused the later readings.",
    },
  ],
  timelineEvents: [
    {
      id: "EVENT_SCENARIO_STARTED",
      offsetMs: 0,
      timestamp: timestampAt(0),
      type: "SCENARIO_STARTED",
      title: "Simulated monitoring period started",
      orderSemantics: "ORDER_SENSITIVE",
      relatedEntityRefs: [{ entityType: "monitor", id: "WORK_ZONE_A" }],
    },
    {
      id: "EVENT_INCIDENT_OPENED",
      offsetMs: 120_000,
      timestamp: timestampAt(120_000),
      type: "INCIDENT_OPENED",
      title: "Configured alert triggered; site contact notified",
      description:
        "The notification is part of this simulated workflow and does not represent a live message delivery.",
      orderSemantics: "ORDER_SENSITIVE",
      relatedEntityRefs: [
        { entityType: "incident", id: "INCIDENT_WORK_ZONE_REVIEW" },
      ],
    },
    {
      id: "EVENT_ACTION_RECORDED",
      offsetMs: 240_000,
      timestamp: timestampAt(240_000),
      type: "ACTION_RECORDED",
      title: "Work reviewed and local controls checked",
      orderSemantics: "ORDER_SENSITIVE",
      relatedEntityRefs: [{ entityType: "action", id: "ACTION_WORK_REVIEWED" }],
    },
    {
      id: "EVENT_EVIDENCE_RETAINED",
      offsetMs: 360_000,
      timestamp: timestampAt(360_000),
      type: "EVIDENCE_RETAINED",
      title: "Follow-up readings and response note retained",
      orderSemantics: "ORDER_SENSITIVE",
      relatedEntityRefs: [{ entityType: "evidence", id: "EVIDENCE_FOLLOW_UP" }],
    },
    {
      id: "EVENT_INCIDENT_RESOLVED",
      offsetMs: 480_000,
      timestamp: timestampAt(480_000),
      type: "INCIDENT_RESOLVED",
      title: "Demonstration incident closed after review",
      description: "No causal effect is claimed.",
      orderSemantics: "ORDER_SENSITIVE",
      relatedEntityRefs: [
        { entityType: "resolution", id: "RESOLUTION_REVIEW_COMPLETE" },
      ],
    },
  ],
};

const validation = validateScenario(definition);
if (!validation.ok) {
  throw new Error("The approved public demonstration scenario failed validation.");
}

export const publicDemonstrationScenario = validation.value;
