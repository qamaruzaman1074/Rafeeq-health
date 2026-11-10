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

test("theme toggle persists dark mode after refresh", async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("rafeeq.theme.seeded") === "1") {
      return;
    }
    localStorage.setItem("rafeeq.theme", "light");
    sessionStorage.setItem("rafeeq.theme.seeded", "1");
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("banner").getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("header svg").first()).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("style", /color-scheme:\s*dark/);
});

test("language selection persists through Arabic demo routes and restores English", async ({
  page,
}) => {
  await page.goto("/");
  const switcher = page.getByRole("group", { name: "Language" });
  await expect(page.getByRole("banner").getByRole("group", { name: "Language" })).toBeVisible();
  await expect(page.getByRole("main").getByRole("group", { name: "Language" })).toHaveCount(0);
  await expect(switcher.getByRole("button")).toHaveText(["English", "العربية"]);
  await switcher.getByRole("button", { name: "العربية" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "افهم صحتك الجينية. واتخذ قرارات مستنيرة بثقة.",
  );

  await page.goto("/demo");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.locator("[data-persona]").first().click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/learn");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText("Learn");
  await page.goto("/app/check");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText("Check");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");

  await page.goto("/");
  await page.getByRole("group", { name: "اللغة" }).getByRole("button", { name: "English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  const menuSwitcher = page.getByRole("dialog").getByRole("group", { name: "Language" });
  await expect(menuSwitcher.getByRole("button")).toHaveText(["English", "العربية"]);
  await menuSwitcher.getByRole("button", { name: "العربية" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("assistant launcher responds to scroll and keyboard interaction", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Rafeeq Assistant" });
  await expect(launcher).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(launcher).toHaveAttribute("data-scrolled", "true");

  await launcher.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(launcher).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(launcher).not.toHaveAttribute("data-scrolled", "true");
});

test("keyboard guest entry reaches the couple home", async ({ page }) => {
  await page.goto("/");
  const guest = page.getByRole("banner").getByRole("link", { name: "Get Started" }).first();
  await tabUntilFocused(page, guest);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/demo$/);

  const persona = page.getByRole("button", { name: "Enter as Noor & Khalid" });
  await tabUntilFocused(page, persona);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Overview");
});

test("saves landing, trust, and demo screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: path.join(screensDir, "F5-landing-en.png"), fullPage: true });

  await page.goto("/trust");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Your information. Your permission. Your choice.",
    }),
  ).toBeVisible();
  await page.screenshot({ path: path.join(screensDir, "F5-trust-en.png"), fullPage: true });

  await page.goto("/demo");
  await expect(
    page.getByRole("heading", { level: 1, name: "Choose a demo profile" }),
  ).toBeVisible();
  await page.screenshot({ path: path.join(screensDir, "F5-demo-en.png"), fullPage: true });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Evaluation guide" }).click();
  const guide = page.getByRole("dialog");
  await expect(guide).toBeVisible();
  await guide.screenshot({ path: path.join(screensDir, "F5-guide-en.png") });
  await page.keyboard.press("Escape");
});
