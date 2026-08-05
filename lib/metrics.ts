export const SUPPORTED_PARTICULATE_METRICS = ["PM1", "PM2.5", "PM10"] as const;

export type SupportedParticulateMetric =
  (typeof SUPPORTED_PARTICULATE_METRICS)[number];

export const PARTICULATE_UNIT = "µg/m³";

export const PARTICULATE_QUALIFICATION =
  "Particulate readings indicate particle-size fractions and changing conditions. They do not identify material composition or determine personal exposure.";
