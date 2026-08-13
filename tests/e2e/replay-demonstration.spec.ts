import { expect, test } from "@playwright/test";

test("approved demonstration keeps readings, timeline and controls synchronised", async ({
  page,
}) => {
  await page.goto("/demonstration/workflow");
  // Wait for client hydration to complete; useEffect may not run immediately.
  // Increase timeout on concurrent testing environments.
  await expect(page.getByTestId("product-demonstration")).toHaveAttribute(
    "data-hydrated",
    "true",
    { timeout: 15000 },
  );

  await expect(
    page.getByText("Simulated demonstration data", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Respirable dust" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^PM4(?:\.0)?$/i })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "PM1" }).locator("..").getByText("8 µg/m³", { exact: true }),
  ).toBeVisible();

  // Sensor replay opens the incident; human workflow actions must not advance replay time.
  await page.getByRole("button", { name: /Next scenario marker/i }).click();

  await expect(
    page.getByRole("heading", { name: "PM1" }).locator("..").getByText("16 µg/m³", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Acknowledge alert" }).click();
  await page.getByLabel("Assign to specific user").selectOption("Jordan Lee");
  await page.getByRole("button", { name: "Assign task" }).click();
  await page.getByRole("button", { name: "Start work" }).click();
  await page.getByLabel("Status update details").fill(
    "Area checked and local controls verified.",
  );
  await page.getByRole("button", { name: /Save status update/i }).click();

  // Closure must not be available until verification succeeds.
  await expect(
    page.getByRole("button", { name: "Close incident and retain evidence" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: /Proceed to Verification/i }).click();

  await expect(page.getByLabel("Verification outcome")).toBeVisible();
  await page.getByLabel("Verifier name").fill("Maria Chen");
  await page
    .getByLabel("Verification outcome")
    .selectOption("sufficient_to_close");
  await page.getByLabel("Verification notes").fill(
    "Area inspected and local controls checked.",
  );

  // Verification has started but closure is still unavailable.
  await expect(
    page.getByRole("button", { name: "Close incident and retain evidence" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: /Complete verification/i }).click();

  await expect(page.getByLabel("Closure category - required")).toBeVisible();
  await page
    .getByLabel("Closure category - required")
    .selectOption("False positive");
  await page
    .getByLabel("Closure details - required")
    .fill("Area inspected; no continuing condition identified.");

  await page
    .getByRole("button", { name: "Close incident and retain evidence" })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Incident closed with evidence retained",
    }),
  ).toBeVisible();

  // Human workflow actions must not advance environmental replay time.
  await expect(page.getByLabel("Scenario position")).toHaveValue("120000");

  await expect(page.getByText("Live current particulate levels")).toBeVisible();
  await expect(page.getByLabel("Select location")).toBeVisible();
  await expect(page.getByLabel("Upload photo evidence")).toBeVisible();
});

test("demonstration overview links to each dedicated experience", async ({ page }) => {
  await page.goto("/demonstration", { waitUntil: "networkidle" });
  // Wait for overview content to render
  await expect(page.getByRole("heading", { name: /Explore the complete VerifAir response system/ })).toBeVisible({ timeout: 10000 });
  
  await expect(page.getByRole("link", { name: /Open monitoring-room demo/ })).toHaveAttribute("href", "/demonstration/monitoring-room");
  await expect(page.getByRole("link", { name: /Start guided workflow/ })).toHaveAttribute("href", "/demonstration/workflow");
  await expect(page.getByRole("link", { name: /Open evidence-reporting demo/ })).toHaveAttribute("href", "/demonstration/evidence-reporting");
});

test("reporting portal switches between detailed report types", async ({ page }) => {
  await page.goto("/demonstration/evidence-reporting", { waitUntil: "networkidle" });
  // Wait for the reporting component to load and be accessible
  await expect(page.getByLabel("Report type")).toBeVisible({ timeout: 10000 });
  
  await page.getByLabel("Report type").selectOption("Alert and response register");
  await expect(page.getByRole("heading", { name: "Selected incident evidence" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence attached to INC-0042" })).toBeVisible();
  await expect(page.getByText("Site investigation · preloaded evidence")).toBeVisible();
  await page.getByLabel("Report type").selectOption("Project-period evidence pack");
  await expect(page.getByRole("heading", { name: "Project-period monitoring evidence pack" })).toBeVisible();
});

test("product demonstration has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/demonstration/workflow");
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
});



