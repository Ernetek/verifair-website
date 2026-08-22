export interface DustlightMeasurement {
  readonly timestampMs: number;
  readonly pm1: number;
  readonly pm25: number;
  readonly respirableDust: number;
  readonly pm10: number;
}

export type DustlightParseResult =
  | { readonly ok: true; readonly value: DustlightMeasurement }
  | { readonly ok: false; readonly error: DustlightParseError };

export type DustlightParseError =
  | "EMPTY_RECORD"
  | "INVALID_FIELD_COUNT"
  | "INVALID_TIMESTAMP"
  | "TIMESTAMP_OUT_OF_RANGE"
  | "INVALID_READING";

export interface DustlightParseOptions {
  readonly nowMs?: number;
  readonly maxFutureMs?: number;
  readonly minTimestampMs?: number;
}

const DEFAULT_MAX_FUTURE_MS = 5 * 60 * 1000;
const DEFAULT_MIN_TIMESTAMP_MS = Date.UTC(2000, 0, 1);

function parseNonNegativeNumber(value: string): number | undefined {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseDustlightMeasurement(
  record: string,
  options: DustlightParseOptions = {},
): DustlightParseResult {
  const trimmedRecord = record.trim();

  if (trimmedRecord.length === 0) {
    return { ok: false, error: "EMPTY_RECORD" };
  }

  const fields = trimmedRecord.split(",");
  if (fields.length < 5) {
    return { ok: false, error: "INVALID_FIELD_COUNT" };
  }

  const timestampSeconds = Number(fields[0].trim());
  if (!Number.isInteger(timestampSeconds) || timestampSeconds <= 0) {
    return { ok: false, error: "INVALID_TIMESTAMP" };
  }

  const timestampMs = timestampSeconds * 1000;
  const nowMs = options.nowMs ?? Date.now();
  const maxFutureMs = options.maxFutureMs ?? DEFAULT_MAX_FUTURE_MS;
  const minTimestampMs = options.minTimestampMs ?? DEFAULT_MIN_TIMESTAMP_MS;

  if (
    timestampMs < minTimestampMs ||
    timestampMs > nowMs + maxFutureMs
  ) {
    return { ok: false, error: "TIMESTAMP_OUT_OF_RANGE" };
  }

  const readings = fields.slice(1, 5).map(parseNonNegativeNumber);
  if (readings.some((reading) => reading === undefined)) {
    return { ok: false, error: "INVALID_READING" };
  }

  const [pm1, pm25, respirableDust, pm10] = readings as [
    number,
    number,
    number,
    number,
  ];

  return {
    ok: true,
    value: { timestampMs, pm1, pm25, respirableDust, pm10 },
  };
}

export function parseDustlightBatch(
  payload: string,
  options: DustlightParseOptions = {},
): readonly DustlightMeasurement[] {
  return payload
    .split(/\r?\n/)
    .filter((record) => record.trim().length > 0)
    .map((record) => {
      const result = parseDustlightMeasurement(record, options);
      if (!result.ok) {
        throw new Error(`Invalid Dustlight record: ${result.error}`);
      }
      return result.value;
    });
}