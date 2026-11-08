import { afterAll, afterEach, beforeAll } from "vitest";
import { resetCareSessions } from "@/mocks/care-fixture";
import { resetActivePersona } from "@/mocks/persona-state";
import { resetPrivacySessions } from "@/mocks/privacy-fixture";
import { server } from "@/test/mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
  resetActivePersona();
  resetPrivacySessions();
  resetCareSessions();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
