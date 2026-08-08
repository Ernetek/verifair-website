import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(path.join(process.cwd(), "app/page.tsx"), "utf8");

describe("homepage composition", () => {
  it("keeps canonical homepage metadata", () => {
    expect(source).toContain('canonical: "/"');
  });

  it("uses one platform overview instead of separate workflow and reporting sections", () => {
    expect(source).toContain("<PlatformOverviewSection />");
    expect(source).not.toContain("<CoordinatedSolutionSection />");
    expect(source).not.toContain("<ReportingProof />");
    expect(source).toContain("<PilotDeploymentSection />");
    expect(source).toContain("<PageDisclaimer />");
  });
});
