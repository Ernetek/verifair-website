import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("dashboard demonstrations", () => {
  it("uses the shared dashboard inside the workflow", () => {
    const workflow = read("components/home/CoordinatedSolution.tsx");

    expect(workflow).toContain("SharedDashboardPreview");
    expect(workflow).not.toContain("next/image");
    expect(workflow).not.toContain("industry-healthcare-environment");
    expect(workflow).not.toContain("industry-construction-environment");
  });

  it("places the monitoring room display in its own homepage section", () => {
    const homepage = read("app/page.tsx");
    const section = read("components/home/MonitoringRoomSection.tsx");

    expect(homepage).toContain("<MonitoringRoomSection />");
    expect(section).toContain("Real-time monitoring");
    expect(section).toContain("MonitoringRoomPreview");
    expect(section).toContain("status colour");
  });

  it("keeps neutral demonstration labels", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");

    expect(dashboards).toContain("Demonstration Project");
    expect(dashboards).toContain("Demonstration data");
    expect(dashboards).toContain("Work Zone A");
    expect(dashboards).toContain("Occupied Interface");
    expect(dashboards).toContain("External Boundary");
    expect(dashboards).not.toMatch(/hospital|ward|contractor|customer deployment/i);
  });

  it("does not add demonstration routes to the primary navigation", () => {
    const site = read("lib/site.ts");

    expect(site).not.toContain("Shared dashboard demo");
    expect(site).not.toContain("Monitoring room demo");
  });

  it("retains dedicated non-indexed demonstration routes", () => {
    const shared = read("app/demonstration/shared-dashboard/page.tsx");
    const room = read("app/demonstration/monitoring-room/page.tsx");

    expect(shared).toContain("index: false");
    expect(room).toContain("index: false");
  });
});
