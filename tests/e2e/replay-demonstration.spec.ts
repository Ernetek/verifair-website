import { expect, test } from "@playwright/test";

test("unified demonstration shows the end-to-end workflow in one page", async ({
  page,
}) => {
  await page.goto("/demonstration", { waitUntil: "networkidle" });

  await expect(
    page.getByRole("heading", { name: /See VerifAir in action/i }),
  ).toBeVisible({ timeout: 25000 });

  await page.getByRole("button", { name: "Start demo" }).click();

  await expect(
    page.getByText("Monitoring Overview", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Operational incident management", { exact: true }),
  ).toBeVisible({ timeout: 25000 });
  await expect(
    page.getByText("Evidence pack and operational record", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("GENERATED REPORT", { exact: true })).toBeVisible();
});

test("demonstration page renders the single-page operational flow instead of legacy dedicated demos", async ({ page }) => {
  await page.goto("/demonstration", { waitUntil: "networkidle" });

  await expect(
    page.getByRole("heading", { name: /See VerifAir in action/i }),
  ).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: "Start demo" }).click();

  await expect(
    page.getByText("Monitoring Overview", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Operational incident management", { exact: true }),
  ).toBeVisible({ timeout: 25000 });
  await expect(
    page.getByText("Evidence pack and operational record", { exact: true }),
  ).toBeVisible();
});

test("generated record output remains available in the unified demo", async ({ page }) => {
  await page.goto("/demonstration", { waitUntil: "networkidle" });

  await expect(page.getByText("GENERATED REPORT", { exact: true })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Incident Summary", { exact: true })).toBeVisible();
  await expect(page.getByText("Event timeline", { exact: true })).toBeVisible();
  await expect(page.getByText("Continued monitoring", { exact: true })).toBeVisible();
});

test("operator can work the incident manually from acknowledgement through closure", async ({ page }) => {
  await page.goto("/demonstration", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start demo" }).click();
  await expect(page.getByRole("heading", { name: "Operational incident management" })).toBeVisible({ timeout: 25000 });
  await expect(page.getByText("INC-0042", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Scenario position", { exact: true })).toHaveCount(0);

  await page.getByLabel("Priority").selectOption("High");
  await page.getByRole("button", { name: "Acknowledge, assign to me and start work" }).click();

  await page.getByLabel("Investigation status").selectOption("Controls being checked");
  await page.getByLabel("Investigation notes").fill("Entry door inspected.");
  await page.getByLabel("Observed conditions").fill("Dust visible near the entry interface.");
  await page.getByLabel("Action taken").fill("Local suppression applied.");
  await page.getByRole("button", { name: "Save investigation update" }).click();

  await page.getByLabel("Verification requested from").selectOption("Maria Chen");
  await page.getByRole("button", { name: "Submit for verification" }).click();
  await page.getByLabel("Verification outcome").selectOption("sufficient_to_close");
  await page.getByLabel("Verification notes").fill("Controls checked and sufficient to close.");
  await page.getByRole("button", { name: "Complete verification" }).click();

  await page.getByLabel("Closure category").selectOption("Controls adjusted");
  await page.getByLabel("Closed by").selectOption("Maria Chen");
  await page.getByLabel("Closure details").fill("Operational response recorded and review completed.");
  await page.getByRole("button", { name: "Resolve incident" }).click();

  await expect(page.getByText("GENERATED REPORT", { exact: true })).toBeVisible();
  await expect(page.getByText("CLOSED", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Operator", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Maria Chen", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Controls being checked. Entry door inspected.", { exact: true })).toBeVisible();
});

test("product demonstration has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/demonstration", { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
});



