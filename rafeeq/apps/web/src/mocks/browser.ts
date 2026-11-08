import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers";

export async function startMockWorker(): Promise<void> {
  const worker = setupWorker(...handlers);
  await worker.start({
    onUnhandledFrame: "bypass",
    quiet: true,
    serviceWorker: { url: "/mockServiceWorker.js" },
  });
}
