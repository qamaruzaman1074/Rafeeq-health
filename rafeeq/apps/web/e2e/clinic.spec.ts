import { expect, test } from "@playwright/test";

test("counsellor queue is usable at 1024px and hides unshared P5 fields", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Open the counsellor queue" }).click();
  await expect(page).toHaveURL(/\/clinic\/queue$/);
  await expect(page.getByRole("heading", { level: 1, name: "Queue" })).toBeVisible();
  await expect(page.getByLabel("Tier")).toBeVisible();
  await expect(page.getByLabel("Referral language")).toBeVisible();
  await expect(page.getByLabel("Status")).toBeVisible();

  const tierHeader = page.getByRole("button", { name: "Tier" });
  await tierHeader.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("columnheader", { name: "Tier" })).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await tierHeader.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("columnheader", { name: "Tier" })).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await expect(page.getByRole("link", { name: /Open brief/ }).first()).toHaveAccessibleName(
    "Open brief referral-P6",
  );

  const rowLink = page.getByRole("link", { name: "Open brief referral-P5" });
  await rowLink.focus();
  await expect(rowLink).toBeFocused();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.getByLabel("Tier").selectOption("T2_counsel_routine");
  await expect(page.getByRole("link", { name: "Open brief referral-P1" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open brief referral-P5" })).toHaveCount(0);
  await expect(page.getByText("risk level")).toHaveCount(0);

  await page.getByLabel("Tier").selectOption("all");
  await rowLink.click();
  await expect(page).toHaveURL(/\/clinic\/case\/referral-P5$/);
  await expect(page.getByRole("heading", { level: 1, name: "Case brief" })).toBeVisible();
  await expect(page.getByText("No shared genes.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Prompts, not advice" })).toBeVisible();
  await expect(page.getByText("These are prompts, not advice.")).toBeVisible();
  await expect(page.getByText("P5_PARTNER_B_UNSHARED")).toHaveCount(0);
  await expect(page.getByText("P5_OVERLAP_UNSHARED")).toHaveCount(0);
  await expect(page.getByText("risk level")).toHaveCount(0);

  await page.getByRole("tab", { name: "Audit" }).click();
  await expect(page.getByText("Counsellor")).toBeVisible();
  await expect(page.getByText("Shares")).toBeVisible();
});

test("updates a referral status from the case brief", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Open the counsellor queue" }).click();
  await page.getByRole("link", { name: "Open brief referral-P1" }).click();
  await expect(page.locator("[data-status='created']")).toBeVisible();
  await page.getByLabel("New status").selectOption("booked");
  await page.getByRole("button", { name: "Update status" }).click();
  await expect(page.locator("[data-status='booked']")).toBeVisible();
  await expect(page.getByText("risk level")).toHaveCount(0);
});
