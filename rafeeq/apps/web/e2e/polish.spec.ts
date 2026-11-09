import { expect, test, type Page } from "@playwright/test";

async function scrollToBottom(page: Page): Promise<number> {
  await expect(page.locator("[data-screen]")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        return window.scrollY;
      }),
    )
    .toBeGreaterThan(400);
  return page.evaluate(() => window.scrollY);
}

async function enterDemo(page: Page): Promise<void> {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Enter as Noor & Khalid" }).click();
  await expect(page).toHaveURL(/\/app$/);
}

test.describe("navigation scroll position", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("public links open the next page at the top and back restores", async ({ page }) => {
    await page.goto("/");
    const leftAt = await scrollToBottom(page);
    await page.locator("footer").getByRole("link", { name: "Contact" }).click();
    await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", "/contact");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    await scrollToBottom(page);
    await page.locator("footer").getByRole("link", { name: "FAQs" }).click();
    await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", "/faq");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    await page.goBack();
    await page.goBack();
    await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", "/");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(leftAt - 200);
  });

  test("dashboard links open the next page at the top", async ({ page }) => {
    await enterDemo(page);
    await scrollToBottom(page);
    await page
      .getByRole("navigation", { name: "More" })
      .getByRole("link", { name: "Settings" })
      .click();
    await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", "/app/settings");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    await scrollToBottom(page);
    await page
      .getByRole("navigation", { name: "Pages" })
      .getByRole("link", { name: "Learn" })
      .click();
    await expect(page.locator("[data-screen]")).toHaveAttribute("data-screen", "/app/learn");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });
});

test.describe("persona picker", () => {
  test("Get Started opens six persona cards and the whole card enters", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: "Get Started" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Choose a demo profile" }),
    ).toBeVisible();
    await expect(page.locator("[data-persona]")).toHaveCount(6);
    await expect(page.getByText("Low-literacy voice-first user")).toHaveCount(0);
    await expect(page.getByText("Draft synthetic fixture")).toHaveCount(0);
    await expect(page.getByText(/TTS \+ simple mode/)).toHaveCount(0);

    const card = page.locator('[data-persona="P2"]');
    await expect(card).toHaveCSS("cursor", "pointer");
    await card.getByText("An unrelated couple", { exact: false }).click();
    await expect(page).toHaveURL(/\/app$/);
  });

  test("persona cards are reachable and usable by keyboard", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo");
    const card = page.locator('[data-persona="P1"]');
    await card.focus();
    await expect(card).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/app$/);
  });
});

test.describe("dashboard sidebar", () => {
  test("groups sit together with compact, consistent rows", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await enterDemo(page);
    const aside = page.locator("aside");
    const primary = aside.getByRole("navigation", { name: "Pages" });
    const secondary = aside.getByRole("navigation", { name: "More" });
    await expect(primary.getByText("Main")).toBeVisible();
    await expect(secondary.getByText("Results & sharing")).toBeVisible();
    await expect(secondary.getByText("Account")).toBeVisible();
    await expect(aside.getByText("Synthetic data, not medical advice.")).toHaveCount(0);

    const lastPrimary = await primary.getByRole("link").last().boundingBox();
    const firstSecondary = await secondary.boundingBox();
    expect(lastPrimary).not.toBeNull();
    expect(firstSecondary).not.toBeNull();
    if (lastPrimary !== null && firstSecondary !== null) {
      expect(firstSecondary.y - (lastPrimary.y + lastPrimary.height)).toBeLessThan(32);
    }

    const heights = await aside
      .locator("nav a")
      .evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().height)));
    expect(new Set(heights).size).toBe(1);
    expect(heights[0]).toBeGreaterThanOrEqual(40);
    const icons = await aside
      .locator("nav a svg")
      .evaluateAll((svgs) => svgs.map((svg) => Math.round(svg.getBoundingClientRect().width)));
    expect(new Set(icons)).toEqual(new Set([20]));

    const active = primary.getByRole("link", { name: "Overview" });
    await expect(active).toHaveAttribute("aria-current", "page");
  });

  test("mobile keeps the bottom bar and the More drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await enterDemo(page);
    const bar = page.getByRole("navigation", { name: "Pages" });
    await expect(bar.getByRole("link")).toHaveCount(6);
    await page.getByRole("button", { name: "More" }).click();
    const drawer = page.getByRole("dialog");
    await expect(drawer.getByRole("link", { name: "Partner" })).toBeVisible();
    await expect(drawer.getByText("Account")).toBeVisible();
    const moreNav = await drawer.getByRole("navigation", { name: "More" }).boundingBox();
    const closeButton = await drawer.getByRole("button", { name: "Close" }).boundingBox();
    expect(moreNav?.width ?? 0).toBeGreaterThan(200);
    expect(closeButton?.width ?? 999).toBeLessThan(140);
  });
});

test.describe("contact and legal pages", () => {
  test("contact shows a mailto email and placeholder telephone links", async ({ page }) => {
    await page.goto("/contact");
    const email = page.getByRole("link", { name: "help@rafeeq.health" });
    await expect(email).toHaveAttribute("href", "mailto:help@rafeeq.health");
    await expect(page.getByRole("link", { name: "+971 50 000 0000" })).toHaveAttribute(
      "href",
      "tel:+971500000000",
    );
    await expect(page.getByRole("link", { name: "+971 55 000 0000" })).toHaveAttribute(
      "href",
      "tel:+971550000000",
    );
    await expect(page.getByText("Demo placeholder")).toBeVisible();
    await expect(page.getByText(/Temporary demo numbers/)).toBeVisible();
    await expect(page.getByText(/prototype/i)).toHaveCount(0);

    await page.getByLabel("Your name").fill("Test Visitor");
    await page.getByLabel("Email address").fill("visitor@example.com");
    await page.getByLabel("Message").fill("A question about privacy settings.");
    await page.getByRole("button", { name: "Prepare message" }).click();
    await expect(page.getByText(/Online sending is not available yet/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Open in your email app" })).toHaveAttribute(
      "href",
      /^mailto:help@rafeeq\.health\?subject=/,
    );
  });

  test("terms and privacy policy read as finished pages", async ({ page }) => {
    for (const path of ["/terms", "/privacy-policy"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const main = page.locator("main");
      await expect(main).not.toContainText("Draft —");
      await expect(main).not.toContainText("requires legal review");
      await expect(main).not.toContainText("LEGAL_REVIEW");
      await expect(main).not.toContainText("OPEN_QUESTION");
      await expect(main).not.toContainText("To be completed before publication");
    }
    await page.goto("/terms");
    await expect(page.getByRole("heading", { level: 2, name: "1. About RAFEEQ" })).toBeVisible();
  });
});

test.describe("demo indicators", () => {
  test("fictional results stay labelled; partner note is concise", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await enterDemo(page);
    await expect(page.locator("main").getByText("Demo example", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Review your screening report" }).click();
    await expect(page.locator("[data-demo-label]").first()).toBeVisible();
    await expect(page.getByText("SYNTHETIC DEMONSTRATION DATA", { exact: false })).toHaveCount(0);

    await page
      .getByRole("navigation", { name: "More" })
      .getByRole("link", { name: "Partner" })
      .click();
    await expect(page.getByText("Demo invitation — no message will be sent.")).toBeVisible();
    await expect(page.getByText(/Everything on this page is a simulation/)).toHaveCount(0);
  });
});

test.describe("How It Works steps", () => {
  test("stages respond to hover, keyboard focus and link to detail pages", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/how-it-works");
    const stages = page.locator("a.step-card");
    await expect(stages).toHaveCount(6);
    const first = stages.first();
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveCSS("cursor", "pointer");
    const restingShadow = await first.evaluate((el) => getComputedStyle(el).boxShadow);
    await first.hover();
    await expect
      .poll(() => first.evaluate((el) => getComputedStyle(el).boxShadow))
      .not.toBe(restingShadow);
    await expect
      .poll(() => first.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe("none");

    await page.mouse.move(0, 0);
    await first.focus();
    await expect(first).toBeFocused();
    await expect(first).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/understanding-genetic-risk$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });
});

for (const theme of ["light", "dark"] as const) {
  test(`key pages render in the ${theme} theme`, async ({ page }) => {
    await page.addInitScript((value) => {
      localStorage.setItem("rafeeq.theme", value);
    }, theme);
    await page.setViewportSize({ width: 1024, height: 900 });
    for (const path of ["/how-it-works", "/contact", "/terms", "/demo"]) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
    await enterDemo(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.locator("aside").getByRole("navigation", { name: "More" })).toBeVisible();
  });
}
