import type { DustlightMeasurement } from "@/lib/telemetry/dustlight";

export type TelemetryMetric =
  | "PM1"
  | "PM2.5"
  | "RespirableDust"
  | "PM10";

export interface TenantObservation {
  readonly id: string;
  readonly tenantId: string;
  readonly monitorId: string;
  readonly timestampMs: number;
  readonly metric: TelemetryMetric;
  readonly value: number;
  readonly unit: "µg/m³";
  readonly quality: "good";
  readonly status: "available";
  readonly source: "dustlight";
}

export interface TelemetryProvider<TPayload = unknown> {
  readonly source: string;
  normalize(
    payload: TPayload,
    context: TelemetryNormalizationContext,
  ): readonly TenantObservation[];
}

export interface TelemetryNormalizationContext {
  readonly tenantId: string;
  readonly monitorId: string;
  readonly observationId: (metric: TelemetryMetric, timestampMs: number) => string;
}

export function normalizeDustlightMeasurement(
  measurement: DustlightMeasurement,
  context: TelemetryNormalizationContext,
): readonly TenantObservation[] {
  const readings: readonly [TelemetryMetric, number][] = [
    ["PM1", measurement.pm1],
    ["PM2.5", measurement.pm25],
    ["RespirableDust", measurement.respirableDust],
    ["PM10", measurement.pm10],
  ];

  return readings.map(([metric, value]) => ({
    id: context.observationId(metric, measurement.timestampMs),
    tenantId: context.tenantId,
    monitorId: context.monitorId,
    timestampMs: measurement.timestampMs,
    metric,
    value,
    unit: "µg/m³",
    quality: "good",
    status: "available",
    source: "dustlight",
  }));
}