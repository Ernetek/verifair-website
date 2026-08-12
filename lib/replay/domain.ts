export type EntityId = string;

export type DatasetReviewStatus =
  | "MECHANICS_ONLY_TEST_FIXTURE"
  | "DATASET_REVIEW_REQUIRED"
  | "APPROVED_PUBLIC_DEMONSTRATION";

export interface ScenarioMetadata {
  readonly dataLabel: "SIMULATED_DEMONSTRATION_DATA";
  readonly provenance: string;
  readonly reviewStatus: DatasetReviewStatus;
  readonly displayTimezone?: string;
}

export interface Monitor {
  readonly id: EntityId;
  readonly name: string;
}

export type ObservationReading =
  | {
      readonly status: "available";
      readonly value: number;
      readonly quality: "good" | "degraded";
    }
  | {
      readonly status: "unavailable";
      readonly value: null;
      readonly reason?: string;
    };

export interface Observation {
  readonly id: EntityId;
  readonly monitorId: EntityId;
  readonly offsetMs: number;
  readonly timestamp: string;
  readonly metricId: string;
  readonly unit: string;
  readonly reading: ObservationReading;
}

export interface Incident {
  readonly id: EntityId;
  readonly monitorId?: EntityId;
  readonly openedOffsetMs: number;
  readonly openedTimestamp: string;
  readonly title: string;
  readonly description?: string;
  readonly severity?: string;
  readonly category?: string;
}

export interface Action {
  readonly id: EntityId;
  readonly incidentId: EntityId;
  readonly offsetMs: number;
  readonly timestamp: string;
  readonly title: string;
  readonly description?: string;
}

export interface Resolution {
  readonly id: EntityId;
  readonly incidentId: EntityId;
  readonly offsetMs: number;
  readonly timestamp: string;
  readonly summary: string;
  readonly description?: string;
}

export interface Evidence {
  readonly id: EntityId;
  readonly incidentId?: EntityId;
  readonly offsetMs: number;
  readonly timestamp: string;
  readonly title: string;
  readonly description?: string;
}

export type CanonicalEntityRef =
  | { readonly entityType: "monitor"; readonly id: EntityId }
  | { readonly entityType: "observation"; readonly id: EntityId }
  | { readonly entityType: "incident"; readonly id: EntityId }
  | { readonly entityType: "action"; readonly id: EntityId }
  | { readonly entityType: "resolution"; readonly id: EntityId }
  | { readonly entityType: "evidence"; readonly id: EntityId };

export type TimelineOrderSemantics = "ORDER_SENSITIVE" | "ORDER_INDEPENDENT";

export interface IncidentTimelineEvent {
  readonly id: EntityId;
  readonly offsetMs: number;
  readonly timestamp?: string;
  readonly type: string;
  readonly title: string;
  readonly description?: string;
  readonly severity?: string;
  readonly category?: string;
  /** Whether relative ordering against another event at the same offset can alter scenario meaning. */
  readonly orderSemantics: TimelineOrderSemantics;
  readonly relatedEntityRefs: readonly CanonicalEntityRef[];
}

export interface ScenarioDefinition {
  readonly id: EntityId;
  readonly version: string;
  readonly startTimestamp: string;
  readonly durationMs: number;
  readonly interpolationPolicy: "hold-last-known-value";
  readonly metadata: ScenarioMetadata;
  readonly monitors: readonly Monitor[];
  readonly observations: readonly Observation[];
  readonly incidents: readonly Incident[];
  readonly actions: readonly Action[];
  readonly resolutions: readonly Resolution[];
  readonly evidence: readonly Evidence[];
  readonly timelineEvents: readonly IncidentTimelineEvent[];
}

export interface ReplayMonitorState {
  readonly monitor: Monitor;
  readonly status: "no-observation" | "observed";
  readonly latestObservations: readonly Observation[];
}

export interface ReplayIncidentState {
  readonly incident: Incident;
  readonly status: "open" | "resolved";
  readonly resolution?: Resolution;
}

export interface ReplayState {
  readonly scenarioId: EntityId;
  readonly scenarioVersion: string;
  readonly requestedOffsetMs: number;
  readonly offsetMs: number;
  readonly timestamp: string;
  readonly isTerminal: boolean;
  readonly monitorStates: readonly ReplayMonitorState[];
  readonly incidents: readonly ReplayIncidentState[];
  readonly actions: readonly Action[];
  readonly resolutions: readonly Resolution[];
  readonly evidence: readonly Evidence[];
  readonly timelineEvents: readonly IncidentTimelineEvent[];
}

export type ReplayEvaluationResult =
  | { readonly ok: true; readonly state: ReplayState }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: "INVALID_REQUESTED_OFFSET";
        readonly requestedOffsetMs: number;
      };
    };
