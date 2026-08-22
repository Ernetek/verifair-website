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
