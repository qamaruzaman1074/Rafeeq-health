import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Locator, type Page } from "@playwright/test";

const screensDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../docs/screens",
);

async function tabUntilFocused(page: Page, target: Locator): Promise<void> {
  for (let step = 0; step < 40; step += 1) {
    const focused = await target.evaluate(
      (element) => element === element.ownerDocument.activeElement,
    );
    if (focused) {
      return;
    }
    await page.keyboard.press("Tab");
  }
  throw new Error("Tab did not reach the control");
}

test.beforeAll(() => {
  mkdirSync(screensDir, { recursive: true });
});

test("keyboard guest entry reaches the couple home", async ({ page }) => {
  await page.goto("/");
  const guest = page.getByRole("link", { name: "Continue as Guest" });
  await tabUntilFocused(page, guest);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/demo$/);

  const persona = page.getByRole("button", { name: "Enter as Noor & Khalid" });
  await tabUntilFocused(page, persona);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Couple home");
});

test("keyboard guest entry works in Arabic", async ({ page }) => {
  await page.goto("/");
  const arabic = page.getByRole("button", { name: "Arabic", exact: true });
  await tabUntilFocused(page, arabic);
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  const guest = page.getByRole("link", { name: "المتابعة كضيف" });
  await tabUntilFocused(page, guest);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/demo$/);

  const persona = page.getByRole("button", { name: "الدخول: Noor & Khalid" });
  await tabUntilFocused(page, persona);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TODO_AR");
});

test("saves landing, trust, and demo screenshots in both directions", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: path.join(screensDir, "F5-landing-en.png"), fullPage: true });

  await page.goto("/trust");
  await expect(page.getByRole("heading", { level: 1, name: "Trust centre" })).toBeVisible();
  await page.screenshot({ path: path.join(screensDir, "F5-trust-en.png"), fullPage: true });

  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 1, name: "Persona picker" })).toBeVisible();
  await page.screenshot({ path: path.join(screensDir, "F5-demo-en.png"), fullPage: true });

  await page.getByRole("button", { name: "Arabic", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.screenshot({ path: path.join(screensDir, "F5-demo-ar.png"), fullPage: true });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "دليل التقييم" }).click();
  const guide = page.getByRole("dialog");
  await expect(guide).toBeVisible();
  await guide.screenshot({ path: path.join(screensDir, "F5-guide-ar.png") });
  await page.keyboard.press("Escape");

  await page.goto("/trust");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1, name: "مركز الثقة" })).toBeVisible();
  await page.screenshot({ path: path.join(screensDir, "F5-trust-ar.png"), fullPage: true });

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("link", { name: "المتابعة كضيف" })).toBeVisible();
  await page.screenshot({ path: path.join(screensDir, "F5-landing-ar.png"), fullPage: true });
});
