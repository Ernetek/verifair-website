import { expect, test } from "@playwright/test";

test("primary navigation destinations resolve and homepage calls to action are wired", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const seeHowLink = page.getByRole("link", { name: /See VerifAir in Action/i }).first();
  await expect(seeHowLink).toBeVisible();
  await expect(seeHowLink).toHaveAttribute("href", "/#monitoring");

  const contactLink = page.getByRole("link", { name: /Discuss Your Project/i }).first();
  await expect(contactLink).toBeVisible();
  await expect(contactLink).toHaveAttribute("href", /\/contact(?:#project-enquiry)?$/);

  for (const href of [
    "/product",
    "/how-it-works",
    "/solutions",
    "/resources",
    "/about",
    "/demonstration",
    "/technology",
    "/contact",
  ]) {
    const response = await page.request.get(href, { timeout: 60000 });
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

test("industry cards and FAQ are keyboard operable", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Healthcare", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Construction", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Infrastructure", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Government", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Schools", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Commercial Buildings", exact: true })).toBeVisible();

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

test("reporting is a standalone page with the connected record heading", async ({
  page,
}) => {
  await page.goto("/reporting");
  await expect(page).toHaveURL(/\/reporting$/);
  await expect(
    page.getByRole("heading", { name: /Turn operational activity into a connected record\./i }),
  ).toBeVisible();
});

test("mobile navigation closes with Escape and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: /Open navigation/i });
  await expect(trigger).toBeVisible({ timeout: 10000 });
  await expect(trigger).toBeEnabled();
  await trigger.click();
  await expect(page.locator("#mobile-navigation")).toBeAttached({ timeout: 10000 });
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-navigation")).toBeHidden();
  await expect(trigger).toBeFocused();
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
