import type { ParticulateMetricId } from "@/lib/metrics";
import type { VerifAirOperationalState } from "@/lib/product-model";

export type DemonstrationMetricId = ParticulateMetricId;
export type MetricStatusLabel = VerifAirOperationalState;

/**
 * Product-owner-confirmed operational triggers for the deterministic public
 * demonstration only. These are not regulatory or compliance limits.
 */
export const DEMONSTRATION_METRIC_THRESHOLDS = {
  PM1: { attention: 8, action: 20 },
  PM2_5: { attention: 15, action: 25 },
  RESPIRABLE_DUST: { attention: 25, action: 50 },
  PM10: { attention: 30, action: 50 },
} as const satisfies Record<
  DemonstrationMetricId,
  { readonly attention: number; readonly action: number }
>;

export interface MetricStatus {
  readonly label: MetricStatusLabel;
  readonly panelClassName: string;
  readonly lightClassName: string;
}

export function classifyDemonstrationMetric(
  metricId: DemonstrationMetricId,
  value: number,
): MetricStatus {
  const threshold = DEMONSTRATION_METRIC_THRESHOLDS[metricId];
  if (value >= threshold.action) {
    return {
      label: "ACTION",
      panelClassName: "bg-red-700 text-white",
      lightClassName: "border-red-600 bg-red-50 text-red-950",
    };
  }
  if (value >= threshold.attention) {
    return {
      label: "ATTENTION",
      panelClassName: "bg-amber-400 text-slate-950",
      lightClassName: "border-amber-500 bg-amber-50 text-amber-950",
    };
  }
  return {
    label: "NORMAL",
    panelClassName: "bg-emerald-700 text-white",
    lightClassName: "border-emerald-600 bg-emerald-50 text-emerald-950",
  };
}
