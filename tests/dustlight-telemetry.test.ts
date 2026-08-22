import { describe, expect, it } from "vitest";

import {
  parseDustlightBatch,
  parseDustlightMeasurement,
} from "@/lib/telemetry/dustlight";
import { normalizeDustlightMeasurement } from "@/lib/telemetry/provider";

const nowMs = Date.UTC(2025, 7, 10);

describe("Dustlight telemetry adapter", () => {
  it("parses the documented seven-field notification", () => {
    const result = parseDustlightMeasurement(
      "1754769600,12,34,28,56,R,3",
      { nowMs },
    );

    expect(result).toEqual({
      ok: true,
      value: {
        timestampMs: 1754769600000,
        pm1: 12,
        pm25: 34,
        respirableDust: 28,
        pm10: 56,
      },
    });
  });

  it("ignores optional fields after the four measurements", () => {
    const result = parseDustlightMeasurement(
      "1754769600, 12.5, 34.25, 28, 56, ignored, ignored",
      { nowMs },
    );

    expect(result.ok).toBe(true);
  });

  it.each([
    ["", "EMPTY_RECORD"],
    ["1754769600,12,34", "INVALID_FIELD_COUNT"],
    ["not-a-time,12,34,28,56", "INVALID_TIMESTAMP"],
    ["1754769600,12,-1,28,56", "INVALID_READING"],
  ])("rejects invalid record %s", (record, error) => {
    expect(
      parseDustlightMeasurement(record, { nowMs }),
    ).toEqual({ ok: false, error });
  });

  it("rejects readings outside the accepted timestamp window", () => {
    const result = parseDustlightMeasurement(
      "946684799,12,34,28,56",
      { nowMs },
    );

    expect(result).toEqual({ ok: false, error: "TIMESTAMP_OUT_OF_RANGE" });
  });

  it("parses a newline-delimited batch", () => {
    const result = parseDustlightBatch(
      "1754769600,12,34,28,56,R,3\n1754769601,13,35,29,57,R,3\n",
      { nowMs },
    );

    expect(result).toHaveLength(2);
    expect(result[1].pm25).toBe(35);
  });

  it("normalizes one vendor reading into tenant-scoped observations", () => {
    const parsed = parseDustlightMeasurement(
      "1754769600,12,34,28,56,R,3",
      { nowMs },
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const observations = normalizeDustlightMeasurement(parsed.value, {
      tenantId: "tenant-1",
      monitorId: "monitor-1",
      observationId: (metric, timestampMs) => `${metric}-${timestampMs}`,
    });

    expect(observations).toHaveLength(4);
    expect(observations[1]).toMatchObject({
      id: "PM2.5-1754769600000",
      tenantId: "tenant-1",
      monitorId: "monitor-1",
      metric: "PM2.5",
      value: 34,
      source: "dustlight",
    });
  });
});