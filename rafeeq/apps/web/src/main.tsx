import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/app/router";
import { AppProviders } from "@/app/providers";
import "@/styles/globals.css";

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
