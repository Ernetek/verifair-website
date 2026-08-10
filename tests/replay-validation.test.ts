import { describe, expect, it } from "vitest";

import { validateScenario } from "@/lib/replay/validation";
import { cloneScenario, createMechanicsOnlyScenario } from "./replay-fixtures";

function errorCodes(input: unknown): string[] {
  const result = validateScenario(input);
  return result.ok ? [] : result.errors.map(({ code }) => code);
}

describe("scenario validation", () => {
  it("accepts a valid mechanics-only scenario", () => {
    const result = validateScenario(createMechanicsOnlyScenario());

    expect(result.ok).toBe(true);
  });

  it("returns deterministic structured errors for malformed shape", () => {
    expect(validateScenario(null)).toEqual({
      ok: false,
      errors: [
        {
          code: "INVALID_TYPE",
          path: [],
          details: { expected: "object" }
        }
      ]
    });

    const scenario = cloneScenario();
    Reflect.deleteProperty(scenario, "monitors");
    Reflect.set(scenario, "unexpected", true);
    const result = validateScenario(scenario);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.slice(0, 2)).toEqual([
        { code: "REQUIRED_FIELD", path: ["monitors"] },
        { code: "UNKNOWN_FIELD", path: ["unexpected"] }
      ]);
    }
  });

  it("rejects invalid and duplicate IDs", () => {
    const scenario = cloneScenario();
    Reflect.set(scenario.monitors[0], "id", "not valid/id");

    expect(errorCodes(scenario)).toContain("INVALID_ID");

    const duplicate = cloneScenario();
    Reflect.set(duplicate.monitors[1], "id", duplicate.monitors[0].id);
    expect(errorCodes(duplicate)).toContain("DUPLICATE_ID");
  });

  it("rejects invalid duration, offsets and canonical timestamps", () => {
    const invalidDuration = cloneScenario();
    Reflect.set(invalidDuration, "durationMs", 0);
    expect(errorCodes(invalidDuration)).toContain("INVALID_DURATION_MS");

    const invalidOffset = cloneScenario();
    Reflect.set(invalidOffset.observations[0], "offsetMs", 1.5);
    expect(errorCodes(invalidOffset)).toContain("INVALID_OFFSET_MS");

    const outOfBounds = cloneScenario();
    Reflect.set(outOfBounds.actions[0], "offsetMs", 5_000);
    expect(errorCodes(outOfBounds)).toContain("OFFSET_OUT_OF_BOUNDS");

    const invalidTimestamp = cloneScenario();
    Reflect.set(invalidTimestamp.observations[0], "timestamp", "2040-01-01T00:00:00Z");
    expect(errorCodes(invalidTimestamp)).toContain("INVALID_UTC_TIMESTAMP");

    const mismatchedTimestamp = cloneScenario();
    Reflect.set(mismatchedTimestamp.observations[0], "timestamp", "2040-01-01T00:00:00.001Z");
    expect(errorCodes(mismatchedTimestamp)).toContain("TIMESTAMP_OFFSET_MISMATCH");
  });

  it("rejects invalid readings and duplicate monitor/metric/offset positions", () => {
    const invalidReading = cloneScenario();
    Reflect.set(invalidReading.observations[0].reading, "value", Number.NaN);
    expect(errorCodes(invalidReading)).toContain("INVALID_READING");

    const duplicate = cloneScenario();
    Reflect.set(duplicate.observations[2], "offsetMs", 0);
    Reflect.set(duplicate.observations[2], "timestamp", duplicate.startTimestamp);
    expect(errorCodes(duplicate)).toContain("DUPLICATE_OBSERVATION_POSITION");
  });

  it("rejects dangling direct references and wrong-kind timeline references", () => {
    const dangling = cloneScenario();
    Reflect.set(dangling.observations[0], "monitorId", "TEST_MISSING_MONITOR");
    expect(errorCodes(dangling)).toContain("DANGLING_REFERENCE");

    const wrongKind = cloneScenario();
    Reflect.set(wrongKind.timelineEvents[0].relatedEntityRefs[0], "id", "TEST_INCIDENT_A");
    expect(errorCodes(wrongKind)).toContain("WRONG_KIND_REFERENCE");
  });

  it("rejects invalid incident relationships and more than one resolution", () => {
    const earlyAction = cloneScenario();
    Reflect.set(earlyAction.actions[0], "offsetMs", 500);
    Reflect.set(earlyAction.actions[0], "timestamp", "2040-01-01T00:00:00.500Z");
    expect(errorCodes(earlyAction)).toContain("INVALID_ENTITY_RELATIONSHIP");

    const duplicateResolution = cloneScenario();
    const secondResolution = structuredClone(duplicateResolution.resolutions[0]);
    Reflect.set(secondResolution, "id", "TEST_RESOLUTION_B");
    Reflect.set(duplicateResolution, "resolutions", [...duplicateResolution.resolutions, secondResolution]);
    expect(errorCodes(duplicateResolution)).toContain("INVALID_ENTITY_RELATIONSHIP");
  });

  it("accepts independent same-offset events and rejects ambiguous groups", () => {
    expect(validateScenario(createMechanicsOnlyScenario()).ok).toBe(true);

    const ambiguous = cloneScenario();
    Reflect.set(ambiguous.timelineEvents[2], "orderSemantics", "ORDER_SENSITIVE");
    expect(errorCodes(ambiguous)).toContain("AMBIGUOUS_SAME_OFFSET");
  });

  it("does not infer order semantics from event content", () => {
    const scenario = cloneScenario();
    Reflect.set(scenario.timelineEvents[2], "orderSemantics", "NOT_DECLARED");

    expect(errorCodes(scenario)).toEqual(expect.arrayContaining(["INVALID_TYPE", "AMBIGUOUS_SAME_OFFSET"]));
  });

  it("rejects duplicated canonical payload fields on timeline events", () => {
    const scenario = cloneScenario();
    Reflect.set(scenario.timelineEvents[0], "reading", {
      status: "available",
      value: 999,
      quality: "good"
    });

    const result = validateScenario(scenario);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContainEqual({
        code: "UNKNOWN_FIELD",
        path: ["timelineEvents", 0, "reading"]
      });
    }
  });

  it("returns structured errors for Date-range overflow without throwing", () => {
    const scenario = cloneScenario();
    Reflect.set(scenario, "durationMs", Number.MAX_SAFE_INTEGER);
    Reflect.set(scenario.observations[0], "offsetMs", Number.MAX_SAFE_INTEGER);

    expect(() => validateScenario(scenario)).not.toThrow();
    expect(errorCodes(scenario)).toContain("UNREPRESENTABLE_TIMESTAMP");
  });

  it("does not invoke throwing accessors", () => {
    const scenario = cloneScenario();
    let getterInvoked = false;
    Object.defineProperty(scenario, "id", {
      get() {
        getterInvoked = true;
        throw new Error("must not escape");
      },
      configurable: true,
      enumerable: true
    });

    expect(validateScenario(scenario)).toEqual({
      ok: false,
      errors: [{ code: "UNREADABLE_INPUT", path: ["id"] }]
    });
    expect(getterInvoked).toBe(false);
  });

  it("contains hostile Proxy inspection failures", () => {
    const hostile = new Proxy(
      {},
      {
        ownKeys() {
          throw new Error("must not escape");
        }
      }
    );

    expect(() => validateScenario(hostile)).not.toThrow();
    expect(validateScenario(hostile)).toEqual({
      ok: false,
      errors: [{ code: "UNREADABLE_INPUT", path: [] }]
    });
  });

  it("does not inspect a hostile value thrown by a Proxy trap", () => {
    let secondaryPrototypeInspections = 0;
    let secondaryPropertyReads = 0;
    const rawMessage = "secondary hostile trap must not escape";
    const thrownHostile = new Proxy(
      {},
      {
        getPrototypeOf() {
          secondaryPrototypeInspections += 1;
          throw new Error(rawMessage);
        },
        get() {
          secondaryPropertyReads += 1;
          throw new Error(rawMessage);
        }
      }
    );
    const hostileInput = new Proxy(
      {},
      {
        getPrototypeOf() {
          throw thrownHostile;
        }
      }
    );

    const expected = {
      ok: false,
      errors: [{ code: "UNREADABLE_INPUT", path: [] }]
    };
    expect(() => validateScenario(hostileInput)).not.toThrow();
    expect(validateScenario(hostileInput)).toEqual(expected);
    expect(validateScenario(hostileInput)).toEqual(expected);
    expect(JSON.stringify(validateScenario(hostileInput))).not.toContain(rawMessage);
    expect(secondaryPrototypeInspections).toBe(0);
    expect(secondaryPropertyReads).toBe(0);
  });

  it("rejects cycles and repeated aliases while accepting independent equivalents", () => {
    const circular = cloneScenario();
    Reflect.set(circular.metadata, "cycle", circular.metadata);
    const circularExpected = {
      ok: false,
      errors: [{ code: "UNREADABLE_INPUT", path: ["metadata", "cycle"] }]
    };
    expect(() => validateScenario(circular)).not.toThrow();
    expect(validateScenario(circular)).toEqual(circularExpected);
    expect(validateScenario(circular)).toEqual(circularExpected);

    const repeatedAlias = cloneScenario();
    Reflect.set(repeatedAlias.timelineEvents[3], "relatedEntityRefs", repeatedAlias.timelineEvents[2].relatedEntityRefs);
    const aliasExpected = {
      ok: false,
      errors: [{ code: "UNREADABLE_INPUT", path: ["timelineEvents", 3, "relatedEntityRefs"] }]
    };
    expect(() => validateScenario(repeatedAlias)).not.toThrow();
    expect(validateScenario(repeatedAlias)).toEqual(aliasExpected);
    expect(validateScenario(repeatedAlias)).toEqual(aliasExpected);

    const independentEquivalent = cloneScenario();
    Reflect.set(
      independentEquivalent.timelineEvents[3],
      "relatedEntityRefs",
      structuredClone(independentEquivalent.timelineEvents[2].relatedEntityRefs)
    );
    expect(validateScenario(independentEquivalent).ok).toBe(true);
  });

  it("accepts ordinary and null-prototype records but rejects custom prototypes", () => {
    expect(validateScenario(cloneScenario()).ok).toBe(true);

    const nullPrototype = Object.assign(Object.create(null), cloneScenario());
    expect(validateScenario(nullPrototype).ok).toBe(true);

    const customPrototype = cloneScenario();
    Reflect.setPrototypeOf(customPrototype, { custom: true });
    expect(errorCodes(customPrototype)).toEqual(["UNREADABLE_INPUT"]);
  });

  it("rejects sparse arrays and accessor-backed indexes", () => {
    const sparse = cloneScenario();
    Reflect.set(sparse, "monitors", new Array(1));
    expect(errorCodes(sparse)).toEqual(["UNREADABLE_INPUT"]);

    const accessorIndex = cloneScenario();
    let getterInvoked = false;
    Object.defineProperty(accessorIndex.observations, "0", {
      get() {
        getterInvoked = true;
        throw new Error("must not escape");
      },
      configurable: true,
      enumerable: true
    });
    expect(errorCodes(accessorIndex)).toEqual(["UNREADABLE_INPUT"]);
    expect(getterInvoked).toBe(false);
  });

  it("rejects symbol and unexpected non-enumerable own properties", () => {
    const symbolKey = cloneScenario();
    Object.defineProperty(symbolKey.timelineEvents[0], Symbol("payload"), {
      value: { reading: 999 },
      enumerable: true
    });
    expect(errorCodes(symbolKey)).toEqual(["UNREADABLE_INPUT"]);

    const hiddenProperty = cloneScenario();
    Object.defineProperty(hiddenProperty.timelineEvents[0], "reading", {
      value: { value: 999 },
      enumerable: false
    });
    expect(errorCodes(hiddenProperty)).toEqual(["UNREADABLE_INPUT"]);
  });

  it("rejects nested accessor-backed values without invoking them", () => {
    const scenario = cloneScenario();
    let getterInvoked = false;
    Object.defineProperty(scenario.observations[0].reading, "value", {
      get() {
        getterInvoked = true;
        return 999;
      },
      configurable: true,
      enumerable: true
    });

    expect(errorCodes(scenario)).toEqual(["UNREADABLE_INPUT"]);
    expect(getterInvoked).toBe(false);
  });

  it("returns a detached deeply frozen snapshot without mutating input", () => {
    const scenario = cloneScenario();
    const before = structuredClone(scenario);
    const result = validateScenario(scenario);
    if (!result.ok) throw new Error("Mechanics-only scenario must be valid");

    expect(result.value).not.toBe(scenario);
    expect(scenario).toEqual(before);
    expect(Object.isFrozen(scenario)).toBe(false);
    expect(Object.isFrozen(scenario.observations)).toBe(false);
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.observations)).toBe(true);
    expect(Object.isFrozen(result.value.observations[0].reading)).toBe(true);
    expect(Reflect.set(result.value, "durationMs", 1)).toBe(false);
    expect(Reflect.set(result.value.observations[0].reading, "value", 999)).toBe(false);
    expect(result.value.durationMs).toBe(4_000);
    expect(result.value.observations[0].reading).toEqual({
      status: "available",
      value: 10,
      quality: "good"
    });
  });
});
