import { expect, test } from "@playwright/test";

test("homepage has primary conversion path and no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Know the Air You Breathe/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Book demonstration/i }).first()).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
