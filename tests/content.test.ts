import { describe, expect, it } from "vitest";
import { pageContent } from "../lib/content";

describe("public page content", () => {
  it("uses compliance-safe language", () => {
    const text = JSON.stringify(pageContent).toLowerCase();
    expect(text).not.toContain("guarantees compliance");
    expect(text).not.toContain("ensures compliance");
    expect(text).not.toContain("makes a project compliant");
  });

  it("includes all requested industry pages", () => {
    expect(Object.keys(pageContent)).toEqual(
      expect.arrayContaining(["healthcare", "construction", "infrastructure", "government", "schools", "commercial-buildings"])
    );
  });
});
