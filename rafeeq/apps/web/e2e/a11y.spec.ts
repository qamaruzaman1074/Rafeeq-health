import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const locales = ["en"] as const;

type Locale = (typeof locales)[number];

const publicRoutes = [
  "/",
  "/about",
  "/how-it-works",
  "/understanding-genetic-risk",
  "/inherited-conditions",
  "/genetic-counselling",
  "/contact",
  "/faq",
  "/trust",
  "/demo",
  "/privacy-policy",
  "/terms",
  "/legal",
  "/dev/styleguide",
] as const;

const coupleRoutes = [
  "/app",
  "/app/result",
  "/app/couple",
  "/app/learn",
  "/app/check",
  "/app/ask",
  "/app/privacy",
  "/app/care",
  "/app/report",
  "/app/partner",
  "/app/notifications",
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
  await page.waitForTimeout(1200);
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
  const named = page.getByRole("button", { name: "Open the counsellor queue" });
  if (await named.count()) {
    await named.click();
  } else {
    await page.locator("main header").getByRole("button").nth(1).click();
  }
  await expect(page).toHaveURL(/\/clinic\/queue$/);
}

async function enterAnalyst(page: Page): Promise<void> {
  await page.goto("/demo");
  const named = page.getByRole("button", { name: "Open insights" });
  if (await named.count()) {
    await named.click();
  } else {
    await page.locator("main header").getByRole("button").nth(2).click();
  }
  await expect(page).toHaveURL(/\/insights$/);
}

const coupleNav = {
  en: {
    pages: "Pages",
    more: "More",
    primary: {
      "/app": "Overview",
      "/app/result": "Results",
      "/app/learn": "Learn",
      "/app/check": "Check",
      "/app/privacy": "Privacy",
      "/app/care": "Care",
    },
    secondary: {
      "/app/couple": "Together",
      "/app/report": "My report",
      "/app/partner": "Partner",
      "/app/notifications": "Notifications",
      "/app/ask": "Ask",
      "/app/settings": "Settings",
    },
  },
  ar: {
    pages: "الصفحات",
    more: "المزيد",
    primary: {
      "/app": "نظرة عامة",
      "/app/result": "النتائج",
      "/app/learn": "تعلّم",
      "/app/check": "تحقق",
      "/app/privacy": "الخصوصية",
      "/app/care": "الرعاية",
    },
    secondary: {
      "/app/couple": "معاً",
      "/app/ask": "اسأل",
      "/app/settings": "الإعدادات",
    },
  },
} as const;

async function goCoupleRoute(
  page: Page,
  locale: Locale,
  path: (typeof coupleRoutes)[number],
): Promise<void> {
  const copy = coupleNav[locale];
  if (path in copy.primary) {
    const name = copy.primary[path as keyof typeof copy.primary];
    await page.getByRole("navigation", { name: copy.pages }).getByRole("link", { name }).click();
  } else if (path in copy.secondary) {
    const name = copy.secondary[path as keyof typeof copy.secondary];
    await page.getByRole("navigation", { name: copy.more }).getByRole("link", { name }).click();
  } else {
    await clientNavigate(page, path);
  }
  await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", path);
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
          await goCoupleRoute(page, locale, path);
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
  en: ["Get Started", "How It Works"],
  ar: ["ابدأ", "كيف يعمل"],
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

test("dark landing has no serious or critical issues", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("rafeeq.theme", "dark");
    localStorage.setItem("rafeeq.lang", "en");
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await scan(page, "/");
});

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
