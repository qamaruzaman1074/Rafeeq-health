import { expect, test, type Page } from "@playwright/test";
import { HARD_ROUTE_PROMPTS } from "../src/mocks/ask-routes";

const REASON_LABELS: Record<(typeof HARD_ROUTE_PROMPTS)[number]["reason"], string> = {
  distress: "Distress or self-harm",
  termination: "Pregnancy termination",
  religious: "Religious ruling",
  other_person: "Another person's results",
  blame: "Blame",
  diagnosis: "Diagnosis request",
  decision: "A decision for you",
  medication: "Medication or treatment",
  legal: "Legal or immigration",
  minor: "A minor",
};

async function openAsk(page: Page): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Enter as Noor & Khalid" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.locator("a[href='/app/ask']").click();
  await expect(page).toHaveURL(/\/app\/ask$/);
  await expect(page.getByRole("heading", { level: 1, name: "Ask a question" })).toBeVisible();
}

test("shows a handoff card for hard questions and keeps the boundary visible", async ({ page }) => {
  await openAsk(page);
  const boundary = page.locator("[data-boundary='visible']");
  await expect(boundary).toBeVisible();
  await expect(boundary).toContainText(
    "This assistant only shows approved content. A hard question goes to a person.",
  );
  await expect(page.locator("[data-suggested]")).toHaveAttribute("data-suggested", "0");
  await expect(page.locator("[data-suggested] button")).toHaveCount(0);

  for (const prompt of HARD_ROUTE_PROMPTS) {
    await page.getByLabel("Your question").fill(prompt.question);
    await page.getByRole("button", { name: "Send" }).click();
    const card = page.getByRole("region", { name: "Needs a person" }).last();
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("data-handoff", "human");
    await expect(card).toHaveClass(/bg-lilac-100/);
    await expect(card).toContainText(REASON_LABELS[prompt.reason]);
    await expect(card.getByRole("link", { name: "Book a counsellor" })).toHaveAttribute(
      "href",
      "/app/care",
    );
    await expect(card.getByText("Source: Approved content")).toHaveCount(0);
    await expect(boundary).toBeVisible();
  }

  await page
    .getByRole("region", { name: "Needs a person" })
    .last()
    .getByRole("link", { name: "Book a counsellor" })
    .click();
  await expect(page).toHaveURL(/\/app\/care$/);
  await expect(page.getByRole("heading", { level: 1, name: "Care pathway" })).toBeVisible();
});

test("does not render an answer that has no source id", async ({ page }) => {
  await openAsk(page);
  await page.getByLabel("Your question").fill("What does this page show");
  await page.getByRole("button", { name: "Send" }).click();
  const blocked = page.locator("[data-answer='blocked']");
  await expect(blocked).toBeVisible();
  await expect(blocked).toContainText("No approved answer is available.");
  await expect(blocked.getByRole("link", { name: "Talk to a person" })).toHaveAttribute(
    "href",
    "/app/care",
  );
  await expect(page.getByText("What does this page show")).toHaveCount(1);
  await expect(page.locator("[data-answer='content']")).toHaveCount(0);
  await expect(page.locator("[data-handoff='human']")).toHaveCount(0);
});

test("stops the question at 500 characters", async ({ page }) => {
  await openAsk(page);
  const field = page.getByLabel("Your question");
  await expect(field).toHaveAttribute("maxlength", "500");
  await field.fill("a".repeat(600));
  await expect(field).toHaveValue("a".repeat(500));
  await expect(page.getByText("500 of 500")).toBeVisible();
});
