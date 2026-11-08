export function mocksEnabled(flag: string | undefined): boolean {
  return flag === "true";
}

async function startBrowserMocks(): Promise<void> {
  const browser = await import("@/mocks/browser");
  await browser.startMockWorker();
}

export async function prepareMocks(
  flag: string | undefined,
  start: () => Promise<void> = startBrowserMocks,
): Promise<void> {
  if (!mocksEnabled(flag)) {
    return;
  }
  await start();
}
