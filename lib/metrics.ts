export const SUPPORTED_PARTICULATE_METRICS = ["PM1", "PM2.5", "PM10"] as const;

export type SupportedParticulateMetric =
  (typeof SUPPORTED_PARTICULATE_METRICS)[number];

export const PARTICULATE_UNIT = "µg/m³";

