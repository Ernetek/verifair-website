import { expect, test } from "@playwright/test";

test("homepage has primary conversion path and no horizontal overflow", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /dust conditions can change before teams can see the risk/i,
    }),
  ).toBeVisible();

  await expect(
    page
      .locator("a, button")
      .filter({ hasText: /book a free site assessment/i })
      .first(),
  ).toBeVisible();

  const viewport = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1);
});
