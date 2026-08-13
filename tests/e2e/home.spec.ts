import { expect, test } from "@playwright/test";

test("primary navigation targets resolve and homepage anchors scroll", async ({
  page,
}) => {
  // Test hash navigation with proper isolation: Each hash test navigates
  // to homepage and awaits networkidle to ensure browser state fully settles
  // before attempting the next hash click. This avoids race conditions where
  // a pending hash transition could interrupt the next navigation.
  // Reusing a single page instance avoids resource contention under
  // concurrent testing (--workers=4 --repeat-each=10).
  const hashes: Array<"#monitoring" | "#workflow" | "#reportpreview"> = [
    "#monitoring",
    "#workflow",
    "#reportpreview",
  ];

  for (const hash of hashes) {
    // Use networkidle to ensure prior hash navigation fully settles
    // before attempting next homepage navigation.
    await page.goto("/", { waitUntil: "networkidle" });

    const link = page
      .locator(`a:visible[href="${hash}"], a:visible[href="/${hash}"]`)
      .first();

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      new RegExp("^(?:/)?" + hash + "$"),
    );

    await Promise.all([
      page.waitForURL(new RegExp(hash + "$")),
      link.click(),
    ]);

    await expect(page.locator(hash)).toBeVisible();
  }

  // Verify route availability independently of hash navigation tests.
  for (const href of ["/technology", "/resources", "/contact"]) {
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

test("industry tabs, platform reporting controls and FAQ are keyboard operable", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const healthcareTab = page.getByRole("tab", { name: /Healthcare/i });
  const constructionTab = page.getByRole("tab", { name: /Construction/i });

  if (await healthcareTab.isVisible()) {
    // Prove the client tab handlers are hydrated before exercising keyboard navigation.
    await constructionTab.click();
    await expect(constructionTab).toHaveAttribute("aria-selected", "true");

    await healthcareTab.click();
    await expect(healthcareTab).toHaveAttribute("aria-selected", "true");

    await healthcareTab.focus();
    await healthcareTab.press("ArrowRight");

    await expect(constructionTab).toHaveAttribute("aria-selected", "true");
    await expect(constructionTab).toBeFocused();
  }

  await page.goto("/#reportpreview", { waitUntil: "networkidle" });
  const reportSelect = page.getByLabel("Report view");
  await expect(reportSelect).toHaveValue("Summary report");
  await reportSelect.selectOption({ label: "Trend and event review" });
  await expect(reportSelect).toHaveValue("Trend and event review");
  await expect(
    page.getByText("Recent particulate trend", { exact: true }),
  ).toBeVisible();

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

test("legacy reporting route redirects to the homepage report preview", async ({
  page,
}) => {
  await page.goto("/reporting");
  await expect(page).toHaveURL(/\/#reportpreview$/);
  await expect(page.locator("#reportpreview")).toBeVisible();
});

test("mobile navigation closes with Escape and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: /Open navigation/i });
  await trigger.click();
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



