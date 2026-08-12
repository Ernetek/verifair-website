import { expect, test } from "@playwright/test";

test("approved demonstration keeps readings, timeline and controls synchronised", async ({
  page,
}) => {
  await page.goto("/demonstration/monitoring-room");
  await expect(page.getByTestId("product-demonstration")).toHaveAttribute(
    "data-hydrated",
    "true",
  );

  await expect(
    page.getByText("Simulated demonstration data", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Respirable dust" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^PM4(?:\.0)?$/i })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "PM1" }).locator("..").getByText("8 µg/m³", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Next step" }).click();
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("4:00 / 8:00", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Work reviewed and local controls checked", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "PM1" }).locator("..").getByText("22 µg/m³", { exact: true }),
  ).toBeVisible();

  await page.getByLabel("Select location").selectOption("OCCUPIED_INTERFACE");
  await expect(page.getByRole("heading", { name: "Occupied Interface" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "PM1" }).locator("..").getByText("7 µg/m³", { exact: true }),
  ).toBeVisible();
});

test("product demonstration has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/demonstration/shared-dashboard");
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
});
