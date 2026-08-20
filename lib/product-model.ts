export const PRODUCT_FRAMEWORK = [
  {
    id: "ASSESS",
    title: "ASSESS",
    description:
      "Understand current particulate conditions, monitoring status and system health.",
  },
  {
    id: "ACT",
    title: "ACT",
    description:
      "Turn configured operational conditions into alerts and coordinated response.",
  },
  {
    id: "RECORD",
    title: "RECORD",
    description:
      "Maintain the connected operational history and generate reporting.",
  },
] as const;

export type ProductFrameworkStage = (typeof PRODUCT_FRAMEWORK)[number]["id"];

export const DUSTLIGHT_DEVICE_STATUSES = ["GREEN", "YELLOW", "RED"] as const;
export type DustlightDeviceStatus = (typeof DUSTLIGHT_DEVICE_STATUSES)[number];

export const VERIFAIR_OPERATIONAL_STATES = [
  "NORMAL",
  "ATTENTION",
  "ACTION",
] as const;
export type VerifAirOperationalState =
  (typeof VERIFAIR_OPERATIONAL_STATES)[number];

export const VERIFAIR_SYSTEM_HEALTH_STATES = [
  "HEALTHY",
  "DEGRADED",
  "STALE",
  "OFFLINE",
] as const;
export type VerifAirSystemHealth =
  (typeof VERIFAIR_SYSTEM_HEALTH_STATES)[number];

export const TECHNOLOGY_RESPONSIBILITIES = [
  {
    technology: "Dustlight",
    responsibilities: "Particulate sensing and device status.",
  },
  {
    technology: "VerifAir Edge",
    responsibilities:
      "Local BLE collection, secure transport, buffering and system health.",
  },
  {
    technology: "VerifAir Platform",
    responsibilities:
      "Centralised monitoring, project-configured operational states, alerts, workflow, records and reporting.",
  },
] as const;

export const DEMO_DISCLOSURE =
  "Simulated demonstration using fictional data.";

export const DEMO_DISCLOSURE_WITH_CONTEXT =
  "Demonstration readings, operational triggers and events are illustrative only.";
