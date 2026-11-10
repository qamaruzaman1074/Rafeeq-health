import { expect, test, type Page } from "@playwright/test";

async function enterDemo(page: Page): Promise<void> {
  await page.goto("/demo");
  await page.getByRole("button", { name: /Noor & Khalid/ }).click();
  await expect(page).toHaveURL(/\/app$/);
}

test.describe("synthetic dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await enterDemo(page);
  });

  test("report keeps a discreet demo label and explains each finding", async ({ page }) => {
    await page.getByRole("link", { name: "Review your screening report" }).click();
    await expect(page).toHaveURL(/\/app\/report$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("My screening report");
    const demoLabels = page.locator("[data-demo-label]");
    await expect(demoLabels).toHaveCount(2);
    await expect(demoLabels.first()).toHaveText("Demo example — not a real genetic test result");
    await expect(page.locator("#report-findings").locator("..")).toContainText(
      "Demo example — not a real genetic test result",
    );
    await expect(page.getByText("RAF-DEMO-001")).toBeVisible();
    await expect(page.locator("[data-status]")).toHaveCount(4);
    const carrier = page.locator('[data-status="carrier_finding"]');
    await carrier.getByText("Understand this finding").click();
    await expect(carrier.getByText("What it does not say")).toBeVisible();
  });

  test("partner sharing needs both consents and can be revoked", async ({ page }) => {
    await page.getByRole("link", { name: "Manage partner connection" }).click();
    await expect(page).toHaveURL(/\/app\/partner$/);
    const risk = page.locator("[data-risk]");
    await expect(risk).toHaveAttribute("data-risk", "noPartner");

    await page.getByRole("button", { name: "Create demo invitation" }).click();
    await expect(risk).toHaveAttribute("data-risk", "pending");
    await page.getByRole("button", { name: "Simulate partner accepting" }).click();
    await expect(risk).toHaveAttribute("data-risk", "noSharedFindings");

    await page.getByRole("button", { name: "Share: Selected carrier findings" }).click();
    await expect(risk).toHaveAttribute("data-risk", "noSharedFindings");
    await page.getByRole("button", { name: "Simulate partner sharing carrier findings" }).click();
    await expect(risk).toHaveAttribute("data-risk", "example");
    await expect(risk.getByText("25%").first()).toBeVisible();
    await expect(page.getByText(/compatib/i)).toHaveText(
      "RAFEEQ never shows a compatibility score or a recommendation about marriage.",
    );

    await page.getByRole("button", { name: "Revoke", exact: true }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Revoke permission" }).click();
    await expect(risk).toHaveAttribute("data-risk", "noSharedFindings");
    await expect(page.getByText(/You revoked consent/)).toBeVisible();
  });

  test("notifications can be marked read without genetic previews", async ({ page }) => {
    await page.getByRole("link", { name: "View notifications" }).click();
    await expect(page).toHaveURL(/\/app\/notifications$/);
    await expect(page.getByText("5 unread")).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/HBB|thalass|sickle|carrier finding/i);
    await page.getByRole("button", { name: "Mark all as read" }).click();
    await expect(page.getByText("You are all caught up.")).toBeVisible();
  });

  test("Learn and Check preserve each demo persona on direct entry and refresh", async ({
    page,
  }) => {
    await page.goto("/demo");
    const personaIds = await page
      .locator("[data-persona]")
      .evaluateAll((buttons) => buttons.map((button) => button.getAttribute("data-persona")));

    for (const personaId of personaIds) {
      if (personaId === null) {
        continue;
      }
      await page.goto("/demo");
      const personaButton = page.locator(`[data-persona="${personaId}"]`);
      const personaName = await personaButton.locator(".text-xl").innerText();
      await personaButton.click();
      await expect(page).toHaveURL(/\/app$/);

      const pagesNav = page.getByRole("navigation", { name: "Pages" });
      await pagesNav.getByRole("link", { name: "Learn" }).click();
      await expect(page).toHaveURL(/\/app\/learn$/);
      await pagesNav.getByRole("link", { name: "Check" }).click();
      await expect(page).toHaveURL(/\/app\/check$/);
      await page.goBack();
      await expect(page).toHaveURL(/\/app\/learn$/);
      await expect(page.locator("aside").getByText(personaName, { exact: true })).toBeVisible();
      await page.goForward();
      await expect(page).toHaveURL(/\/app\/check$/);
      await expect(page.locator("aside").getByText(personaName, { exact: true })).toBeVisible();

      await page.goto("/app/learn");
      await expect(page).toHaveURL(/\/app\/learn$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Learn");
      await expect(page.locator("aside").getByText(personaName, { exact: true })).toBeVisible();
      await page.reload();
      await expect(page).toHaveURL(/\/app\/learn$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Learn");
      await expect(page.locator("aside").getByText(personaName, { exact: true })).toBeVisible();

      await page.goto("/app/check");
      await expect(page).toHaveURL(/\/app\/check$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Check");
      await expect(page.locator("[data-item-id]")).toHaveCount(1);
      await expect(page.locator("aside").getByText(personaName, { exact: true })).toBeVisible();
      await page.reload();
      await expect(page).toHaveURL(/\/app\/check$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Check");
      await expect(page.locator("[data-item-id]")).toHaveCount(1);
      await expect(page.locator("aside").getByText(personaName, { exact: true })).toBeVisible();
    }
  });

  test("settings sign out ends the demo session", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "More" })
      .getByRole("link", { name: "Settings" })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Profile and settings");
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
