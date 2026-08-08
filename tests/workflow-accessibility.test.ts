import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(path.join(process.cwd(), "components/home/PlatformOverview.tsx"), "utf8");

describe("workflow interaction", () => {
  it("separates automated system checks from the human response workflow", () => {
    expect(source).toContain("Automated system checks");
    expect(source).toContain("Detected");
    expect(source).toContain("Transferred");
    expect(source).toContain("Evaluated");
    expect(source).toContain("Human response workflow");
  });

  it("provides assignment, start, escalation, status and required closure reason controls", () => {
    expect(source).toContain("Assign task");
    expect(source).toContain("Start work");
    expect(source).toContain("Escalate");
    expect(source).toContain("Progress status");
    expect(source).toContain("Closure reason - required");
    expect(source).toContain("Resolve alert");
  });
});
