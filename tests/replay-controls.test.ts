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
    expect(source).toContain("Previous scenario marker");
    expect(source).toContain("Next scenario marker");
  });

  it("uses the production replay intent API without duplicating replay facts", () => {
    expect(source).toContain("session.play()");
    expect(source).toContain("session.pause()");
    expect(source).toContain("session.restart()");
    expect(source).toContain("session.seek(");
    expect(source).toContain("session.seekToMarker(");
    expect(source).toContain("session.setRate(");
    expect(source).not.toContain("_testOnly");
    expect(source).not.toMatch(/PM1|PM2\.5|PM4|PM10|threshold/i);
  });
});
