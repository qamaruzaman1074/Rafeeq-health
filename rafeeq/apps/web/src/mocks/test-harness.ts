import { startAnalystSession } from "@/features/insights/session";
import { startCounsellorSession } from "@/features/clinic/session";

type DemoTestHarness = {
  counsellor: () => Promise<void>;
  analyst: () => Promise<void>;
};

declare global {
  interface Window {
    rafeeqDemoTest?: DemoTestHarness;
  }
}

/** Playwright helpers when demo queue buttons are not on `/demo`. */
export function installDemoTestHarness(): void {
  window.rafeeqDemoTest = {
    counsellor: startCounsellorSession,
    analyst: startAnalystSession,
  };
}
