import type { CanonicalEntityRef, ScenarioDefinition } from "@/lib/replay/domain";

declare const validatedScenarioBrand: unique symbol;

export type ValidatedScenario = ScenarioDefinition & {
  readonly [validatedScenarioBrand]: true;
};

export type ValidationPath = readonly (string | number)[];

export type ScenarioValidationErrorCode =
  | "UNREADABLE_INPUT"
  | "INVALID_TYPE"
  | "REQUIRED_FIELD"
  | "UNKNOWN_FIELD"
  | "INVALID_ID"
  | "DUPLICATE_ID"
  | "INVALID_VERSION"
  | "INVALID_UTC_TIMESTAMP"
  | "UNREPRESENTABLE_TIMESTAMP"
  | "TIMESTAMP_OFFSET_MISMATCH"
  | "INVALID_DURATION_MS"
  | "INVALID_OFFSET_MS"
  | "OFFSET_OUT_OF_BOUNDS"
  | "UNSUPPORTED_INTERPOLATION_POLICY"
  | "INVALID_SIMULATION_METADATA"
  | "INVALID_READING"
  | "DUPLICATE_OBSERVATION_POSITION"
  | "DANGLING_REFERENCE"
  | "WRONG_KIND_REFERENCE"
  | "INVALID_ENTITY_RELATIONSHIP"
  | "AMBIGUOUS_SAME_OFFSET";

export interface ScenarioValidationError {
  readonly code: ScenarioValidationErrorCode;
  readonly path: ValidationPath;
  readonly entityRef?: CanonicalEntityRef;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export type ScenarioValidationResult =
  | { readonly ok: true; readonly value: ValidatedScenario }
  | {
      readonly ok: false;
      readonly errors: readonly ScenarioValidationError[];
    };

type UnknownRecord = Record<string, unknown>;

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const ENTITY_TYPES = ["monitor", "observation", "incident", "action", "resolution", "evidence"] as const;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwn(record: UnknownRecord, key: string): boolean {
  return Object.hasOwn(record, key);
}

function canonicalTimestamp(milliseconds: number): string | undefined {
  if (!Number.isSafeInteger(milliseconds)) return undefined;
  const date = new Date(milliseconds);
  if (!Number.isFinite(date.getTime())) return undefined;
  return date.toISOString();
}

function isCanonicalUtcTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return canonicalTimestamp(Date.parse(value)) === value;
}

function timestampAt(startTimestamp: string, offsetMs: number): string | undefined {
  return canonicalTimestamp(Date.parse(startTimestamp) + offsetMs);
}

interface SnapshotFailureState {
  unreadablePath?: ValidationPath;
}

const SNAPSHOT_ABORT = Symbol("SNAPSHOT_ABORT");

function unreadable(path: ValidationPath, failure: SnapshotFailureState): never {
  failure.unreadablePath = path;
  throw SNAPSHOT_ABORT;
}

// Canonical input is JSON-compatible data: ordinary/null-prototype records and
// standard dense arrays containing enumerable data properties only.
function clonePlainData(value: unknown, path: ValidationPath, seen: WeakSet<object>, failure: SnapshotFailureState): unknown {
  if (typeof value !== "object" || value === null) return value;
  if (seen.has(value)) unreadable(path, failure);
  seen.add(value);

  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype) unreadable(path, failure);

    const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length");
    if (
      lengthDescriptor === undefined ||
      !("value" in lengthDescriptor) ||
      !Number.isSafeInteger(lengthDescriptor.value) ||
      lengthDescriptor.value < 0
    ) {
      unreadable(path, failure);
    }
    const length = lengthDescriptor.value as number;
    const keys = Reflect.ownKeys(value);
    const indexKeys: number[] = [];
    for (const key of keys) {
      if (typeof key !== "string") unreadable(path, failure);
      if (key === "length") continue;
      const index = Number(key);
      if (!Number.isInteger(index) || index < 0 || String(index) !== key || index >= length) {
        unreadable([...path, key], failure);
      }
      indexKeys.push(index);
    }

    if (indexKeys.length !== length) unreadable(path, failure);
    indexKeys.sort((left, right) => left - right);
    const clone: unknown[] = new Array(length);
    for (let index = 0; index < length; index += 1) {
      if (indexKeys[index] !== index) unreadable([...path, index], failure);
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
        unreadable([...path, index], failure);
      }
      clone[index] = clonePlainData(descriptor.value, [...path, index], seen, failure);
    }
    return Object.freeze(clone);
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) unreadable(path, failure);

  const keys = Reflect.ownKeys(value);
  if (keys.some((key) => typeof key !== "string")) unreadable(path, failure);
  const stringKeys = (keys as string[]).sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
  const clone: UnknownRecord = {};
  for (const key of stringKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      unreadable([...path, key], failure);
    }
    Object.defineProperty(clone, key, {
      value: clonePlainData(descriptor.value, [...path, key], seen, failure),
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  return Object.freeze(clone);
}

export function validateScenario(input: unknown): ScenarioValidationResult {
  const failure: SnapshotFailureState = {};
  try {
    const snapshot = clonePlainData(input, [], new WeakSet<object>(), failure);
    return validateScenarioSnapshot(snapshot);
  } catch {
    return {
      ok: false,
      errors: [
        {
          code: "UNREADABLE_INPUT",
          path: failure.unreadablePath ?? []
        }
      ]
    };
  }
}

function validateScenarioSnapshot(input: unknown): ScenarioValidationResult {
  const errors: ScenarioValidationError[] = [];

  const addError = (
    code: ScenarioValidationErrorCode,
    path: ValidationPath,
    options: Omit<ScenarioValidationError, "code" | "path"> = {}
  ) => errors.push({ code, path, ...options });

  const inspectObject = (
    value: unknown,
    path: ValidationPath,
    required: readonly string[],
    optional: readonly string[] = []
  ): UnknownRecord | undefined => {
    if (!isRecord(value)) {
      addError("INVALID_TYPE", path, { details: { expected: "object" } });
      return undefined;
    }

    const allowed = new Set([...required, ...optional]);
    for (const key of required) {
      if (!hasOwn(value, key)) addError("REQUIRED_FIELD", [...path, key]);
    }
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== "string") {
        addError("UNREADABLE_INPUT", path);
      } else if (!allowed.has(key)) {
        addError("UNKNOWN_FIELD", [...path, key]);
      }
    }
    return value;
  };

  const inspectArray = (value: unknown, path: ValidationPath): readonly unknown[] => {
    if (!Array.isArray(value)) {
      addError("INVALID_TYPE", path, { details: { expected: "array" } });
      return [];
    }
    return value;
  };

  const inspectRequiredString = (record: UnknownRecord, key: string, path: ValidationPath): string | undefined => {
    if (!hasOwn(record, key)) return undefined;
    const value = record[key];
    if (typeof value !== "string" || value.trim().length === 0) {
      addError("INVALID_TYPE", [...path, key], {
        details: { expected: "non-empty string" }
      });
      return undefined;
    }
    return value;
  };

  const inspectOptionalString = (record: UnknownRecord, key: string, path: ValidationPath): string | undefined => {
    if (!hasOwn(record, key)) return undefined;
    return inspectRequiredString(record, key, path);
  };

  const inspectId = (record: UnknownRecord, key: string, path: ValidationPath): string | undefined => {
    const id = inspectRequiredString(record, key, path);
    if (id !== undefined && !ID_PATTERN.test(id)) {
      addError("INVALID_ID", [...path, key]);
      return undefined;
    }
    return id;
  };

  const inspectTimestamp = (record: UnknownRecord, key: string, path: ValidationPath, optional = false): string | undefined => {
    if (optional && !hasOwn(record, key)) return undefined;
    if (!hasOwn(record, key)) return undefined;
    const value = record[key];
    if (!isCanonicalUtcTimestamp(value)) {
      addError("INVALID_UTC_TIMESTAMP", [...path, key]);
      return undefined;
    }
    return value;
  };

  const inspectOffset = (record: UnknownRecord, key: string, path: ValidationPath, durationMs: number | undefined): number | undefined => {
    if (!hasOwn(record, key)) return undefined;
    const value = record[key];
    if (typeof value !== "number" || !Number.isSafeInteger(value)) {
      addError("INVALID_OFFSET_MS", [...path, key]);
      return undefined;
    }
    if (durationMs !== undefined && (value < 0 || value > durationMs)) {
      addError("OFFSET_OUT_OF_BOUNDS", [...path, key], {
        details: { offsetMs: value, durationMs }
      });
    }
    return value;
  };

  const scenario = inspectObject(
    input,
    [],
    [
      "id",
      "version",
      "startTimestamp",
      "durationMs",
      "interpolationPolicy",
      "metadata",
      "monitors",
      "observations",
      "incidents",
      "actions",
      "resolutions",
      "evidence",
      "timelineEvents"
    ]
  );

  if (scenario === undefined) return { ok: false, errors };

  inspectId(scenario, "id", []);
  const version = inspectRequiredString(scenario, "version", []);
  if (version === undefined && hasOwn(scenario, "version")) {
    addError("INVALID_VERSION", ["version"]);
  }
  const startTimestamp = inspectTimestamp(scenario, "startTimestamp", []);

  let durationMs: number | undefined;
  if (hasOwn(scenario, "durationMs")) {
    const value = scenario.durationMs;
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
      addError("INVALID_DURATION_MS", ["durationMs"]);
    } else {
      durationMs = value;
      if (startTimestamp !== undefined && timestampAt(startTimestamp, durationMs) === undefined) {
        addError("UNREPRESENTABLE_TIMESTAMP", ["durationMs"]);
      }
    }
  }

  if (hasOwn(scenario, "interpolationPolicy") && scenario.interpolationPolicy !== "hold-last-known-value") {
    addError("UNSUPPORTED_INTERPOLATION_POLICY", ["interpolationPolicy"]);
  }

  if (hasOwn(scenario, "metadata")) {
    const metadata = inspectObject(scenario.metadata, ["metadata"], ["dataLabel", "provenance", "reviewStatus"], ["displayTimezone"]);
    if (metadata !== undefined) {
      if (metadata.dataLabel !== "SIMULATED_DEMONSTRATION_DATA") {
        addError("INVALID_SIMULATION_METADATA", ["metadata", "dataLabel"]);
      }
      inspectRequiredString(metadata, "provenance", ["metadata"]);
      if (
        metadata.reviewStatus !== "MECHANICS_ONLY_TEST_FIXTURE" &&
        metadata.reviewStatus !== "DATASET_REVIEW_REQUIRED" &&
        metadata.reviewStatus !== "APPROVED_PUBLIC_DEMONSTRATION"
      ) {
        addError("INVALID_SIMULATION_METADATA", ["metadata", "reviewStatus"]);
      }
      inspectOptionalString(metadata, "displayTimezone", ["metadata"]);
    }
  }

  type IndexedRecord = { record: UnknownRecord; index: number; id?: string };
  const collections: Record<string, IndexedRecord[]> = {
    monitors: [],
    observations: [],
    incidents: [],
    actions: [],
    resolutions: [],
    evidence: [],
    timelineEvents: []
  };

  const inspectCollection = (key: keyof typeof collections, required: readonly string[], optional: readonly string[] = []) => {
    if (!hasOwn(scenario, key)) return;
    const values = inspectArray(scenario[key], [key]);
    for (let index = 0; index < values.length; index += 1) {
      const value = values[index];
      const record = inspectObject(value, [key, index], required, optional);
      if (record !== undefined) {
        collections[key].push({
          record,
          index,
          id: inspectId(record, "id", [key, index])
        });
      }
    }
  };

  inspectCollection("monitors", ["id", "name"]);
  inspectCollection("observations", ["id", "monitorId", "offsetMs", "timestamp", "metricId", "unit", "reading"]);
  inspectCollection(
    "incidents",
    ["id", "openedOffsetMs", "openedTimestamp", "title"],
    ["monitorId", "description", "severity", "category"]
  );
  inspectCollection("actions", ["id", "incidentId", "offsetMs", "timestamp", "title"], ["description"]);
  inspectCollection("resolutions", ["id", "incidentId", "offsetMs", "timestamp", "summary"], ["description"]);
  inspectCollection("evidence", ["id", "offsetMs", "timestamp", "title"], ["incidentId", "description"]);
  inspectCollection(
    "timelineEvents",
    ["id", "offsetMs", "type", "title", "orderSemantics", "relatedEntityRefs"],
    ["timestamp", "description", "severity", "category"]
  );

  for (const [key, values] of Object.entries(collections)) {
    const seen = new Set<string>();
    for (const value of values) {
      if (value.id === undefined) continue;
      if (seen.has(value.id)) {
        addError("DUPLICATE_ID", [key, value.index, "id"], {
          details: { id: value.id }
        });
      }
      seen.add(value.id);
    }
  }

  for (const { record, index } of collections.monitors) {
    inspectRequiredString(record, "name", ["monitors", index]);
  }

  const checkTimestampOffset = (timestamp: string | undefined, offsetMs: number | undefined, path: ValidationPath) => {
    if (timestamp === undefined || offsetMs === undefined || startTimestamp === undefined) {
      return;
    }
    const expected = timestampAt(startTimestamp, offsetMs);
    if (expected === undefined) {
      addError("UNREPRESENTABLE_TIMESTAMP", path);
      return;
    }
    if (timestamp !== expected) {
      addError("TIMESTAMP_OFFSET_MISMATCH", path, { details: { expected } });
    }
  };

  const observationPositions = new Set<string>();
  for (const { record, index } of collections.observations) {
    const path = ["observations", index] as const;
    const monitorId = inspectId(record, "monitorId", path);
    const metricId = inspectRequiredString(record, "metricId", path);
    inspectRequiredString(record, "unit", path);
    const offsetMs = inspectOffset(record, "offsetMs", path, durationMs);
    const timestamp = inspectTimestamp(record, "timestamp", path);
    checkTimestampOffset(timestamp, offsetMs, [...path, "timestamp"]);

    if (monitorId !== undefined && metricId !== undefined && offsetMs !== undefined) {
      const position = `${monitorId}\u0000${metricId}\u0000${offsetMs}`;
      if (observationPositions.has(position)) {
        addError("DUPLICATE_OBSERVATION_POSITION", [...path, "offsetMs"]);
      }
      observationPositions.add(position);
    }

    const reading = inspectObject(record.reading, [...path, "reading"], ["status", "value"], ["quality", "reason"]);
    if (reading === undefined) continue;
    if (reading.status === "available") {
      if (
        typeof reading.value !== "number" ||
        !Number.isFinite(reading.value) ||
        (reading.quality !== "good" && reading.quality !== "degraded") ||
        hasOwn(reading, "reason")
      ) {
        addError("INVALID_READING", [...path, "reading"]);
      }
    } else if (reading.status === "unavailable") {
      if (reading.value !== null || hasOwn(reading, "quality")) {
        addError("INVALID_READING", [...path, "reading"]);
      }
      inspectOptionalString(reading, "reason", [...path, "reading"]);
    } else {
      addError("INVALID_READING", [...path, "reading", "status"]);
    }
  }

  for (const { record, index } of collections.incidents) {
    const path = ["incidents", index] as const;
    if (hasOwn(record, "monitorId")) inspectId(record, "monitorId", path);
    inspectRequiredString(record, "title", path);
    inspectOptionalString(record, "description", path);
    inspectOptionalString(record, "severity", path);
    inspectOptionalString(record, "category", path);
    const offsetMs = inspectOffset(record, "openedOffsetMs", path, durationMs);
    const timestamp = inspectTimestamp(record, "openedTimestamp", path);
    checkTimestampOffset(timestamp, offsetMs, [...path, "openedTimestamp"]);
  }

  const inspectTimedRecord = (collection: "actions" | "resolutions" | "evidence", requiredTextKey: "title" | "summary") => {
    for (const { record, index } of collections[collection]) {
      const path = [collection, index] as const;
      if (collection !== "evidence" || hasOwn(record, "incidentId")) {
        inspectId(record, "incidentId", path);
      }
      inspectRequiredString(record, requiredTextKey, path);
      inspectOptionalString(record, "description", path);
      const offsetMs = inspectOffset(record, "offsetMs", path, durationMs);
      const timestamp = inspectTimestamp(record, "timestamp", path);
      checkTimestampOffset(timestamp, offsetMs, [...path, "timestamp"]);
    }
  };

  inspectTimedRecord("actions", "title");
  inspectTimedRecord("resolutions", "summary");
  inspectTimedRecord("evidence", "title");

  const parsedRefs = new Map<number, CanonicalEntityRef[]>();
  for (const { record, index } of collections.timelineEvents) {
    const path = ["timelineEvents", index] as const;
    inspectRequiredString(record, "type", path);
    inspectRequiredString(record, "title", path);
    inspectOptionalString(record, "description", path);
    inspectOptionalString(record, "severity", path);
    inspectOptionalString(record, "category", path);
    const offsetMs = inspectOffset(record, "offsetMs", path, durationMs);
    const timestamp = inspectTimestamp(record, "timestamp", path, true);
    checkTimestampOffset(timestamp, offsetMs, [...path, "timestamp"]);
    if (record.orderSemantics !== "ORDER_SENSITIVE" && record.orderSemantics !== "ORDER_INDEPENDENT") {
      addError("INVALID_TYPE", [...path, "orderSemantics"], {
        details: { expected: "timeline order semantics" }
      });
    }

    const refs: CanonicalEntityRef[] = [];
    const relatedEntityRefs = inspectArray(record.relatedEntityRefs, [...path, "relatedEntityRefs"]);
    for (let refIndex = 0; refIndex < relatedEntityRefs.length; refIndex += 1) {
      const value = relatedEntityRefs[refIndex];
      const refPath = [...path, "relatedEntityRefs", refIndex] as const;
      const ref = inspectObject(value, refPath, ["entityType", "id"]);
      if (ref === undefined) continue;
      const id = inspectId(ref, "id", refPath);
      if (typeof ref.entityType !== "string" || !ENTITY_TYPES.includes(ref.entityType as (typeof ENTITY_TYPES)[number])) {
        addError("INVALID_TYPE", [...refPath, "entityType"], {
          details: { expected: "canonical entity type" }
        });
        continue;
      }
      if (id !== undefined) {
        refs.push({
          entityType: ref.entityType,
          id
        } as CanonicalEntityRef);
      }
    }
    parsedRefs.set(index, refs);
  }

  const idSets = {
    monitor: new Set(collections.monitors.flatMap(({ id }) => (id ? [id] : []))),
    observation: new Set(collections.observations.flatMap(({ id }) => (id ? [id] : []))),
    incident: new Set(collections.incidents.flatMap(({ id }) => (id ? [id] : []))),
    action: new Set(collections.actions.flatMap(({ id }) => (id ? [id] : []))),
    resolution: new Set(collections.resolutions.flatMap(({ id }) => (id ? [id] : []))),
    evidence: new Set(collections.evidence.flatMap(({ id }) => (id ? [id] : [])))
  };
  const allIds = new Map<string, Set<string>>();
  for (const [entityType, ids] of Object.entries(idSets)) {
    for (const id of ids) {
      const types = allIds.get(id) ?? new Set<string>();
      types.add(entityType);
      allIds.set(id, types);
    }
  }

  const ensureDirectReference = (id: unknown, target: "monitor" | "incident", path: ValidationPath) => {
    if (typeof id === "string" && ID_PATTERN.test(id) && !idSets[target].has(id)) {
      addError("DANGLING_REFERENCE", path, {
        details: { entityType: target, id }
      });
    }
  };

  for (const { record, index } of collections.observations) {
    ensureDirectReference(record.monitorId, "monitor", ["observations", index, "monitorId"]);
  }
  for (const { record, index } of collections.incidents) {
    if (hasOwn(record, "monitorId")) {
      ensureDirectReference(record.monitorId, "monitor", ["incidents", index, "monitorId"]);
    }
  }

  const incidentOffsets = new Map<string, number>();
  for (const { record, id } of collections.incidents) {
    if (id !== undefined && typeof record.openedOffsetMs === "number") {
      incidentOffsets.set(id, record.openedOffsetMs);
    }
  }

  const resolutionsByIncident = new Set<string>();
  for (const collection of ["actions", "resolutions", "evidence"] as const) {
    for (const { record, index } of collections[collection]) {
      if (!hasOwn(record, "incidentId")) continue;
      const path = [collection, index, "incidentId"] as const;
      ensureDirectReference(record.incidentId, "incident", path);
      if (typeof record.incidentId !== "string") continue;
      const openedOffset = incidentOffsets.get(record.incidentId);
      if (openedOffset !== undefined && typeof record.offsetMs === "number" && record.offsetMs < openedOffset) {
        addError("INVALID_ENTITY_RELATIONSHIP", [collection, index, "offsetMs"], {
          details: { incidentId: record.incidentId }
        });
      }
      if (collection === "resolutions") {
        if (resolutionsByIncident.has(record.incidentId)) {
          addError("INVALID_ENTITY_RELATIONSHIP", path, {
            details: { reason: "multiple resolutions", incidentId: record.incidentId }
          });
        }
        resolutionsByIncident.add(record.incidentId);
      }
    }
  }

  for (const [eventIndex, refs] of parsedRefs) {
    refs.forEach((ref, refIndex) => {
      if (idSets[ref.entityType].has(ref.id)) return;
      const otherTypes = allIds.get(ref.id);
      addError(
        otherTypes && otherTypes.size > 0 ? "WRONG_KIND_REFERENCE" : "DANGLING_REFERENCE",
        ["timelineEvents", eventIndex, "relatedEntityRefs", refIndex, "id"],
        { entityRef: ref }
      );
    });
  }

  const eventsByOffset = new Map<number, IndexedRecord[]>();
  for (const event of collections.timelineEvents) {
    if (!Number.isSafeInteger(event.record.offsetMs)) continue;
    const offset = event.record.offsetMs as number;
    const group = eventsByOffset.get(offset) ?? [];
    group.push(event);
    eventsByOffset.set(offset, group);
  }
  for (const [offsetMs, group] of [...eventsByOffset.entries()].sort(([left], [right]) => left - right)) {
    if (group.length > 1 && group.some(({ record }) => record.orderSemantics !== "ORDER_INDEPENDENT")) {
      addError("AMBIGUOUS_SAME_OFFSET", ["timelineEvents", group[0].index, "offsetMs"], {
        details: { offsetMs, eventCount: group.length }
      });
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: input as ValidatedScenario };
}
