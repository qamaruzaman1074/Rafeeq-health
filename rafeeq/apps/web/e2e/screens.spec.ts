import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

const screensDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../docs/screens",
);

const viewports = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

test.beforeAll(() => {
  mkdirSync(screensDir, { recursive: true });
});

async function shot(
  page: Page,
  route: string,
  locale: string,
  viewport: string,
  pathname: string,
): Promise<void> {
  await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", pathname);
  await expect(page.locator("[data-state='loading']:visible")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.screenshot({
    path: path.join(screensDir, `${route}-${locale}-${viewport}.png`),
    fullPage: true,
    animations: "disabled",
  });
}

async function clientGo(page: Page, href: string): Promise<void> {
  const expected = href === "/admin" ? "/" : href;
  await page.evaluate((next) => {
    const current = window.history.state;
    const idx = typeof current?.idx === "number" ? current.idx + 1 : 1;
    window.history.pushState({ ...current, idx }, "", next);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, href);
  await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", expected);
}

async function capture(page: Page, locale: "en", viewport: keyof typeof viewports): Promise<void> {
  await page.addInitScript((lang) => {
    localStorage.setItem("rafeeq.lang", lang);
  }, locale);
  await page.setViewportSize(viewports[viewport]);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
  await shot(page, "landing", locale, viewport, "/");

  await clientGo(page, "/trust");
  await shot(page, "trust", locale, viewport, "/trust");
  await clientGo(page, "/legal");
  await shot(page, "legal", locale, viewport, "/legal");
  await clientGo(page, "/demo");
  await shot(page, "demo", locale, viewport, "/demo");

  const enter = "Enter as Noor & Khalid";
  await page.getByRole("button", { name: enter }).click();
  await page.waitForURL((url) => url.pathname === "/app");
  await shot(page, "app", locale, viewport, "/app");

  const coupleRoutes = [
    ["/app/result", "app-result"],
    ["/app/couple", "app-couple"],
    ["/app/learn", "app-learn"],
    ["/app/check", "app-check"],
    ["/app/ask", "app-ask"],
    ["/app/privacy", "app-privacy"],
    ["/app/care", "app-care"],
    ["/app/settings", "app-settings"],
  ] as const;
  for (const [href, name] of coupleRoutes) {
    await clientGo(page, href);
    await shot(page, name, locale, viewport, href);
  }

  await clientGo(page, "/demo");
  const demoActions = page.locator("main header").getByRole("button");
  await demoActions.nth(1).click();
  await page.waitForURL((url) => url.pathname === "/clinic/queue");
  await shot(page, "clinic-queue", locale, viewport, "/clinic/queue");
  await clientGo(page, "/clinic");
  await shot(page, "clinic", locale, viewport, "/clinic");
  await clientGo(page, "/clinic/queue");
  await page.getByRole("link", { name: /referral-P6/ }).click();
  await page.waitForURL((url) => url.pathname === "/clinic/case/referral-P6");
  await shot(page, "clinic-case", locale, viewport, "/clinic/case/referral-P6");
  await clientGo(page, "/clinic/audit");
  await shot(page, "clinic-audit", locale, viewport, "/clinic/audit");

  await clientGo(page, "/demo");
  await page.locator("main header").getByRole("button").nth(2).click();
  await page.waitForURL((url) => url.pathname === "/insights");
  await shot(page, "insights", locale, viewport, "/insights");

  // OPEN_QUESTION: /admin has no session starter. The guard redirects to /.
  await clientGo(page, "/admin");
  await shot(page, "admin", locale, viewport, "/");
}

test.describe.configure({ mode: "serial" });

for (const locale of ["en"] as const) {
  for (const viewport of ["desktop", "mobile"] as const) {
    test(`screenshots ${locale} ${viewport}`, async ({ page }) => {
      test.setTimeout(240_000);
      await capture(page, locale, viewport);
    });
  }
}
