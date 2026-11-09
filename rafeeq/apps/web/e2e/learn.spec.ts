import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

const screensDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../docs/screens",
);

async function openLearn(page: Page): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Enter as Noor & Khalid" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page
    .getByRole("navigation", { name: "Pages" })
    .getByRole("link", { name: "Learn" })
    .click();
  await expect(page).toHaveURL(/\/app\/learn$/);
  await expect(page.getByRole("heading", { level: 1, name: "Learn" })).toBeVisible();
}

test.beforeAll(() => {
  mkdirSync(screensDir, { recursive: true });
});

test("shows standard learn modules with named audio and transcripts", async ({ page }) => {
  await openLearn(page);
  await expect(page.getByRole("heading", { name: "What is a carrier" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "What the result means for a couple" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Risk vs diagnosis" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Uncertainty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Family relatedness and risk" })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Options people may discuss with a counsellor (information only, no ranking)",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "What happens next" })).toBeVisible();
  const transcript = page.getByRole("region", { name: "Transcript: What is a carrier" });
  await expect(transcript).toBeVisible();
  await expect(transcript).toContainText("Not available yet");
  await expect(page.locator("[data-module-icon]")).toHaveCount(0);

  const play = page.getByRole("button", { name: "Play audio: What is a carrier" });
  await expect(play).toBeVisible();
  await play.click();
  await expect(page.locator("audio")).toHaveAttribute("src", "/mock-audio/learn.carrier.full");

  await page.screenshot({
    path: path.join(screensDir, "F7-learn-standard-en.png"),
    fullPage: true,
  });
});

test("shows short text and icons in simple mode", async ({ page }) => {
  await openLearn(page);
  await page.getByRole("button", { name: "Simple", exact: true }).click();
  await expect(page.locator("article[data-literacy='simple']")).toHaveCount(7);
  await expect(page.locator("[data-module-icon]")).toHaveCount(7);
  const transcript = page.getByRole("region", { name: "Transcript: What is a carrier" });
  await expect(transcript).toContainText("Not available yet");
  await expect(transcript).toContainText("learn.carrier.short");
  await page.getByRole("button", { name: "Play audio: What is a carrier" }).click();
  await expect(page.locator("audio")).toHaveAttribute("src", "/mock-audio/learn.carrier.short");
  await page.screenshot({
    path: path.join(screensDir, "F7-learn-simple-en.png"),
    fullPage: true,
  });
});

test("shows large audio controls and a transcript control in voice mode", async ({ page }) => {
  await openLearn(page);
  await page.getByRole("button", { name: "Voice", exact: true }).click();
  await expect(page.locator("article[data-literacy='voice']")).toHaveCount(7);
  await expect(page.locator("[data-module-icon]")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Transcript: What is a carrier" })).toHaveCount(0);
  const play = page.getByRole("button", { name: "Play audio: What is a carrier" });
  await expect(play).toHaveClass(/min-h-20/);
  const show = page.getByRole("button", { name: "Show transcript: What is a carrier" });
  await expect(show).toBeVisible();
  await page.screenshot({
    path: path.join(screensDir, "F7-learn-voice-en.png"),
    fullPage: true,
  });
  await show.click();
  await expect(page.getByRole("region", { name: "Transcript: What is a carrier" })).toContainText(
    "Not available yet",
  );
});

test("persists literacy mode across reload", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/demo");
  await page.evaluate(() => localStorage.setItem("rafeeq.literacy", "simple"));
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("rafeeq.literacy")))
    .toBe("simple");
  await page.getByRole("button", { name: "Enter as Noor & Khalid" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("button", { name: "Simple", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page
    .getByRole("navigation", { name: "Pages" })
    .getByRole("link", { name: "Learn" })
    .click();
  await expect(page.locator("article[data-literacy='simple']")).toHaveCount(7);
});
