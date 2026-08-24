import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("deployment health contract", () => {
  it("returns an uncached application health response with build identity", async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(body).toEqual({
      status: "ok",
      service: "verifair-public-website",
      buildSha: expect.any(String),
    });
  });

  it("blocks production acceptance until the live endpoint serves the deployed SHA", () => {
    const workflow = fs.readFileSync(
      path.join(process.cwd(), ".github/workflows/ci.yml"),
      "utf8",
    );

    expect(workflow).toContain("NEXT_PUBLIC_BUILD_SHA: ${{ github.sha }}");
    expect(workflow).toContain("https://verifair.com.au/api/health");
    expect(workflow).toContain("body.buildSha !== process.env.EXPECTED_SHA");
  });
});
