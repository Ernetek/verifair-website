import { test, expect } from "@playwright/test";

const publicRoutes = [
  ["/", /See changing particulate conditions\. Act before they become bigger problems\./i],
  ["/monitoring", /Visibility across every\s*monitoring location\./i],
  ["/workflow", /From changing conditions to coordinated action\./i],
  ["/reporting", /Turn operational activity into a connected record\./i]
] as const;

for (const [route, heading] of publicRoutes) {
  test(`renders ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
  });
}

test("monitoring page uses the Control Centre location drill-in", async ({ page }) => {
  await page.goto("/monitoring#control-centre", { waitUntil: "networkidle" });

  const card = page.getByTestId("monitoring-location-WORK_ZONE_A");
  await expect(card).toBeVisible();
  await card.click();

  const detail = page.getByRole("article", { name: "Monitoring Location 1" });
  await expect(detail).toBeVisible();
  await expect(detail.getByText("Current observations")).toBeVisible();
  await expect(detail.getByText("Historical trend")).toBeVisible();
  await expect(detail.getByText("Dustlight device status")).toBeVisible();
  await expect(detail.getByText("Observation freshness")).toBeVisible();
  await detail.getByRole("button", { name: "PM2.5" }).click();
  await expect(detail.getByRole("img", { name: /PM2\.5 historical trend/i })).toBeVisible();

  await expect(page.getByRole("button", { name: "START WORK" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "OPEN EVENTS WORKSPACE" })).toHaveCount(0);
  await expect(page.getByText("Selected report preview")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "VIEW GENERATED REPORT" })).toHaveCount(0);
});

test("reporting page filters the report register and updates its preview", async ({ page }) => {
  await page.goto("/reporting#record-centre", { waitUntil: "networkidle" });

  await page.getByLabel("Where it is").selectOption("All monitoring locations");
  await expect(page.getByRole("article", { name: "Selected report preview" })).toContainText("Daily monitoring summary");
  await expect(page.getByRole("button", { name: "Export" })).toBeDisabled();
  await expect(page.getByText("Demo preview only — no file is generated.")).toBeVisible();
});

test("health endpoint reports the running application build identity without caching", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = await response.json();

  expect(response.ok()).toBe(true);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(body.status).toBe("ok");
  expect(body.service).toBe("verifair-public-website");
  expect(body.buildSha).toEqual(expect.any(String));
});

test("workflow page starts work in the Events workspace", async ({ page }) => {
  await page.goto("/workflow#workflow-events-demo", { waitUntil: "networkidle" });

  const workspace = page.getByTestId("workflow-events-demo");
  const startBtn = workspace.getByRole("button", { name: "START WORK" });
  await startBtn.scrollIntoViewIfNeeded();
  await startBtn.click();
  // After startWork the investigation form fields become enabled.
  await expect(workspace.getByLabel("Observed conditions")).toBeEnabled();
  await expect(workspace.getByLabel("Action taken")).toBeEnabled();
});

for (const route of ["/monitoring", "/reporting", "/workflow"]) {
  test(`${route} Control Centre workspace has no mobile overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: "networkidle" });

    const widths = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth);
  });
}

for (const width of [375, 390, 430, 768, 1024, 1440]) {
  test(`monitoring page has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/monitoring", { waitUntil: "networkidle" });

    const widths = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth);
  });
}
