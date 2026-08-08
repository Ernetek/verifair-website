import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(path.join(process.cwd(), "components/home/PlatformOverview.tsx"), "utf8");

describe("homepage reporting preview", () => {
  it("defaults to a manual summary report with a last-seven-days range", () => {
    expect(source).toContain('useState<ReportView>("Summary report")');
    expect(source).toContain('useState<DateRange>("Last 7 days")');
    expect(source).not.toContain("setViewIndex");
  });

  it("includes requested summary metrics", () => {
    expect(source).toContain("Avg PM1");
    expect(source).toContain("Avg PM2.5");
    expect(source).toContain("Avg PM10");
    expect(source).toContain("Highest recorded");
    expect(source).toContain("Longest duration");
    expect(source).toContain("Warnings");
    expect(source).toContain("Actions");
    expect(source).toContain("Downtime");
  });
});
