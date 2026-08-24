import { expect, test } from "@playwright/test";

test("primary navigation destinations resolve and homepage calls to action are wired", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const seeHowLink = page.getByRole("link", { name: /See VerifAir in Action/i }).first();
  await expect(seeHowLink).toBeVisible();
  await expect(seeHowLink).toHaveAttribute("href", "/#monitoring");

  const contactLink = page.getByRole("link", { name: /Discuss Your Project/i }).first();
  await expect(contactLink).toBeVisible();
  await expect(contactLink).toHaveAttribute("href", /\/contact(?:#project-enquiry)?$/);

  for (const href of ["/product", "/how-it-works", "/solutions", "/resources", "/about", "/demonstration", "/technology", "/contact"]) {
    const response = await page.request.get(href, { timeout: 60000 });
    expect(response.ok(), `${href} should resolve`).toBe(true);
  }
});

for (const viewport of [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
]) {
  test(`homepage hero geometry is contained at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });

    const hero = page.locator("main > section").first();
    const headline = hero.getByRole("heading", { level: 1 });
    const controls = hero.getByRole("link");
    const geometry = await page.evaluate(() => {
      const heroElement = document.querySelector("main > section");
      const headlineElement = heroElement?.querySelector("h1");
      const controlElements = [...(heroElement?.querySelectorAll("a, button") ?? [])];
      const box = (element: Element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left };
      };

      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        hero: heroElement ? box(heroElement) : null,
        headline: headlineElement ? box(headlineElement) : null,
        controls: controlElements.map(box),
      };
    });

    await expect(hero).toBeVisible();
    await expect(headline).toBeVisible();
    await expect(controls).toHaveCount(2);
    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(geometry.hero).not.toBeNull();
    expect(geometry.headline).not.toBeNull();
    expect(geometry.headline!.top).toBeGreaterThanOrEqual(geometry.hero!.top);
    expect(geometry.headline!.bottom).toBeLessThanOrEqual(geometry.hero!.bottom);
    expect(geometry.hero!.bottom - geometry.hero!.top).toBeLessThanOrEqual(viewport.height);
    for (const control of geometry.controls) {
      const intersectsHeadline =
        control.left < geometry.headline!.right &&
        control.right > geometry.headline!.left &&
        control.top < geometry.headline!.bottom &&
        control.bottom > geometry.headline!.top;
      expect(intersectsHeadline).toBe(false);
    }
  });
}

test("capability rail advances automatically and pauses on hover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const carousel = page.getByRole("region", { name: "VerifAir capabilities" });
  const rail = carousel.getByLabel("Scrollable capability cards");
  await carousel.scrollIntoViewIfNeeded();

  const fullyVisibleCards = await rail.evaluate((element) => {
    const railBox = element.getBoundingClientRect();
    return [...element.querySelectorAll("[data-capability-card]")].filter((card) => {
      const cardBox = card.getBoundingClientRect();
      return cardBox.left >= railBox.left && cardBox.right <= railBox.right;
    }).length;
  });
  expect(fullyVisibleCards).toBeGreaterThanOrEqual(3);
  expect(fullyVisibleCards).toBeLessThanOrEqual(4);

  const initialScroll = await rail.evaluate((element) => element.scrollLeft);
  await expect.poll(() => rail.evaluate((element) => element.scrollLeft), { timeout: 12_000 }).toBeGreaterThan(initialScroll + 100);

  await carousel.hover();
  await page.waitForTimeout(700);
  const pausedScroll = await rail.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(5_000);
  expect(Math.abs((await rail.evaluate((element) => element.scrollLeft)) - pausedScroll)).toBeLessThanOrEqual(1);
});

test("capability rail disables automatic motion but retains manual navigation with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const carousel = page.getByRole("region", { name: "VerifAir capabilities" });
  const rail = carousel.getByLabel("Scrollable capability cards");
  await carousel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const initialScroll = await rail.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(500);
  expect(Math.abs((await rail.evaluate((element) => element.scrollLeft)) - initialScroll)).toBeLessThanOrEqual(1);

  await carousel.getByRole("button", { name: "Next capability" }).click();
  await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialScroll + 100);
});

test("capability rail exposes one card plus a continuation cue on mobile without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  // The homepage now has two capability card rails (CapabilitiesSection + A complete operational section).
  // Target the one inside the "VerifAir capabilities" region specifically.
  const rail = page.getByRole("region", { name: "VerifAir capabilities" }).getByLabel("Scrollable capability cards");
  await rail.scrollIntoViewIfNeeded();
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);

  const visibleCards = await rail.evaluate((element) => {
    const railBox = element.getBoundingClientRect();
    return [...element.querySelectorAll("[data-capability-card]")].filter((card) => {
      const cardBox = card.getBoundingClientRect();
      return cardBox.right > railBox.left && cardBox.left < railBox.right;
    }).length;
  });
  expect(visibleCards).toBe(2);
});

test("industry accordion opens with Healthcare and switches one panel at a time", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const industries = page.getByLabel("Industries VerifAir serves");
  const healthcare = industries.getByRole("button", { name: /Healthcare/ });
  const construction = industries.getByRole("button", { name: /Construction/ });
  await industries.scrollIntoViewIfNeeded();

  await expect(healthcare).toHaveAttribute("aria-expanded", "true");
  await expect(industries.getByRole("region", { name: "Healthcare industry details" })).toBeVisible();
  await expect(page.getByAltText("Construction workers operating inside a hospital beside an occupied clinical corridor")).toBeVisible();

  await construction.focus();
  await construction.press("Enter");
  await expect(construction).toHaveAttribute("aria-expanded", "true");
  await expect(healthcare).toHaveAttribute("aria-expanded", "false");
  await expect(industries.getByRole("region", { name: "Healthcare industry details" })).toHaveCount(0);
  await expect(industries.getByRole("region", { name: "Construction industry details" })).toBeVisible();
  await expect(page.getByAltText("Active construction work front on a project site")).toBeVisible();

  const textBox = await industries.boundingBox();
  const imageBox = await page.getByAltText("Active construction work front on a project site").boundingBox();
  expect(imageBox?.x).toBeGreaterThan((textBox?.x ?? 0) + 300);
});

test("industry accordion stacks cleanly on mobile without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const industries = page.getByLabel("Industries VerifAir serves");
  await industries.scrollIntoViewIfNeeded();
  await industries.getByRole("button", { name: /Schools/ }).click();
  await expect(industries.getByRole("region", { name: "Schools industry details" })).toBeVisible();
  await expect(page.getByAltText("Students walking through an occupied school corridor beside external works")).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
});

test("Control Centre keeps environmental recovery independent from explicit event resolution", async ({ page }) => {
  await page.goto("/");

  const controlCentre = page.locator("#monitoring");

  await expect(controlCentre).toBeVisible();

  await controlCentre.getByRole("button", { name: "START DEMO" }).click();
  await expect(controlCentre.getByRole("button", { name: "COMPLETE ATTENTION REVIEW" })).toHaveCount(0);
  await controlCentre.getByRole("button", { name: "OPEN RAISED EVENT" }).click();
  await expect(
    controlCentre.getByRole("heading", {
      name: "Operational event response",
      exact: true
    })
  ).toBeVisible();
  await expect(controlCentre.getByText("Respirable Dust action condition", { exact: true }).first()).toBeVisible();
  await controlCentre.getByRole("button", { name: "START WORK" }).click();
  await expect(controlCentre.getByLabel("Response type")).toBeEnabled();
  await expect(controlCentre.getByLabel("Observed conditions")).toBeEnabled();
  await expect(controlCentre.getByLabel("Action taken")).toBeEnabled();
  await expect(controlCentre.getByLabel("Group")).toBeEnabled();
  await expect(controlCentre.getByLabel("Assignee")).toBeEnabled();
  await expect(controlCentre.getByLabel("Priority")).toBeEnabled();
  await controlCentre.getByLabel("Response type").selectOption("Site inspection");
  await controlCentre.getByLabel("Observed conditions").selectOption("Elevated dust visible in work zone");
  await controlCentre.getByLabel("Action taken").selectOption("Stopped work and assessed area");
  await controlCentre.getByLabel("Group").selectOption("site_response");
  await expect(controlCentre.getByLabel("Assignee")).toHaveValue("Project manager");
  await controlCentre.getByLabel("Assignee").selectOption("Facilities coordinator");
  await controlCentre.getByRole("button", { name: "Save work log" }).click();
  await expect(controlCentre.getByRole("status")).toHaveText("Work log saved to the incident record.");
  await expect(controlCentre.getByText("Operational work log", { exact: true })).toBeVisible();
  await expect(controlCentre.getByText("Observed: Elevated dust visible in work zone. Action: Stopped work and assessed area.", { exact: true })).toBeVisible();
  await controlCentre.getByRole("button", { name: "Reports" }).click();
  await expect(controlCentre.getByText("Saved ticket work log", { exact: true }).first()).toBeVisible();
  await expect(controlCentre.getByText("Observed: Elevated dust visible in work zone. Action: Stopped work and assessed area.", { exact: true })).toBeVisible();
  await expect(controlCentre.getByText("Saved by Facilities coordinator", { exact: true })).toBeVisible();
  await controlCentre.getByRole("button", { name: "Incidents and alerts" }).click();
  await controlCentre.getByRole("button", { name: "Monitoring overview" }).click();
  await controlCentre.getByRole("button", { name: "COMPLETE MONITORING PERIOD" }).click();
  await expect(
    controlCentre.getByText("Condition returned to normal", {
      exact: true
    })
  ).toBeVisible();
  await expect(
    controlCentre.getByTestId("homepage-monitoring-location-WORK_ZONE_A").getByLabel("ACTION history, current state HEALTHY")
  ).toBeVisible();
  await controlCentre.getByRole("button", { name: "Incidents and alerts" }).click();
  await expect(controlCentre.getByText("In progress", { exact: true }).first()).toBeVisible();
  await controlCentre.getByRole("button", { name: "Monitoring overview" }).click();
  await expect(controlCentre.getByRole("button", { name: "OPEN RECORD" })).toHaveCount(0);
});

test("demo header and compact instructions remain above the full-width Control Centre", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const demo = page.locator("#monitoring");
  const guide = demo.getByLabel("Demonstration guide");
  const logo = demo.getByAltText("VerifAir by ERNE Tech");
  const project = demo.getByText("Demonstration Healthcare Construction Project", { exact: true });
  const controlCentre = demo.getByText("Particulate Monitoring & Task Management", { exact: true });

  await expect(demo.getByRole("heading", { name: "See the VerifAir particulate monitoring and task management workspace in action." })).toBeVisible();
  await expect(demo.getByText(/AEST|AEDT/)).toBeVisible();
  await expect(guide).toBeVisible();

  const [logoBox, projectBox, controlBox, guideBox] = await Promise.all([
    logo.boundingBox(),
    project.boundingBox(),
    controlCentre.boundingBox(),
    guide.boundingBox()
  ]);
  expect(logoBox?.width).toBeLessThanOrEqual(111);
  expect(controlBox?.x).toBeLessThanOrEqual(projectBox?.x ?? 0);

  const boardBox = await guide.evaluate((element) => {
    const box = element.nextElementSibling?.getBoundingClientRect();
    return box ? { top: box.top, width: box.width } : null;
  });
  expect((guideBox?.y ?? Number.POSITIVE_INFINITY) + (guideBox?.height ?? 0)).toBeLessThanOrEqual(
    boardBox?.top ?? Number.NEGATIVE_INFINITY
  );
  expect(boardBox?.width).toBeGreaterThan(950);
});

test("demo uses four-reading zone cards, status rails and operational colour guidance", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  const demo = page.locator("#monitoring");
  const workZone = demo.getByTestId("homepage-monitoring-location-WORK_ZONE_A");
  await expect(workZone.getByText("Zone A", { exact: true })).toBeVisible();
  await expect(workZone.getByText("Monitoring Location 1", { exact: true })).toBeVisible();
  for (const metric of ["RESPIRABLE DUST", "PM1", "PM2.5", "PM10"]) {
    await expect(workZone.getByText(metric, { exact: true })).toBeVisible();
  }
  const baselineTrendPoints = await demo
    .getByLabel("Monitoring overview")
    .locator("svg polyline")
    .evaluateAll((lines) =>
      lines.map((line) => new Set((line.getAttribute("points") ?? "").split(" ").map((point) => point.split(",")[1])).size)
    );
  expect(baselineTrendPoints.every((distinctValues) => distinctValues > 2)).toBe(true);
  await workZone.click();
  await expect(demo.getByRole("dialog", { name: "Zone A · Monitoring Location 1" })).toBeVisible();
  await demo.getByRole("button", { name: "Close location details" }).click();
  await expect(demo.getByRole("button", { name: "COMPLETE BASELINE CHECK" })).toHaveCount(0);
  await expect(demo.getByRole("heading", { name: "Particulate / operational state" })).toBeVisible();
  await expect(demo.getByRole("heading", { name: "System / data health" })).toBeVisible();
  const applicationNavigation = demo.getByRole("navigation", { name: "Control Centre sections" });
  await expect(applicationNavigation.getByRole("button", { name: "Monitoring overview" })).toBeVisible();
  await expect(applicationNavigation.getByRole("button", { name: "Trends" })).toBeVisible();
  const reportsButton = applicationNavigation.getByRole("button", {
    name: "Reports"
  });

  await expect(reportsButton).toBeVisible();
  await reportsButton.scrollIntoViewIfNeeded();
  await reportsButton.click();

  await expect(
    demo.getByRole("heading", {
      name: "Reports",
      exact: true
    })
  ).toBeVisible();

  await expect(demo.getByText("Find, review and generate connected operational reports.")).toBeVisible();

  await expect(demo.getByText("8 reports", { exact: true })).toBeVisible();
  await demo.getByLabel("Report type").selectOption("Evidence register");
  await expect(demo.getByText("1 reports", { exact: true })).toBeVisible();
  await expect(demo.getByRole("article", { name: "Selected report preview" })).toContainText("Evidence register");
  await demo.getByLabel("Search reports").fill("no matching report");
  await expect(demo.getByText("No reports match those filters.")).toBeVisible();
  await demo.getByLabel("Search reports").fill("");

  await expect(
    demo.getByRole("link", {
      name: "Open reporting centre"
    })
  ).toHaveAttribute("href", "/reporting");
  await expect(applicationNavigation.getByRole("button", { name: "Incidents and alerts" })).toBeVisible();
  await applicationNavigation.getByRole("button", { name: "System health" }).click();
  await expect(demo.getByRole("heading", { name: "Health", exact: true })).toBeVisible();
  await expect(demo.getByRole("heading", { name: "Site overview" })).toBeVisible();
  await expect(demo.getByText("4/4 sensors online · 4/4 monitoring locations reporting · Gateway online")).toBeVisible();
  const healthZone = demo.getByLabel("Zone", { exact: true });
  const healthHardware = demo.getByLabel("Hardware", { exact: true });
  await expect(healthZone).toHaveValue("");
  await expect(healthHardware).toBeDisabled();
  await expect(demo.getByLabel("Selected asset health details")).toContainText("Monitored zones");
  await expect(demo.getByLabel("Selected asset health details")).toContainText("1 of 1");
  await expect(demo.getByLabel("Selected asset health details")).toContainText("4 of 4");
  await healthZone.selectOption("ZONE_A");
  await expect(healthHardware).toBeEnabled();
  await expect(healthHardware).toHaveValue("");
  await healthHardware.selectOption("WORK_ZONE_A");
  await expect(demo.getByLabel("Selected asset health details")).toContainText("VFA-PM-DEMO-101");
  await expect(demo.getByLabel("Selected asset health details")).toContainText("94%");
  await expect(demo.getByText("Next calibration", { exact: true })).toHaveCount(1);
  await expect(demo.getByText("LIVE DAILY TREND", { exact: true })).toHaveCount(0);
  await applicationNavigation.getByRole("button", { name: "Trends" }).focus();
  await page.keyboard.press("Enter");
  await expect(demo.getByRole("heading", { name: "Trends", exact: true })).toBeVisible();
  await expect(demo.getByRole("dialog")).toHaveCount(0);
  await expect(demo.getByLabel("Monitoring location")).toHaveValue("WORK_ZONE_A");
  await applicationNavigation.getByRole("button", { name: "Monitoring overview" }).dispatchEvent("click");
  await expect(demo.getByRole("heading", { name: "Monitoring", exact: true })).toBeVisible();
  await expect(demo.getByText("Below configured attention level", { exact: true })).toBeVisible();
  await expect(demo.getByText("Configured attention level reached", { exact: true })).toBeVisible();
  await expect(demo.getByText("Configured action level reached", { exact: true })).toBeVisible();
  await expect(demo.getByText("Monitoring available with a system or connectivity issue", { exact: true })).toBeVisible();
  await expect(demo.getByText("Current observation not received within freshness window", { exact: true })).toBeVisible();

  await demo.getByRole("button", { name: "START DEMO" }).dispatchEvent("click");
  const exception = demo.getByTestId("homepage-monitoring-location-WORK_ZONE_A");
  await expect(exception).toBeVisible();
  await expect(exception).toHaveClass(/border-t-red-500/);
  await expect(exception).toHaveClass(/border-l-red-500/);
  await expect(exception.getByRole("img", { name: "Zone A Monitoring Location 1 respirable dust recent trend" })).toBeVisible();
  await expect(demo.getByLabel("Monitoring overview").locator("[data-testid^='homepage-monitoring-location-']")).toHaveCount(4);

  await page.setViewportSize({ width: 390, height: 844 });
  await demo.getByLabel("Monitoring overview").locator("[data-testid^='homepage-monitoring-location-']").nth(2).scrollIntoViewIfNeeded();
  const headerBox = await page.getByRole("banner").boundingBox();
  const healthButtonBox = await applicationNavigation.getByRole("button", { name: "System health" }).boundingBox();
  expect(healthButtonBox?.y).toBeGreaterThanOrEqual((headerBox?.y ?? 0) + (headerBox?.height ?? 0));
  expect((healthButtonBox?.y ?? Number.POSITIVE_INFINITY) + (healthButtonBox?.height ?? 0)).toBeLessThanOrEqual(844);

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
});

test("industry accordion and FAQ are keyboard operable", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const industries = page.getByLabel("Industries VerifAir serves");
  const government = industries.getByRole("button", { name: /Government/ });
  await government.focus();
  await expect(government).toBeFocused();
  await government.press("Space");
  await expect(government).toHaveAttribute("aria-expanded", "true");
  await expect(industries.getByRole("region", { name: "Government industry details" })).toBeVisible();

  const faqSummary = page.locator("#faq details summary").first();
  const faqDetails = faqSummary.locator("..");

  await faqSummary.focus();
  await expect(faqSummary).toBeFocused();
  await faqSummary.press("Enter");

  if (!(await faqDetails.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await faqSummary.press("Space");
  }

  await expect.poll(() => faqDetails.evaluate((element) => (element as HTMLDetailsElement).open)).toBe(true);
});

test("reduced motion disables smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);

  expect(behavior).toBe("auto");
});

test("reporting is a standalone page with the connected record heading", async ({ page }) => {
  await page.goto("/reporting");
  await expect(page).toHaveURL(/\/reporting$/);
  await expect(page.getByRole("heading", { name: /Turn operational activity into a connected record\./i })).toBeVisible();
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
  await expect(page.getByText("The enquiry form could not be loaded.")).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("link", { name: /open the enquiry form/i })).toHaveAttribute("href", /share-ap1\.hsforms\.com/);
});
