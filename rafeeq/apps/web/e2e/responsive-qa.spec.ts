import { expect, test, type Page } from "@playwright/test";

const locales = ["en"] as const;
type Locale = (typeof locales)[number];

const viewports = [
  { name: "mobile-320", width: 320, height: 700 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1280, height: 900 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
] as const;

const publicRoutes = [
  "/",
  "/about",
  "/how-it-works",
  "/faq",
  "/trust",
  "/demo",
  "/privacy-policy",
  "/terms",
] as const;
const coupleRoutes = [
  "/app",
  "/app/result",
  "/app/learn",
  "/app/check",
  "/app/privacy",
  "/app/care",
  "/app/ask",
] as const;

async function measureOverflow(page: Page): Promise<{ html: number; body: number }> {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    return {
      html: root.scrollWidth - root.clientWidth,
      body: body.scrollWidth - body.clientWidth,
    };
  });
}

async function assertNoPageOverflow(page: Page, label: string): Promise<void> {
  const overflow = await measureOverflow(page);
  expect(overflow, label).toEqual(
    expect.objectContaining({
      html: expect.any(Number),
      body: expect.any(Number),
    }),
  );
  expect(overflow.html, `${label} html`).toBeLessThanOrEqual(2);
  expect(overflow.body, `${label} body`).toBeLessThanOrEqual(2);
}

async function assertDocumentLocale(page: Page, locale: Locale): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
}

async function assertLocalImages(page: Page, label: string): Promise<void> {
  const localImages = page.locator('img[src*="/images/"]');
  const count = await localImages.count();
  for (let i = 0; i < count; i++) {
    const img = localImages.nth(i);
    // The hero illustration floats indefinitely, so Playwright's stability wait never settles.
    await img.evaluate((el) => {
      el.scrollIntoView({ block: "center" });
    });
    await expect(img, `${label} image ${i}`).toHaveJSProperty("complete", true, {
      timeout: 15_000,
    });
    const naturalWidth = await img.evaluate((el) => (el as HTMLImageElement).naturalWidth);
    expect(naturalWidth, `${label} image ${i} naturalWidth`).toBeGreaterThan(0);
  }
  const images = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => image.clientWidth > 0 && image.clientHeight > 0)
      .map((image) => ({
        src: image.currentSrc || image.src,
        alt: image.alt,
        naturalWidth: image.naturalWidth,
        objectFit: getComputedStyle(image).objectFit,
      })),
  );
  for (const image of images) {
    expect(image.src, `${label} ${image.src}`).not.toMatch(/^https?:\/\/images\.unsplash\.com/i);
    if (image.src.includes("/images/")) {
      expect(image.alt.length, `${label} alt ${image.src}`).toBeGreaterThan(0);
      expect(image.naturalWidth, `${label} loaded ${image.src}`).toBeGreaterThan(0);
      const expectedFit = image.src.includes("hero-cell-dna") ? "contain" : "cover";
      expect(image.objectFit, `${label} fit ${image.src}`).toBe(expectedFit);
    }
  }
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
      "/app/ask": "Ask",
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
      "/app/ask": "اسأل",
    },
  },
} as const;

for (const locale of locales) {
  for (const viewport of viewports) {
    test(`${locale} ${viewport.name} overflow, direction, and images`, async ({ page }) => {
      test.setTimeout(240_000);
      await page.addInitScript((lang: Locale) => {
        localStorage.setItem("rafeeq.lang", lang);
      }, locale);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const publicRoutesThisViewport =
        viewport.width <= 320 ? (["/", "/about"] as const) : publicRoutes;

      for (const route of publicRoutesThisViewport) {
        await page.goto(route);
        await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", route);
        await assertDocumentLocale(page, locale);
        await assertNoPageOverflow(page, `${locale} ${viewport.name} ${route}`);
        if (route === "/") {
          await assertLocalImages(page, `${locale} ${viewport.name} ${route}`);
        }
      }

      if (viewport.width <= 320) {
        return;
      }

      await page.goto("/demo");
      await page.getByRole("button", { name: /Noor & Khalid/ }).click();
      await expect(page).toHaveURL(/\/app$/);
      await assertDocumentLocale(page, locale);

      const copy = coupleNav[locale];
      if (viewport.width === 390) {
        const nav = page.getByRole("navigation", { name: copy.pages });
        const boxes = await nav.getByRole("link").all();
        expect(boxes.length).toBeGreaterThan(0);
        for (const link of boxes) {
          const box = await link.boundingBox();
          expect(box, "bottom nav target").not.toBeNull();
          if (box !== null) {
            expect(box.height, "min touch height").toBeGreaterThanOrEqual(44);
          }
        }
      }

      for (const route of coupleRoutes) {
        if (route in copy.primary) {
          const name = copy.primary[route as keyof typeof copy.primary];
          await page
            .getByRole("navigation", { name: copy.pages })
            .getByRole("link", { name })
            .click();
        } else {
          const name = copy.secondary[route as keyof typeof copy.secondary];
          if (viewport.width < 1024) {
            await page.getByRole("button", { name: copy.more }).click();
          }
          await page
            .getByRole("navigation", { name: copy.more })
            .getByRole("link", { name })
            .click();
        }
        await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", route);
        await assertNoPageOverflow(page, `${locale} ${viewport.name} ${route}`);
      }

      await page.goto("/demo");
      await page.evaluate(async () => {
        await window.rafeeqDemoTest?.counsellor();
      });
      await page.goto("/clinic/queue");
      await expect(page).toHaveURL(/\/clinic\/queue$/);
      await assertDocumentLocale(page, locale);
      await assertNoPageOverflow(page, `${locale} ${viewport.name} /clinic/queue`);
    });
  }
}
