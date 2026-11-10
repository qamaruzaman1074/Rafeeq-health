import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

const screensDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../docs/screens",
);

async function openCouple(page: Page, persona: string): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/demo");
  await page.getByRole("button", { name: `Enter as ${persona}` }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.locator("a[href='/app/couple']").click();
  await expect(page).toHaveURL(/\/app\/couple$/);
}

test.beforeAll(() => {
  mkdirSync(screensDir, { recursive: true });
});

test("P1 shows the fact card in English", async ({ page }) => {
  await openCouple(page, "Noor & Khalid");
  await expect(page.getByRole("region", { name: "Fact card" })).toBeVisible();
  await expect(
    page.getByText("This is a chance for each pregnancy, not a prediction about any child."),
  ).toBeVisible();
  await expect(page.getByText("This is not a diagnosis.")).toBeVisible();
  await page.screenshot({
    path: path.join(screensDir, "F6-couple-p1-fact-en.png"),
    fullPage: true,
  });
});

test("P5 hides the overlap in English", async ({ page }) => {
  await openCouple(page, "Aisha & Hamad");
  await expect(page.getByText("Overlap stays hidden because sharing was declined.")).toBeVisible();
  await expect(page.getByText("Not available yet").first()).toBeVisible();
  await expect(page.getByRole("region", { name: "Fact card" })).toHaveCount(0);
  await expect(page.getByText("hearing-loss")).toHaveCount(0);
  await page.screenshot({
    path: path.join(screensDir, "F6-couple-p5-hidden-en.png"),
    fullPage: true,
  });
});
