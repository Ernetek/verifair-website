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
    expect(source).toContain("A response needs more than a number");
    expect(source).toContain("who acknowledged it");
  });
});
