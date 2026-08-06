import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "components/home/ReportingProof.tsx"),
  "utf8",
);

describe("homepage reporting proof", () => {
  it("uses concrete example response actions", () => {
    expect(source).toContain("Stopped dry sweeping");
    expect(source).toContain("vacuum-assisted cleanup");
  });

  it("shows a structured report and event chronology", () => {
    expect(source).toContain("Project-period monitoring report");
    expect(source).toContain("From detection to closure");
    expect(source).toContain("Included in the export");
  });

  it("clearly labels demonstration data", () => {
    expect(source).toContain("Demonstration data");
    expect(source).toContain("fictional demonstration data");
  });
});
