import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "components/home/Problem.tsx"),
  "utf8",
);

describe("operational challenge", () => {
  it("uses the approved healthcare image without fabricated hardware imagery", () => {
    expect(source).toContain("/assets/landing-hero.webp");
    expect(source).not.toContain("/assets/problem-dust-monitoring.png");
  });

  it("uses the approved monitoring-to-managed-response framing with the canonical replay scenario", () => {
    expect(source).toContain("MONITORING IS ONLY THE START");
    expect(source).toContain("The alert isn&apos;t the end of the job.");
    expect(source).toContain("Who saw it? Who took ownership?");
    expect(source).toContain("The monitor raises the alert");
    expect(source).toContain("The operational gap");
    expect(source).toContain("VerifAir manages the response");
    expect(source).toContain("publicDemonstrationScenario");
    expect(source).toContain("SIMULATED DEMONSTRATION DATA");
    expect(source).toContain("ALERT TRIGGERED");
    expect(source).toContain("ACTION RECORDED");
    expect(source).toContain("FOLLOW-UP RETAINED");
    expect(source).toContain("EVENT CLOSED");
    expect(source).toContain("VALIDATED EVENT RECORD");
    expect(source).not.toContain("ACKNOWLEDGED");
    expect(source).not.toContain("OWNERSHIP ASSIGNED");
    expect(source).not.toContain("INVESTIGATION RECORDED");
    expect(source).not.toContain("Today");
    expect(source).not.toContain("156");
    expect(source).toContain('href="#monitoring"');
  });

  it("moves the detailed measurement limitation out of the visible observations", () => {
    expect(source).not.toContain("A reading does not identify the hazard");
    expect(source).not.toContain("do not determine personal exposure");
  });
});
