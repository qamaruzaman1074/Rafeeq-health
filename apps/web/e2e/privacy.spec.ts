import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

async function openPrivacy(page: Page): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Enter as Noor & Khalid" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page
    .getByRole("navigation", { name: "Pages" })
    .getByRole("link", { name: "Privacy" })
    .click();
  await expect(page).toHaveURL(/\/app\/privacy$/);
  await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
}

test("downloads a receipt and revokes a share after confirmation", async ({ page }) => {
  await openPrivacy(page);

  const own = page.getByRole("switch", { name: "Your own result stays on" });
  await expect(own).toBeChecked();
  await expect(own).toBeDisabled();
  await expect(page.getByRole("columnheader", { name: "Me" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Partner" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Clinic" })).toBeVisible();
  await expect(page.getByRole("columnheader")).toHaveCount(4);
  await expect(page.getByRole("rowheader", { name: "Research aggregate" })).toBeVisible();
  await expect(page.getByText("Not available yet").first()).toBeVisible();

  const timeline = page.locator("[data-audit='timeline']");
  await expect(timeline).toHaveAttribute("dir", "ltr");
  await expect(timeline.locator("[data-field='actor']").first()).toContainText("Guest");
  await expect(timeline.locator("[data-field='action']").first()).toContainText("Read");
  await expect(timeline.locator("[data-field='action']").first()).toContainText("Results");
  await expect(timeline.locator("[data-field='time'] time").first()).toBeVisible();

  const card = page.getByRole("article", { name: "Overlap with partner" });
  const downloadPromise = page.waitForEvent("download");
  await card.getByRole("button", { name: "Download receipt JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/);
  const path = await download.path();
  expect(path).toBeTruthy();
  if (path === null) {
    return;
  }
  const payload = JSON.parse(readFileSync(path, "utf8")) as {
    scope: string;
    granted: boolean;
    hash: null;
  };
  expect(payload).toMatchObject({
    scope: "share_overlap_with_partner",
    granted: true,
    hash: null,
  });

  const partner = page.getByRole("switch", { name: "Share the overlap with your partner" });
  await expect(partner).toBeChecked();
  await partner.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(partner).toBeChecked();
  await expect(dialog).toBeHidden();

  await partner.click();
  await page.getByRole("dialog").getByRole("button", { name: "Revoke" }).click();
  await expect(partner).not.toBeChecked();
  await expect(card).toContainText("Off");
});
