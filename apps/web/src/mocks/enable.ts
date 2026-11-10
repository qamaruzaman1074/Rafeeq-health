export function mocksEnabled(flag: string | undefined): boolean {
  return flag === "true";
}

/**
 * Starts MSW when `VITE_USE_MOCKS=true` (local dev and static demo deploys).
 * Production builds must bake that flag in at build time; there is no live API on Hosting yet.
 */
export async function prepareMocks(flag: string | undefined): Promise<void> {
  if (!mocksEnabled(flag)) {
    return;
  }
  try {
    const browser = await import("@/mocks/browser");
    await browser.startMockWorker();
  } catch {
    // PWA or hosting may block a second service worker; demo persona cookie still binds MSW when it loads.
  }
}
