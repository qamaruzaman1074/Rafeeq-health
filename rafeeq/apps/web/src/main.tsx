import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/app/router";
import { AppProviders } from "@/app/providers";
import { prepareMocks } from "@/mocks/enable";
import "@/styles/globals.css";

async function boot(): Promise<void> {
  await prepareMocks(import.meta.env.VITE_USE_MOCKS);
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
