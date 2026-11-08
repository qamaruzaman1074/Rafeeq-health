import { expect, test, type Page } from "@playwright/test";

async function openCare(page: Page): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Enter as Noor & Khalid" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.locator("a[href='/app/care']").click();
  await expect(page).toHaveURL(/\/app\/care$/);
  await expect(page.getByRole("heading", { level: 1, name: "Care pathway" })).toBeVisible();
}

test("asks for counselling only after clinic share, then updates the pathway", async ({ page }) => {
  await openCare(page);

  await expect(page.getByRole("list", { name: "Care steps" })).toBeVisible();
  await expect(page.locator("[data-step='result_received']")).toHaveAttribute(
    "data-current",
    "true",
  );
  await expect(page.locator("[data-step='counselling']")).toHaveAttribute("data-current", "false");
  await expect(page.locator("[data-status]")).toHaveCount(0);
  await expect(page.getByText("Information only")).toHaveCount(2);
  await expect(page.getByText("OPEN_QUESTION")).toHaveCount(2);
  await expect(page.getByText("Choosing a time stays on this device.")).toBeVisible();
  await expect(page.getByText("risk level")).toHaveCount(0);
  await expect(page.getByText(/T[1-4]/)).toHaveCount(0);

  const send = page.getByRole("button", {
    name: "Send my questions and what I understood to the counsellor",
  });
  await expect(send).toBeDisabled();
  await expect(page.getByText("This stays off until clinic share is on.")).toBeVisible();

  await page.locator("a[href='/app/privacy']").first().click();
  await expect(page).toHaveURL(/\/app\/privacy$/);
  await page.getByRole("switch", { name: "Share with the clinic" }).click();
  await expect(page.getByRole("switch", { name: "Share with the clinic" })).toBeChecked();

  await page.locator("a[href='/app/care']").click();
  await expect(page).toHaveURL(/\/app\/care$/);
  await expect(send).toBeEnabled();

  await send.click();
  await expect(page.locator("[data-step='counselling']")).toHaveAttribute("data-current", "true");
  await expect(page.locator("[data-step='counselling']")).toHaveAttribute("data-reached", "true");
  await expect(page.locator("[data-status='created']")).toContainText("Created");
  await expect(send).toBeDisabled();
  await expect(page.getByText("risk level")).toHaveCount(0);
  await expect(page.getByText(/T[1-4]/)).toHaveCount(0);

  await page
    .getByRole("button", { name: /Morning/ })
    .first()
    .click();
  await expect(page.getByText("Selected on this device.").first()).toBeVisible();
  await expect(page.locator("[data-status='created']")).toBeVisible();
});
