import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

describe("dashboard demonstrations", () => {
  it("keeps neutral labels and all supported PM metrics", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");

    expect(dashboards).toContain("Demonstration Project");
    expect(dashboards).toContain("Demonstration data");
    expect(dashboards).toContain('name: "Level 1 - Construction Site Entry Door"');
    expect(dashboards).toContain('name: "Level 1 - Construction Site Exit Door"');
    expect(dashboards).toContain('name: "Level 1 - Shared Corridor"');
    expect(dashboards).toContain('name: "Level 1 - General Entry Door"');
    expect(dashboards).toContain('label="PM1"');
    expect(dashboards).toContain('label="PM2.5"');
    expect(dashboards).toContain('label="PM10"');
    expect(dashboards).not.toMatch(/hospital|ward|contractor|customer deployment/i);
  });

  it("pauses timer-driven changes for reduced motion", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");
    expect(dashboards).toContain(
      'matchMedia("(prefers-reduced-motion: reduce)")',
    );
  });

  it("keeps the hero monitoring-room preview live and traffic-light coded", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");

    expect(dashboards).toContain("heroLiveFrames");
    expect(dashboards).toContain("<HeroMetricTile");
    expect(dashboards).toContain("zones.slice(0, 2)");
    expect(dashboards).toContain("Live demo updates");
    expect(dashboards).toContain("bg-emerald-600");
    expect(dashboards).toContain("bg-amber-400");
    expect(dashboards).toContain("bg-red-600");
  });


  it("models state-dependent workflow progress and response activity", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");

    expect(dashboards).toContain("workflowForState");
    expect(dashboards).toContain('status: "Not triggered"');
    expect(dashboards).toContain('status: "No action yet"');
    expect(dashboards).toContain('status: "Closed"');
    expect(dashboards).toContain("No response activity");
    expect(dashboards).toContain("Reviewed \u00b7 no action recorded");
    expect(dashboards).toContain("Completed example workflow");
  });

  it("shows PM10 plus horizontal warning/action limits and sustained trigger logic", () => {
    const dashboards = read("components/demonstration/ClinicalDashboards.tsx");

    expect(dashboards).toContain("Configured warning line");
    expect(dashboards).toContain("Configured action limit");
    expect(dashboards).toContain("DEMO_ACTION_DWELL_MINUTES = 10");
    expect(dashboards).toContain("min sustained above action limit");
    expect(dashboards).toContain('stroke="#7c3aed"');
    expect(dashboards).not.toContain("Example action indication");
  });

  it("uses only one main landmark supplied by the root layout", () => {
    const shared = read("app/demonstration/shared-dashboard/page.tsx");
    const room = read("app/demonstration/monitoring-room/page.tsx");

    expect(shared).not.toContain("<main");
    expect(room).not.toContain("<main");
    expect(shared).toContain("<section");
    expect(room).toContain("<section");
  });

  it("retains dedicated non-indexed demonstration routes", () => {
    const shared = read("app/demonstration/shared-dashboard/page.tsx");
    const room = read("app/demonstration/monitoring-room/page.tsx");

    expect(shared).toContain("index: false");
    expect(room).toContain("index: false");
  });
});

