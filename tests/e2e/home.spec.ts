import { expect, test } from "@playwright/test";

test("primary navigation targets resolve and homepage anchors scroll", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const platformLink = page
    .locator('a:visible[href="#platform"], a:visible[href="/#platform"]')
    .first();

  await expect(platformLink).toHaveAttribute("href", /^(?:\/)?#platform$/);
  await platformLink.click();
  await expect(page).toHaveURL(/#platform$/);
  await expect(page.locator("#platform")).toBeVisible();

  for (const href of ["/technology", "/reporting", "/resources", "/contact"]) {
    const response = await page.request.get(href);
    expect(response.ok(), `${href} should resolve`).toBe(true);
  }
});

test("homepage has no horizontal overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/", { waitUntil: "networkidle" });

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(
    dimensions.viewportWidth + 1,
  );
});

test("workflow, industry tabs and FAQ are keyboard operable", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const stage = page.locator("[data-workflow-stage]").first();
  await stage.focus();
  await expect(stage).toBeFocused();

  const industryTab = page.getByRole("tab").first();
  if (await industryTab.isVisible()) {
    await industryTab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { selected: true })).toHaveText(
      /Construction/i,
    );
  }

  const faqSummary = page.locator("#faq details summary").first();
  const faqDetails = faqSummary.locator("..");

  await faqSummary.focus();
  await expect(faqSummary).toBeFocused();

  await faqSummary.press("Enter");

  if (!(await faqDetails.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await faqSummary.press("Space");
  }

  await expect
    .poll(() =>
      faqDetails.evaluate((element) => (element as HTMLDetailsElement).open),
    )
    .toBe(true);
});

test("reduced motion disables smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const behavior = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  );

  expect(behavior).toBe("auto");
});

test("HubSpot failure state provides hosted-form fallback", async ({ page }) => {
  await page.route("https://js-ap1.hsforms.net/**", (route) => route.abort());
  await page.goto("/contact");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByText("The enquiry form could not be loaded."),
  ).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByRole("link", { name: /open the enquiry form/i }),
  ).toHaveAttribute("href", /share-ap1\.hsforms\.com/);
});
