import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "components/home/HomepageInteractiveDemo.tsx"),
  "utf8",
);

describe("homepage interactive VerifAir demonstration", () => {
  it("uses one shared replay session and canonical event identity", () => {
    expect(source).toContain("new DemonstrationSession()");
    expect(source).toContain('const INCIDENT_ID = "VA-INC-2026-0042"');
    expect(source).toContain("selectLatestObservation");
    expect(source).toContain("Demonstration Healthcare Refurbishment");
  });

  it("keeps ASSESS as the default and exposes the three connected stages", () => {
    expect(source).toContain('useState<Stage>("ASSESS")');
    expect(source).toContain("01 ASSESS");
    expect(source).toContain("02 ACT");
    expect(source).toContain("03 RECORD");
    expect(source).toContain('stage === "ACT"');
    expect(source).toContain('stage === "RECORD"');
  });

  it("supports location selection, measurement switching and the shared wallboard", () => {
    expect(source).toContain("setSelectedId");
    expect(source).toContain("setMetricId");
    expect(source).toContain("setWallboard");
    expect(source).toContain('grid grid-cols-2 gap-2 ${wallboard ? "lg:grid-cols-2" : "lg:grid-cols-4"}');
    expect(source).toContain('wallboard ? "lg:grid-cols-2" : "lg:grid-cols-4"');
    expect(source).toContain('setWallboard(!wallboard)');
  });

  it("keeps the event ribbon, system health and disclosure in one frame", () => {
    expect(source).toContain("const ribbon =");
    expect(source).toContain("SYSTEM HEALTH · HEALTHY");
    expect(source).toContain("4/4 monitoring locations reporting");
    expect(source.match(/Demonstration only\. Sites, events, people and readings shown/g)?.length).toBe(1);
  });

  it("provides local ACT controls and compact RECORD links", () => {
    expect(source).toContain('dispatch("ACKNOWLEDGED")');
    expect(source).toContain('dispatch("ASSIGNED")');
    expect(source).toContain('dispatch("RESPONSE_RECORDED")');
    expect(source).toContain("VIEW EVENT RECORD");
    expect(source).toContain("VIEW GENERATED REPORT");
    expect(source).toContain("REPLAY EVENT");
  });
});
