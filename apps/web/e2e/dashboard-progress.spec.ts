import { expect, test, type Page } from "@playwright/test";

const demoProgress = JSON.stringify({
  visited: ["carrier", "inheritance"],
  completed: ["carrier"],
  review: [],
});

async function enterDashboard(page: Page): Promise<void> {
  await page.goto("/demo");
  await page.getByRole("button", { name: /Noor & Khalid/ }).click();
  await expect(page).toHaveURL(/\/app$/);
}

async function seedProgressAndReload(page: Page): Promise<void> {
  await page.evaluate((progress) => {
    sessionStorage.setItem("rafeeq.learning-progress.demo", progress);
  }, demoProgress);
  await page.reload();
}

test.describe("dashboard progress indicators", () => {
  test("shows tracked progress in responsive, color-coded indicators", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await enterDashboard(page);
    await seedProgressAndReload(page);

    const progressGroup = page.getByRole("group", { name: "Dashboard progress indicators" });
    const cards = progressGroup.locator(":scope > article");
    await expect(cards).toHaveCount(3);
    const journeyProgress = page.getByRole("progressbar", { name: "Journey Progress" });
    await expect(journeyProgress).toHaveAttribute("aria-valuenow", "25");
    await expect(journeyProgress).toHaveText("25%");
    await expect(page.getByRole("progressbar", { name: "Learning Progress" })).toHaveAttribute(
      "aria-valuenow",
      "17",
    );
    await expect(page.getByRole("progressbar", { name: "Learning Resources" })).toHaveAttribute(
      "aria-valuenow",
      "33",
    );
    await expect(page.getByRole("progressbar", { name: "Completed Activities" })).toHaveAttribute(
      "aria-valuenow",
      "17",
    );
    await expect(
      page.getByRole("progressbar", { name: "Profile Completion" }).first(),
    ).toHaveAttribute("aria-valuenow", "0");
    const ringColors = await progressGroup
      .locator("svg circle:nth-of-type(2)")
      .evaluateAll((circles) => circles.map((circle) => getComputedStyle(circle).stroke));
    expect(new Set(ringColors).size).toBe(3);

    const mobileFirst = await cards.nth(0).boundingBox();
    const mobileSecond = await cards.nth(1).boundingBox();
    if (mobileFirst === null || mobileSecond === null) {
      throw new Error("Expected both mobile progress cards to be visible.");
    }
    expect(mobileSecond.y).toBeGreaterThan(mobileFirst.y);

    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopFirst = await cards.nth(0).boundingBox();
    const desktopSecond = await cards.nth(1).boundingBox();
    if (desktopFirst === null || desktopSecond === null) {
      throw new Error("Expected both desktop progress cards to be visible.");
    }
    expect(Math.abs(desktopSecond.y - desktopFirst.y)).toBeLessThan(1);
  });

  test("renders the final values without animation when reduced motion is requested", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await enterDashboard(page);
    await seedProgressAndReload(page);

    const journeyProgress = page.getByRole("progressbar", { name: "Journey Progress" });
    await expect(journeyProgress).toBeVisible();
    await expect(journeyProgress).toHaveAttribute("aria-valuenow", "25", { timeout: 200 });
  });
});
