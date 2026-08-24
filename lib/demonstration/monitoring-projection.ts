import { classifyDemonstrationMetric } from "@/lib/demonstration/metric-status";
import type { ParticulateMetricId } from "@/lib/metrics";
import type { DustlightDeviceStatus, VerifAirOperationalState, VerifAirSystemHealth } from "@/lib/product-model";
import { DEMONSTRATION_DEVICE_HEALTH, DEMONSTRATION_METRICS, publicDemonstrationScenario } from "@/lib/replay/demonstration-scenario";

export const MONITORING_VIEW_OFFSET_MS = 240_000;
export const OBSERVATION_FRESHNESS_WINDOW_MS = 120_000;

const OPERATIONAL_STATE_PRIORITY: Record<VerifAirOperationalState, number> = {
  NORMAL: 0,
  ATTENTION: 1,
  ACTION: 2
};

export interface MonitoringLocationProjection {
  readonly id: string;
  readonly site: string;
  readonly zone: string;
  readonly location: string;
  readonly values: Readonly<Record<ParticulateMetricId, number>>;
  readonly operationalState: VerifAirOperationalState;
  readonly dustlightDeviceStatus: DustlightDeviceStatus;
  readonly observationFreshness: "CURRENT" | "STALE";
  readonly lastObservationTimestamp: string;
  readonly monitorHealth: "ONLINE" | "OFFLINE";
  readonly edgeHealth: "ONLINE" | "OFFLINE";
  readonly systemHealth: VerifAirSystemHealth;
}

export interface MonitoringProjection {
  readonly site: string;
  readonly locations: readonly MonitoringLocationProjection[];
  readonly overallSystemHealth: VerifAirSystemHealth;
  readonly reportingLocationCount: number;
  readonly totalLocationCount: number;
  readonly edgeStatus: "ONLINE" | "OFFLINE";
  readonly primaryProviderStatus: "CONNECTED" | "DISCONNECTED";
  readonly secondaryProviderStatus: "READY" | "UNAVAILABLE";
  readonly observationsStatus: "CURRENT" | "STALE";
}

function splitMonitorName(name: string) {
  const [zone, location] = name.split(" · ");
  return {
    zone: zone || "Unassigned zone",
    location: location || name
  };
}

function highestOperationalState(values: Readonly<Record<ParticulateMetricId, number>>) {
  return DEMONSTRATION_METRICS.reduce<VerifAirOperationalState>((highest, metric) => {
    const state = classifyDemonstrationMetric(metric.id, values[metric.id]).label;
    return OPERATIONAL_STATE_PRIORITY[state] > OPERATIONAL_STATE_PRIORITY[highest] ? state : highest;
  }, "NORMAL");
}

export function projectMonitoringAt(offsetMs: number = MONITORING_VIEW_OFFSET_MS): MonitoringProjection {
  const edgeStatus = DEMONSTRATION_DEVICE_HEALTH.gateway.status;
  const primaryProviderStatus = DEMONSTRATION_DEVICE_HEALTH.communications.primaryProvider.status;
  const secondaryProviderStatus = DEMONSTRATION_DEVICE_HEALTH.communications.secondaryProvider.status;

  const locations = publicDemonstrationScenario.monitors.map((monitor): MonitoringLocationProjection => {
    const latestByMetric = Object.fromEntries(
      DEMONSTRATION_METRICS.map((metric) => {
        const latest = publicDemonstrationScenario.observations
          .filter(
            (observation) => observation.monitorId === monitor.id && observation.metricId === metric.id && observation.offsetMs <= offsetMs
          )
          .at(-1);
        return [metric.id, latest];
      })
    ) as Record<ParticulateMetricId, (typeof publicDemonstrationScenario.observations)[number] | undefined>;

    const latestObservations = Object.values(latestByMetric).filter((observation): observation is NonNullable<typeof observation> =>
      Boolean(observation)
    );
    const latestOffsetMs = Math.max(...latestObservations.map(({ offsetMs: observationOffset }) => observationOffset), -1);
    const lastObservationTimestamp =
      latestObservations
        .map(({ timestamp }) => timestamp)
        .sort()
        .at(-1) ?? publicDemonstrationScenario.startTimestamp;
    const values = Object.fromEntries(
      DEMONSTRATION_METRICS.map((metric) => {
        const reading = latestByMetric[metric.id]?.reading;
        return [metric.id, reading?.status === "available" ? reading.value : 0];
      })
    ) as Record<ParticulateMetricId, number>;
    const sensor = DEMONSTRATION_DEVICE_HEALTH.sensors.find(({ monitorId }) => monitorId === monitor.id);
    const observationFreshness =
      latestObservations.length === DEMONSTRATION_METRICS.length && offsetMs - latestOffsetMs <= OBSERVATION_FRESHNESS_WINDOW_MS
        ? "CURRENT"
        : "STALE";
    const monitorHealth = sensor?.status === "ONLINE" ? "ONLINE" : "OFFLINE";
    const systemHealth: VerifAirSystemHealth =
      edgeStatus !== "ONLINE" || monitorHealth === "OFFLINE"
        ? "OFFLINE"
        : observationFreshness === "STALE"
          ? "STALE"
          : primaryProviderStatus !== "CONNECTED" || secondaryProviderStatus !== "READY"
            ? "DEGRADED"
            : "HEALTHY";
    const { zone, location } = splitMonitorName(monitor.name);

    return {
      id: monitor.id,
      site: "Demonstration Project",
      zone,
      location,
      values,
      operationalState: highestOperationalState(values),
      dustlightDeviceStatus: sensor?.deviceStatus ?? "RED",
      observationFreshness,
      lastObservationTimestamp,
      monitorHealth,
      edgeHealth: edgeStatus,
      systemHealth
    };
  });

  const reportingLocationCount = locations.filter(
    ({ monitorHealth, observationFreshness }) => monitorHealth === "ONLINE" && observationFreshness === "CURRENT"
  ).length;
  const observationsStatus = locations.every(({ observationFreshness }) => observationFreshness === "CURRENT") ? "CURRENT" : "STALE";
  const overallSystemHealth: VerifAirSystemHealth = locations.some(({ systemHealth }) => systemHealth === "OFFLINE")
    ? "OFFLINE"
    : observationsStatus === "STALE"
      ? "STALE"
      : locations.some(({ systemHealth }) => systemHealth === "DEGRADED")
        ? "DEGRADED"
        : "HEALTHY";

  return {
    site: "Demonstration Project",
    locations,
    overallSystemHealth,
    reportingLocationCount,
    totalLocationCount: locations.length,
    edgeStatus,
    primaryProviderStatus,
    secondaryProviderStatus,
    observationsStatus
  };
}

export const monitoringProjection = projectMonitoringAt();
