import { describe, expect, it } from "vitest";

import {
  DEMO_DISCLOSURE,
  DEMO_DISCLOSURE_WITH_CONTEXT,
  DUSTLIGHT_DEVICE_STATUSES,
  MONITORING_TECHNOLOGY_PATH,
  PRODUCT_FRAMEWORK,
  TECHNOLOGY_RESPONSIBILITIES,
  VERIFAIR_OPERATIONAL_STATES,
  VERIFAIR_SYSTEM_HEALTH_STATES,
} from "@/lib/product-model";

describe("shared VerifAir product model", () => {
  it("defines the three-stage customer framework", () => {
    expect(PRODUCT_FRAMEWORK.map(({ id }) => id)).toEqual([
      "ASSESS",
      "ACT",
      "REPORT",
    ]);
  });

  it("keeps device status, operational state and system health separate", () => {
    expect(DUSTLIGHT_DEVICE_STATUSES).toEqual(["GREEN", "YELLOW", "RED"]);
    expect(VERIFAIR_OPERATIONAL_STATES).toEqual([
      "NORMAL",
      "ATTENTION",
      "ACTION",
    ]);
    expect(VERIFAIR_SYSTEM_HEALTH_STATES).toEqual([
      "HEALTHY",
      "DEGRADED",
      "STALE",
      "OFFLINE",
    ]);
  });

  it("defines distinct technology responsibilities", () => {
    expect(TECHNOLOGY_RESPONSIBILITIES.map(({ technology }) => technology)).toEqual([
      "Dustlight",
      "VerifAir Edge",
      "VerifAir Platform",
    ]);
    expect(MONITORING_TECHNOLOGY_PATH.map(({ technology }) => technology)).toEqual([
      "Dustlight",
      "VerifAir Edge",
      "Communications",
      "VerifAir Platform",
    ]);
  });

  it("provides standard demonstration disclosures", () => {
    expect(DEMO_DISCLOSURE).toBe(
      "Simulated demonstration using fictional data.",
    );
    expect(DEMO_DISCLOSURE_WITH_CONTEXT).toBe(
      "Demonstration readings, operational triggers and events are illustrative only.",
    );
  });
});
