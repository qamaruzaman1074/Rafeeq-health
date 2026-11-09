import { expect, test, type Page } from "@playwright/test";

async function openCheck(page: Page): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Enter as Noor & Khalid" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("list", { name: "Pathway" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Pages" })
    .getByRole("link", { name: "Check" })
    .click();
  await expect(page).toHaveURL(/\/app\/check$/);
  await expect(page.getByRole("heading", { level: 1, name: "Teach-back check" })).toBeVisible();
}

test("answers one pictorial item, skips the rest, and marks Check on the couple home", async ({
  page,
}) => {
  await openCheck(page);
  await expect(page.getByText("In your own words")).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip for now" })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
  const dots = page.locator("[data-progress-dot]");
  await expect(dots).toHaveCount(3);
  await expect(dots.nth(0)).toHaveAttribute("data-progress-dot", "current");

  const posted = page.waitForRequest(
    (request) =>
      request.url().includes("/api/v1/comprehension/answer") && request.method() === "POST",
  );
  await page.getByRole("radio", { name: "Ring" }).click();
  const request = await posted;
  const body = request.postDataJSON() as { latency_ms?: unknown; attempt?: unknown };
  expect(typeof body.latency_ms).toBe("number");
  expect(body.attempt).toBe(1);
  await expect(page.getByText("Here is another way to look at this.")).toBeVisible();
  await expect(page.getByText(/wrong/i)).toHaveCount(0);
  await expect(page.getByText(/incorrect/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Skip for now" }).click();
  await expect(page.getByText("In your own words")).toHaveCount(0);
  await page.getByRole("button", { name: "Skip for now" }).click();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await expect(page.getByRole("heading", { name: "Check saved" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Pages" })
    .getByRole("link", { name: "Overview" })
    .click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.locator("[data-step='check']")).toHaveAttribute("data-complete", "true");
  await expect(page.getByText("Complete", { exact: true })).toBeVisible();
});

test("keeps the check screen on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Enter as Noor & Khalid" }).click();
  await page
    .getByRole("navigation", { name: "Pages" })
    .getByRole("link", { name: "Check" })
    .click();
  await expect(page.getByRole("radio", { name: "Ring" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip for now" })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
