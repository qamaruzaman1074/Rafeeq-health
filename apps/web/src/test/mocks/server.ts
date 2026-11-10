import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers";

/** Node server for Vitest. The browser worker starts only when VITE_USE_MOCKS=true. */
export const server = setupServer(...handlers);
