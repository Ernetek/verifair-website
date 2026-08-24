import { test, expect } from "@playwright/test";

const publicRoutes = [
  ["/", /See changing particulate conditions across multiple monitoring locations\./i],
  ["/monitoring", /Visibility across every\s*monitoring location\./i],
  ["/workflow", /From changing conditions to coordinated action\./i],
  ["/reporting", /Turn operational activity into a connected record\./i],
] as const;

for (const [route, heading] of publicRoutes) {
  test(`renders ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
  });
}

test("monitoring page uses the Control Centre location drill-in", async ({ page }) => {
  await page.goto("/monitoring#control-centre", { waitUntil: "networkidle" });

  const card = page.getByTestId("homepage-monitoring-location-WORK_ZONE_A");
  // Just verify the card itself is visible before clicking; the specific status label varies by demo start state.
  await expect(card).toBeVisible();
  await card.click();

  const dialog = page.getByRole("dialog", { name: "Zone A · Monitoring Location 1" });
  await expect(dialog).toBeVisible();
  // The action button in the dialog is either "START WORK" (fresh incident) or "OPEN EVENTS WORKSPACE".
  const actionBtn = dialog.getByRole("button", { name: /START WORK|OPEN EVENTS WORKSPACE/i });
  await actionBtn.scrollIntoViewIfNeeded();
  await expect(actionBtn).toBeVisible();
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
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth);
  });
}
