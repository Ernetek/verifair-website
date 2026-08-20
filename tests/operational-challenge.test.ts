import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "components/home/Problem.tsx"),
  "utf8",
);

describe("operational challenge", () => {
  it("uses the active dust image without fabricated hardware", () => {
    expect(source).toContain("/assets/problem-active-dust.webp");
    expect(source).not.toContain("/assets/problem-dust-monitoring.png");
  });

  it("uses the updated operational challenge framing", () => {
    expect(source).toContain("THE OPERATIONAL GAP");
    expect(source).toContain("Changing particulate conditions aren&apos;t always obvious.");
    expect(source).toContain("shared operational view of changing particulate conditions across every monitoring location");
    expect(source).toContain("NOT ALWAYS VISIBLE");
    expect(source).toContain("MULTIPLE LOCATIONS");
    expect(source).toContain("SHARED RESPONSE");
  });

  it("moves the detailed measurement limitation out of the visible observations", () => {
    expect(source).not.toContain("A reading does not identify the hazard");
    expect(source).not.toContain("do not determine personal exposure");
  });
});

