import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

describe("dashboard demonstrations", () => {
  it("uses canonical replay scenario data and supported PM metrics without Math.random", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");

    expect(dashboards).toContain("publicDemonstrationScenario");
    expect(dashboards).toContain("selectLatestObservation");
    expect(dashboards).not.toContain("Math.random()");
  });

  it("uses canonical demonstration session and replay controls", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");
    expect(dashboards).toContain("DemonstrationSession");
    expect(dashboards).toContain("getSharedDemonstrationSession");
    expect(dashboards).toContain("<ReplayControls");
  });

  it("keeps the hero monitoring-room preview live and connected to replay state", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");

    expect(dashboards).toContain("MonitoringRoomHeroPreview");
    expect(dashboards).not.toContain("heroLiveFrames");
    expect(dashboards).toContain("replayState.timestamp");
  });

  it("models canonical workflow phases", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");

    expect(dashboards).toContain("CANONICAL_WORKFLOW_PHASES");
    expect(dashboards).toContain("incidentState.phase");
    expect(dashboards).toContain("incidentState.progressStatus");
  });

  it("uses only section landmarks supplied within route pages", () => {
    const shared = read("app/demonstration/shared-dashboard/page.tsx");
    const room = read("app/demonstration/monitoring-room/page.tsx");
    const workflow = read("app/demonstration/workflow/page.tsx");

    expect(shared).not.toContain("<main");
    expect(room).not.toContain("<main");
    expect(workflow).not.toContain("<main");
  });

  it("retains dedicated non-indexed demonstration routes", () => {
    const shared = read("app/demonstration/shared-dashboard/page.tsx");
    const room = read("app/demonstration/monitoring-room/page.tsx");
    const workflow = read("app/demonstration/workflow/page.tsx");

    expect(shared).toContain("index: false");
    expect(room).toContain("index: false");
    expect(workflow).toContain("index: false");
    expect(room).toContain("MonitoringRoomDisplay");
    expect(workflow).toContain("ProductDemonstration");
  });
});
