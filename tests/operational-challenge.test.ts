import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "components/home/Problem.tsx"),
  "utf8",
);

describe("operational challenge", () => {
  it("uses the active dust image", () => {
    expect(source).toContain("/assets/problem-active-dust.webp");
    expect(source).not.toContain("/assets/problem-dust-monitoring.png");
  });

  it("uses the approved operational challenge headline", () => {
    expect(source).toContain("You can’t respond to what you can’t see.");
  });

  it("frames the challenge around changing conditions, shared context and response", () => {
    expect(source).toContain("Work conditions do not remain static");
    expect(source).toContain("A reading does not identify the hazard");
    expect(source).toContain("respirable crystalline");
    expect(source).toContain("asbestos fibres");
    expect(source).toContain("a clear record of what happened next");
  });
});
