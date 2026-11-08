import { afterAll, afterEach, beforeAll } from "vitest";
import { resetCareSessions } from "@/mocks/care-fixture";
import { resetClinicQueue } from "@/mocks/clinic-fixture";
import { endAnalystSession } from "@/mocks/analyst-session";
import { endCounsellorSession } from "@/mocks/counsellor-session";
import { resetActivePersona } from "@/mocks/persona-state";
import { resetPrivacySessions } from "@/mocks/privacy-fixture";
import { server } from "@/test/mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
  endCounsellorSession();
  endAnalystSession();
  resetClinicQueue();
  resetActivePersona();
  resetPrivacySessions();
  resetCareSessions();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
