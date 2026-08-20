export const PARTICULATE_METRICS = [
  { id: "RESPIRABLE_DUST", label: "Respirable Dust" },
  { id: "PM1", label: "PM1" },
  { id: "PM2_5", label: "PM2.5" },
  { id: "PM10", label: "PM10" },
] as const;

export type ParticulateMetricId = (typeof PARTICULATE_METRICS)[number]["id"];

export const SUPPORTED_PARTICULATE_METRICS = PARTICULATE_METRICS.map(
  ({ label }) => label,
) as ["Respirable Dust", "PM1", "PM2.5", "PM10"];

export type SupportedParticulateMetric =
  (typeof SUPPORTED_PARTICULATE_METRICS)[number];

export const PARTICULATE_UNIT = "µg/m³";
