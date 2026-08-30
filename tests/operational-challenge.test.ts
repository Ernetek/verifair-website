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

  it("uses the approved monitoring-to-managed-response framing", () => {
    expect(source).toContain("MONITORING IS ONLY THE START");
    expect(source).toContain("The alert isn&apos;t the end of the job.");
    expect(source).toContain("Who saw it? Who took ownership?");
    expect(source).toContain("The monitor raises the alert");
    expect(source).toContain("The operational gap");
    expect(source).toContain("VerifAir manages the response");
    expect(source).toContain("ACKNOWLEDGED");
    expect(source).toContain("OWNERSHIP ASSIGNED");
    expect(source).toContain("INVESTIGATION RECORDED");
    expect(source).toContain("ACTION RECORDED");
    expect(source).toContain("EVENT CLOSED");
    expect(source).toContain("COMPLETE EVENT RECORD");
    expect(source).toContain('href="#monitoring"');
  });

  it("moves the detailed measurement limitation out of the visible observations", () => {
    expect(source).not.toContain("A reading does not identify the hazard");
    expect(source).not.toContain("do not determine personal exposure");
  });
});
