import { expect, test } from "@playwright/test";

test("homepage has primary conversion path and no horizontal overflow", async ({
  page,
}) => {
  await page.goto("/", {
    waitUntil: "networkidle",
  });

  const mainHeading = page.getByRole("heading", {
    level: 1,
  });

  await expect(mainHeading).toBeVisible();
  await expect(mainHeading).not.toHaveText("");

  const primaryCta = page
    .getByRole("link", {
      name: /book a free site assessment/i,
    })
    .first();

  await expect(primaryCta).toBeVisible();
  await expect(primaryCta).toHaveAttribute("href", /contact/);

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(
    dimensions.viewportWidth + 1,
  );
});
