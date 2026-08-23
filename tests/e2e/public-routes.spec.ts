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
  await expect(card.getByLabel("ACTION")).toBeVisible();
  await card.click();

  const dialog = page.getByRole("dialog", { name: "Zone A · Monitoring Location 1" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "START WORK" })).toBeVisible();
});

test("reporting page filters the report register and updates its preview", async ({ page }) => {
  await page.goto("/reporting#record-centre", { waitUntil: "networkidle" });

  await page.getByLabel("Report type").selectOption("Evidence register");
  await expect(page.getByText("1 reports", { exact: true })).toBeVisible();
  await expect(page.getByRole("article", { name: "Selected report preview" })).toContainText("Evidence register");
  await expect(page.getByRole("link", { name: "Open reporting centre" })).toHaveCount(0);
});

test("workflow page starts work in the Events workspace", async ({ page }) => {
  await page.goto("/workflow#incident-centre", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "START WORK" }).click();
  await expect(page.getByLabel("Workflow status")).toHaveValue("In progress");
  await expect(page.getByLabel("Observed conditions")).toBeEnabled();
  await expect(page.getByLabel("Action taken")).toBeEnabled();
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
