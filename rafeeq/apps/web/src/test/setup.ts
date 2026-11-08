import { afterAll, afterEach, beforeAll } from "vitest";
import { resetActivePersona } from "@/mocks/persona-state";
import { resetPrivacySessions } from "@/mocks/privacy-fixture";
import { server } from "@/test/mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
  resetActivePersona();
  resetPrivacySessions();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
