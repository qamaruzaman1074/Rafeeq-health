import { expect, test } from "@playwright/test";

test("insights shows the synthetic badge, an undefined KPI, and a suppressed cell", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Open insights" }).click();
  await expect(page).toHaveURL(/\/insights$/);

  await expect(page.getByText("Synthetic data, not medical advice.").first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Insights" })).toBeVisible();
  await expect(
    page.getByText("k-anonymity floor: 5. Groups smaller than 5 are not shown."),
  ).toBeVisible();

  const completion = page.getByRole("heading", { level: 3, name: "Completion of explanation" });
  await expect(completion).toBeVisible();
  await expect(page.locator('[data-kpi-result="explanation_completion"]')).toHaveText(
    "OPEN_QUESTION",
  );

  const arabic = page.getByRole("listitem").filter({ hasText: "Arabic" });
  await expect(arabic).toContainText("Not shown (small group)");
  await expect(arabic).not.toContainText("901");

  const english = page.getByRole("listitem").filter({ hasText: "English" });
  await expect(english).toContainText("Count 24");
  await expect(english).toContainText("100");
  await expect(english).toContainText("200");

  const languageTable = page.getByRole("table", { name: /By language/ });
  await expect(languageTable).toBeHidden();
  await page.getByRole("button", { name: "Show data table" }).first().click();
  await expect(languageTable).toBeVisible();
  await expect(languageTable.getByRole("row", { name: /Arabic/ })).toContainText(
    "Not shown (small group)",
  );
  await expect(languageTable.getByRole("row", { name: /Arabic/ })).not.toContainText("901");
  await page.getByRole("button", { name: "Hide data table" }).click();
  await expect(languageTable).toBeHidden();
});
