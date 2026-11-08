import { afterAll, afterEach, beforeAll } from "vitest";
import { resetActivePersona } from "@/mocks/persona-state";
import { server } from "@/test/mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
  resetActivePersona();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
