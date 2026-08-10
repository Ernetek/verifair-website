import type { ScenarioDefinition } from "@/lib/replay/domain";

const START_TIMESTAMP = "2040-01-01T00:00:00.000Z";

function timestampAt(offsetMs: number): string {
  return new Date(Date.parse(START_TIMESTAMP) + offsetMs).toISOString();
}

export function createMechanicsOnlyScenario(): ScenarioDefinition {
  return {
    id: "TEST_SCENARIO_A",
    version: "TEST_VERSION_1",
    startTimestamp: START_TIMESTAMP,
    durationMs: 4_000,
    interpolationPolicy: "hold-last-known-value",
    metadata: {
      dataLabel: "SIMULATED_DEMONSTRATION_DATA",
      provenance: "Mechanics-only automated test fixture; not product demonstration data.",
      reviewStatus: "MECHANICS_ONLY_TEST_FIXTURE",
      displayTimezone: "Australia/Sydney"
    },
    monitors: [
      { id: "TEST_MONITOR_A", name: "Artificial monitor A" },
      { id: "TEST_MONITOR_WITHOUT_DATA", name: "Artificial monitor without data" }
    ],
    observations: [
      {
        id: "TEST_OBSERVATION_START",
        monitorId: "TEST_MONITOR_A",
        offsetMs: 0,
        timestamp: timestampAt(0),
        metricId: "TEST_SIGNAL_A",
        unit: "synthetic-unit",
        reading: { status: "available", value: 10, quality: "good" }
      },
      {
        id: "TEST_OBSERVATION_SIGNAL_B_START",
        monitorId: "TEST_MONITOR_A",
        offsetMs: 500,
        timestamp: timestampAt(500),
        metricId: "TEST_SIGNAL_B",
        unit: "synthetic-unit",
        reading: { status: "available", value: 100, quality: "good" }
      },
      {
        id: "TEST_OBSERVATION_DEGRADED",
        monitorId: "TEST_MONITOR_A",
        offsetMs: 1_000,
        timestamp: timestampAt(1_000),
        metricId: "TEST_SIGNAL_A",
        unit: "synthetic-unit",
        reading: { status: "available", value: 20, quality: "degraded" }
      },
      {
        id: "TEST_OBSERVATION_SIGNAL_B_DEGRADED",
        monitorId: "TEST_MONITOR_A",
        offsetMs: 1_500,
        timestamp: timestampAt(1_500),
        metricId: "TEST_SIGNAL_B",
        unit: "synthetic-unit",
        reading: { status: "available", value: 110, quality: "degraded" }
      },
      {
        id: "TEST_OBSERVATION_UNAVAILABLE",
        monitorId: "TEST_MONITOR_A",
        offsetMs: 2_000,
        timestamp: timestampAt(2_000),
        metricId: "TEST_SIGNAL_A",
        unit: "synthetic-unit",
        reading: {
          status: "unavailable",
          value: null,
          reason: "Artificial test state"
        }
      },
      {
        id: "TEST_OBSERVATION_SIGNAL_B_UNAVAILABLE",
        monitorId: "TEST_MONITOR_A",
        offsetMs: 2_500,
        timestamp: timestampAt(2_500),
        metricId: "TEST_SIGNAL_B",
        unit: "synthetic-unit",
        reading: {
          status: "unavailable",
          value: null,
          reason: "Artificial second-signal test state"
        }
      },
      {
        id: "TEST_OBSERVATION_TERMINAL",
        monitorId: "TEST_MONITOR_A",
        offsetMs: 4_000,
        timestamp: timestampAt(4_000),
        metricId: "TEST_SIGNAL_A",
        unit: "synthetic-unit",
        reading: { status: "available", value: 30, quality: "good" }
      }
    ],
    incidents: [
      {
        id: "TEST_INCIDENT_A",
        monitorId: "TEST_MONITOR_A",
        openedOffsetMs: 1_000,
        openedTimestamp: timestampAt(1_000),
        title: "Artificial incident opened",
        category: "TEST_CATEGORY"
      }
    ],
    actions: [
      {
        id: "TEST_ACTION_A",
        incidentId: "TEST_INCIDENT_A",
        offsetMs: 2_000,
        timestamp: timestampAt(2_000),
        title: "Artificial action recorded"
      }
    ],
    resolutions: [
      {
        id: "TEST_RESOLUTION_A",
        incidentId: "TEST_INCIDENT_A",
        offsetMs: 3_000,
        timestamp: timestampAt(3_000),
        summary: "Artificial incident resolved"
      }
    ],
    evidence: [
      {
        id: "TEST_EVIDENCE_A",
        incidentId: "TEST_INCIDENT_A",
        offsetMs: 2_500,
        timestamp: timestampAt(2_500),
        title: "Artificial evidence record"
      }
    ],
    timelineEvents: [
      {
        id: "TEST_EVENT_START",
        offsetMs: 0,
        timestamp: timestampAt(0),
        type: "TEST_SCENARIO_STARTED",
        title: "Artificial scenario start",
        orderSemantics: "ORDER_SENSITIVE",
        relatedEntityRefs: [{ entityType: "monitor", id: "TEST_MONITOR_A" }]
      },
      {
        id: "TEST_EVENT_INCIDENT",
        offsetMs: 1_000,
        timestamp: timestampAt(1_000),
        type: "TEST_INCIDENT_OPENED",
        title: "Artificial incident event",
        orderSemantics: "ORDER_SENSITIVE",
        relatedEntityRefs: [
          { entityType: "incident", id: "TEST_INCIDENT_A" },
          { entityType: "observation", id: "TEST_OBSERVATION_DEGRADED" }
        ]
      },
      {
        id: "TEST_EVENT_ACTION_B",
        offsetMs: 2_000,
        timestamp: timestampAt(2_000),
        type: "TEST_INDEPENDENT_RECORD",
        title: "Artificial independent record B",
        orderSemantics: "ORDER_INDEPENDENT",
        relatedEntityRefs: [{ entityType: "action", id: "TEST_ACTION_A" }]
      },
      {
        id: "TEST_EVENT_ACTION_A",
        offsetMs: 2_000,
        timestamp: timestampAt(2_000),
        type: "TEST_INDEPENDENT_RECORD",
        title: "Artificial independent record A",
        orderSemantics: "ORDER_INDEPENDENT",
        relatedEntityRefs: [{ entityType: "action", id: "TEST_ACTION_A" }]
      },
      {
        id: "TEST_EVENT_RESOLVED",
        offsetMs: 3_000,
        timestamp: timestampAt(3_000),
        type: "TEST_INCIDENT_RESOLVED",
        title: "Artificial resolution event",
        orderSemantics: "ORDER_SENSITIVE",
        relatedEntityRefs: [
          { entityType: "incident", id: "TEST_INCIDENT_A" },
          { entityType: "resolution", id: "TEST_RESOLUTION_A" }
        ]
      }
    ]
  };
}

export function cloneScenario(): ScenarioDefinition {
  return structuredClone(createMechanicsOnlyScenario());
}

export function deepFreeze<T>(value: T): T {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) {
    return value;
  }
  Object.freeze(value);
  Object.values(value).forEach((nested) => deepFreeze(nested));
  return value;
}
