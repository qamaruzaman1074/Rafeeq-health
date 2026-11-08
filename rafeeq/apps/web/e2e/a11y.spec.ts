import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const locales = ["en", "ar"] as const;

type Locale = (typeof locales)[number];

const publicRoutes = ["/", "/trust", "/demo", "/legal", "/dev/styleguide"] as const;

const coupleRoutes = [
  "/app",
  "/app/result",
  "/app/couple",
  "/app/learn",
  "/app/check",
  "/app/ask",
  "/app/privacy",
  "/app/care",
  "/app/settings",
] as const;

const counsellorRoutes = [
  "/clinic/queue",
  "/clinic",
  "/clinic/case/referral-P1",
  "/clinic/audit",
] as const;

function violationSummary(results: Awaited<ReturnType<AxeBuilder["analyze"]>>) {
  return results.violations
    .filter((item) => item.impact === "serious" || item.impact === "critical")
    .map((item) => ({
      id: item.id,
      impact: item.impact,
      help: item.help,
      nodes: item.nodes.slice(0, 4).map((node) => node.target.join(" ")),
    }));
}

async function scan(page: Page, path: string): Promise<void> {
  if (path === "/dev/styleguide") {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  } else {
    await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", path);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  }
  await page.waitForLoadState("networkidle");
  const results = await new AxeBuilder({ page }).analyze();
  expect(violationSummary(results), path).toEqual([]);
}

async function clientNavigate(page: Page, path: string): Promise<void> {
  await page.evaluate((next) => {
    const current = window.history.state as { idx?: number } | null;
    const idx = typeof current?.idx === "number" ? current.idx + 1 : 1;
    window.history.pushState(
      { usr: null, key: Math.random().toString(36).slice(2, 10), idx },
      "",
      next,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, path);
  await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", path);
}

async function enterGuest(page: Page): Promise<void> {
  await page.goto("/demo");
  await page.getByRole("button", { name: /Noor & Khalid/ }).click();
  await expect(page).toHaveURL(/\/app$/);
}

async function enterCounsellor(page: Page): Promise<void> {
  await page.goto("/demo");
  await page.locator("main header").getByRole("button").nth(1).click();
  await expect(page).toHaveURL(/\/clinic\/queue$/);
}

async function enterAnalyst(page: Page): Promise<void> {
  await page.goto("/demo");
  await page.locator("main header").getByRole("button").nth(2).click();
  await expect(page).toHaveURL(/\/insights$/);
}

for (const locale of locales) {
  test.describe(`${locale} axe`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((lang: Locale) => {
        localStorage.setItem("rafeeq.lang", lang);
      }, locale);
      await page.setViewportSize({ width: 1280, height: 900 });
    });

    test("public routes have no serious or critical issues", async ({ page }) => {
      test.setTimeout(120_000);
      for (const path of publicRoutes) {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await scan(page, path);
      }
    });

    test("couple routes have no serious or critical issues", async ({ page }) => {
      test.setTimeout(180_000);
      await enterGuest(page);
      for (const path of coupleRoutes) {
        if (path !== "/app") {
          await clientNavigate(page, path);
        }
        await scan(page, path);
      }
    });

    test("counsellor routes have no serious or critical issues", async ({ page }) => {
      test.setTimeout(120_000);
      await enterCounsellor(page);
      for (const path of counsellorRoutes) {
        if (path !== "/clinic/queue") {
          await clientNavigate(page, path);
        }
        await scan(page, path);
      }
    });

    test("insights has no serious or critical issues", async ({ page }) => {
      test.setTimeout(90_000);
      await enterAnalyst(page);
      await expect(page.locator("[data-equity-cell]").first()).toBeVisible();
      await scan(page, "/insights");
    });
  });
}

test("admin has no mock session", async ({ page }) => {
  // OPEN_QUESTION: POST /auth/login accepts counsellor and analyst only.
  // No admin mock session exists, so /admin cannot be opened for an axe scan.
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

const zoomTargets = {
  en: ["Continue as Guest", "Sign in"],
  ar: ["المتابعة كضيف", "تسجيل الدخول"],
} as const;

for (const locale of locales) {
  test(`primary actions stay inside the layout at 200% zoom (${locale})`, async ({ page }) => {
    await page.addInitScript((lang: Locale) => {
      localStorage.setItem("rafeeq.lang", lang);
    }, locale);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.style.zoom = "2";
    });
    const names: readonly string[] = zoomTargets[locale];
    for (const name of names) {
      const control = page
        .getByRole("link", { name })
        .or(page.getByRole("button", { name }))
        .first();
      await expect(control).toBeVisible();
    }
    const clipped = await page.evaluate((expected) => {
      const controls = Array.from(document.querySelectorAll("a, button")).filter((element) =>
        expected.some((name) => (element.textContent ?? "").includes(name)),
      );
      return controls
        .map((element) => {
          const rect = element.getBoundingClientRect();
          let node: HTMLElement | null = element.parentElement;
          let cut = false;
          while (node !== null) {
            const style = getComputedStyle(node);
            const hidden =
              style.overflow === "hidden" ||
              style.overflowX === "hidden" ||
              style.overflowY === "hidden";
            if (hidden) {
              const bounds = node.getBoundingClientRect();
              if (
                rect.left < bounds.left - 1 ||
                rect.right > bounds.right + 1 ||
                rect.top < bounds.top - 1 ||
                rect.bottom > bounds.bottom + 1
              ) {
                cut = true;
              }
            }
            node = node.parentElement;
          }
          return {
            name: element.textContent ?? "",
            cut,
            widerThanViewport: rect.width > document.documentElement.clientWidth + 1,
          };
        })
        .filter((item) => item.cut || item.widerThanViewport);
    }, names);
    expect(clipped).toEqual([]);
  });
}

test("reduced motion collapses animation duration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const duration = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.animationName = "fade-in";
    probe.style.animationDuration = "150ms";
    document.body.appendChild(probe);
    return getComputedStyle(probe).animationDuration;
  });
  const milliseconds = duration.endsWith("ms")
    ? Number.parseFloat(duration)
    : Number.parseFloat(duration) * 1000;
  expect(milliseconds).toBeCloseTo(0.01, 4);
});
