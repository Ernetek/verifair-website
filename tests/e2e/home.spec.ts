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
      .locator("a:visible, button:visible")
      .filter({ hasText: /book a free site assessment/i })
      .first(),
  ).toBeVisible();

  const overflowReport = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const documentWidth = document.documentElement.scrollWidth;

    const offenders = Array.from(
      document.querySelectorAll<HTMLElement>("body *"),
    )
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className:
            typeof element.className === "string" ? element.className : "",
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 100),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          scrollWidth: element.scrollWidth,
        };
      })
      .filter(
        (element) =>
          element.right > viewportWidth + 1 ||
          element.left < -1 ||
          element.scrollWidth > Math.ceil(element.width) + 1,
      )
      .sort(
        (a, b) =>
          Math.max(
            b.right - viewportWidth,
            b.scrollWidth - b.width,
          ) -
          Math.max(
            a.right - viewportWidth,
            a.scrollWidth - a.width,
          ),
      )
      .slice(0, 30);

    return { viewportWidth, documentWidth, offenders };
  });

  if (overflowReport.documentWidth > overflowReport.viewportWidth + 1) {
    console.log("Horizontal overflow report:");
    console.log(JSON.stringify(overflowReport, null, 2));
  }

  expect(overflowReport.documentWidth).toBeLessThanOrEqual(
    overflowReport.viewportWidth + 1,
  );
});
