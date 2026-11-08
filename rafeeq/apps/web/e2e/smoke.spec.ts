import { expect, test } from "@playwright/test";

test("root route loads with a locale", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", /^(en|ar)$/);
  await expect(page.locator("html")).toHaveAttribute("dir", /^(ltr|rtl)$/);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("main")).toHaveText("");
});
