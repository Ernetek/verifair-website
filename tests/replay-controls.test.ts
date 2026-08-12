import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "components/demonstration/ReplayControls.tsx"),
  "utf8",
);

describe("ReplayControls", () => {
  it("uses native labelled controls and exposes elapsed state text", () => {
    expect(source).toContain('aria-label="Demonstration playback controls"');
    expect(source).toContain('type="range"');
    expect(source).toContain('aria-label="Scenario position"');
    expect(source).toContain('aria-label="Playback speed"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("Previous step");
    expect(source).toContain("Next step");
  });

  it("emits controller intent without owning demonstration facts", () => {
    expect(source).toContain("controller.play()");
    expect(source).toContain("controller.pause()");
    expect(source).toContain("controller.restart()");
    expect(source).toContain("controller.seek(");
    expect(source).not.toMatch(/PM1|PM2\.5|PM4|PM10|incident|threshold/i);
  });
});
