import type { Observation, ScenarioDefinition } from "@/lib/replay/domain";
import { validateScenario } from "@/lib/replay/validation";
import { PARTICULATE_METRICS } from "@/lib/metrics";

const START_TIMESTAMP = "2026-08-13T02:00:00.000Z";

export const DEMONSTRATION_METRICS = [
  PARTICULATE_METRICS[1],
  PARTICULATE_METRICS[2],
  PARTICULATE_METRICS[0],
  PARTICULATE_METRICS[3],
] as const;

export const DEMONSTRATION_DEVICE_HEALTH = {
  gateway: {
    name: "Site Gateway 01",
    serialNumber: "VFA-GW-DEMO-01",
    status: "ONLINE",
    connection: "Independent cellular",
    firmware: "Demo 1.8.4",
  },
  sensors: [
    { monitorId: "WORK_ZONE_A", serialNumber: "VFA-PM-DEMO-101", batteryPercent: 94, nextCalibration: "15 Sep 2026" },
    { monitorId: "OCCUPIED_INTERFACE", serialNumber: "VFA-PM-DEMO-102", batteryPercent: 88, nextCalibration: "18 Sep 2026" },
    { monitorId: "SHARED_CORRIDOR", serialNumber: "VFA-PM-DEMO-103", batteryPercent: 91, nextCalibration: "21 Sep 2026" },
    { monitorId: "EXTERNAL_BOUNDARY", serialNumber: "VFA-PM-DEMO-104", batteryPercent: 86, nextCalibration: "24 Sep 2026" },
  ],
} as const;

const monitors = [
  { id: "WORK_ZONE_A", name: "Zone A · Monitoring Location 1" },
  { id: "OCCUPIED_INTERFACE", name: "Zone A · Monitoring Location 2" },
  { id: "SHARED_CORRIDOR", name: "Zone A · Monitoring Location 3" },
  { id: "EXTERNAL_BOUNDARY", name: "Zone A · Monitoring Location 4" },
] as const;

const rows = [
  [0, "WORK_ZONE_A", 8, 12, 10, 18],
  [0, "OCCUPIED_INTERFACE", 4, 7, 6, 12],
  [0, "SHARED_CORRIDOR", 3, 5, 4, 9],
  [0, "EXTERNAL_BOUNDARY", 6, 9, 8, 15],
  [60_000, "WORK_ZONE_A", 12, 18, 16, 28],
  [60_000, "OCCUPIED_INTERFACE", 4, 7, 6, 12],
  [60_000, "SHARED_CORRIDOR", 3, 5, 4, 9],
  [60_000, "EXTERNAL_BOUNDARY", 6, 9, 8, 15],
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
  [480_000, "WORK_ZONE_A", 7, 14, 14, 27],
  [480_000, "OCCUPIED_INTERFACE", 5, 8, 7, 13],
  [480_000, "SHARED_CORRIDOR", 3, 6, 5, 10],
  [480_000, "EXTERNAL_BOUNDARY", 6, 10, 8, 16],
] as const;
type DemonstrationRow = (typeof rows)[number];

const stableTrendShape = [-0.08, 0.04, -0.03, 0.09, -0.05, 0.06, 0] as const;
const risingTrendShape = [-0.34, -0.27, -0.22, -0.16, -0.11, -0.05, 0] as const;
const fallingTrendShape = [0.34, 0.27, 0.21, 0.15, 0.1, 0.04, 0] as const;
const microVariationShape = [-0.06, 0.04, -0.05, 0.03, -0.03, 0.05, 0] as const;

function metricValueFromRow(row: DemonstrationRow, metricId: string) {
  if (metricId === "PM1") return row[2];
  if (metricId === "PM2_5") return row[3];
  if (metricId === "RESPIRABLE_DUST") return row[4];
  return row[5];
}

export function getDemonstrationRespirableDustTrend(monitorId: string, offsetMs: number): number[] {
  const latestRow = [...rows]
    .reverse()
    .find(([rowOffset, rowMonitorId]) => rowOffset <= offsetMs && rowMonitorId === monitorId);
  const latest = latestRow?.[4] ?? 0;
  const workZoneShape = offsetMs >= 360_000
    ? fallingTrendShape
    : offsetMs >= 60_000
      ? risingTrendShape
      : stableTrendShape;
  const shape = monitorId === "WORK_ZONE_A" ? workZoneShape : stableTrendShape;
  return shape.map((relativeChange, index) => index === shape.length - 1
    ? latest
    : Math.max(0, Math.round(latest * (1 + relativeChange) * 10) / 10));
}

export function getDemonstrationMetricTrendSeries(monitorId: string, metricId: string, offsetMs: number, pointCount = 7): number[] {
  const readings = rows
    .filter(([rowOffset, rowMonitorId]) => rowMonitorId === monitorId && rowOffset <= offsetMs)
    .map((row) => metricValueFromRow(row, metricId));
  const latest = readings.at(-1) ?? 0;
  const previous = readings.length > 1 ? readings[readings.length - 2] : latest;
  if (latest === 0 && previous === 0) return Array.from({ length: pointCount }, () => 0);

  const seriesLength = Math.max(pointCount, 2);
  const drift = latest - previous;
  const start = Math.max(0, latest - drift * (seriesLength - 1));
  const varianceFloor = metricId === "RESPIRABLE_DUST" ? 1.2 : 0.5;
  const variance = Math.max(Math.abs(latest) * 0.08, varianceFloor);

  return Array.from({ length: seriesLength }, (_, index) => {
    if (index === seriesLength - 1) return latest;
    const progress = index / (seriesLength - 1);
    const baseline = start + (latest - start) * progress;
    const wobble = variance * microVariationShape[index % microVariationShape.length];
    return Math.max(0, Math.round((baseline + wobble) * 10) / 10);
  });
}

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
  version: "2026-08-23.1",
  startTimestamp: START_TIMESTAMP,
  durationMs: 480_000,
  interpolationPolicy: "hold-last-known-value",
  metadata: {
    dataLabel: "SIMULATED_DEMONSTRATION_DATA",
    provenance:
      "Frozen fictional dataset approved by Niall on 13 August 2026 for the public VerifAir product demonstration. Respirable Dust is separately simulated and is not calculated from PM1, PM2.5 or PM10. Values are not device measurements.",
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
        "A review was started for Zone A, Monitoring Location 1, and the nominated demonstration contact received the notification.",
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
