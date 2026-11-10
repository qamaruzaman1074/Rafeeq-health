import { expect, test } from "@playwright/test";

test("root route loads with a locale", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Understand your genetic health. Make informed decisions with confidence.",
  );
  await expect(page.getByText(/does not provide genetic diagnosis/)).toBeVisible();
});
