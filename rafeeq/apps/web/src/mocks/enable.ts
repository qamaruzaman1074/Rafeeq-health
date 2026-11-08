export function mocksEnabled(flag: string | undefined): boolean {
  return flag === "true";
}

export async function prepareMocks(flag: string | undefined): Promise<void> {
  if (!import.meta.env.DEV || !mocksEnabled(flag)) {
    return;
  }
  const browser = await import("@/mocks/browser");
  await browser.startMockWorker();
}
