import type {
  VerifAirOperationalState,
  VerifAirSystemHealth,
} from "@/lib/product-model";

export interface MonitoringPresentation {
  readonly primaryState: VerifAirOperationalState | "STALE" | "OFFLINE";
  readonly previousOperationalState?: VerifAirOperationalState;
  readonly observationIsCurrent: boolean;
}

export function resolveMonitoringPresentation(
  operationalState: VerifAirOperationalState,
  systemHealth: VerifAirSystemHealth,
): MonitoringPresentation {
  if (systemHealth === "STALE" || systemHealth === "OFFLINE") {
    return {
      primaryState: systemHealth,
      previousOperationalState: operationalState,
      observationIsCurrent: false,
    };
  }

  return {
    primaryState: operationalState,
    observationIsCurrent: true,
  };
}
