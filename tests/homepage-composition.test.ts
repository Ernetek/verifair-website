import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "app/page.tsx"),
  "utf8",
);

describe("homepage composition", () => {
  it("keeps canonical homepage metadata", () => {
    expect(source).toContain('canonical: "/"');
  });

  it("renders the monitoring room and reporting sections", () => {
    expect(source).toContain("<MonitoringRoomSection />");
    expect(source).toContain("<ReportingProof />");
    expect(source).not.toContain("<PageDisclaimer />");
  });

  it("does not restore the launch-stage deployment section", () => {
    expect(source).not.toContain("PilotDeploymentSection");
  });
});
