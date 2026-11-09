import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/app/router";
import { AppProviders } from "@/app/providers";
import { mocksEnabled, prepareMocks } from "@/mocks/enable";
import { installDemoTestHarness } from "@/mocks/test-harness";
import "@/styles/globals.css";

async function boot(): Promise<void> {
  await prepareMocks(import.meta.env.VITE_USE_MOCKS);
  if (mocksEnabled(import.meta.env.VITE_USE_MOCKS)) {
    installDemoTestHarness();
  }
  const rootElement = document.getElementById("root");
  if (rootElement === null) {
    throw new Error("Root element #root is missing");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </StrictMode>,
  );
}

void boot();
