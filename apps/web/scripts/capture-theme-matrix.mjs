import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium, devices } from "@playwright/test";

const port = 5173;
const baseURL = `http://127.0.0.1:${port}`;
const outDir = process.argv[2] ?? "/opt/cursor/artifacts/theme-matrix";

const matrix = [
  { theme: "light", lang: "en", viewport: { width: 1280, height: 900 }, name: "light-en-desktop" },
  { theme: "dark", lang: "en", viewport: { width: 1280, height: 900 }, name: "dark-en-desktop" },
  { theme: "light", lang: "ar", viewport: { width: 1280, height: 900 }, name: "light-ar-desktop" },
  { theme: "dark", lang: "ar", viewport: { width: 1280, height: 900 }, name: "dark-ar-desktop" },
  { theme: "light", lang: "en", viewport: { width: 390, height: 844 }, name: "light-en-mobile" },
  { theme: "dark", lang: "en", viewport: { width: 390, height: 844 }, name: "dark-en-mobile" },
  { theme: "light", lang: "ar", viewport: { width: 390, height: 844 }, name: "light-ar-mobile" },
  { theme: "dark", lang: "ar", viewport: { width: 390, height: 844 }, name: "dark-ar-mobile" },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["Desktop Chrome"], baseURL });

for (const item of matrix) {
  const page = await context.newPage();
  await page.addInitScript(
    ({ theme, lang }) => {
      localStorage.setItem("rafeeq.theme", theme);
      localStorage.setItem("rafeeq.lang", lang);
    },
    { theme: item.theme, lang: item.lang },
  );
  await page.setViewportSize(item.viewport);
  await page.goto("/");
  await page.waitForSelector("[data-screen='/']");
  await page.screenshot({
    path: path.join(outDir, `${item.name}.png`),
    fullPage: true,
  });
  await page.close();
}

await browser.close();
console.log(`Saved ${matrix.length} screenshots to ${outDir}`);
