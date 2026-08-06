import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "components/home/CoordinatedSolution.tsx"),
  "utf8",
);

describe("workflow accessibility hooks", () => {
  it("keeps each workflow stage keyboard focusable and discoverable by e2e tests", () => {
    expect(source).toContain("data-workflow-stage={index}");
    expect(source).toContain("tabIndex={0}");
  });
});
