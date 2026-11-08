import { setupServer } from "msw/node";

/** Test server with no product handlers. Clinical API mocks are out of scope. */
export const server = setupServer();
