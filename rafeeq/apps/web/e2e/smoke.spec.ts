import { expect, test } from "@playwright/test";

test("root route loads with a locale", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", /^(en|ar)$/);
  await expect(page.locator("html")).toHaveAttribute("dir", /^(ltr|rtl)$/);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Understand your genetic result - in your language, at your pace, with a counsellor one tap away.",
  );
  await expect(page.getByText("Synthetic data, not medical advice.")).toBeVisible();
});
