import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { personas } from "@/features/personas";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { mocksEnabled, prepareMocks } from "@/mocks/enable";
import { hasPersonaFixtures, mockPayload, personaFile } from "@/mocks/fixtures";
import { apiEndpoints } from "@/mocks/handlers";

describe("mock API", () => {
  it("turns on only when VITE_USE_MOCKS=true", async () => {
    expect(mocksEnabled(undefined)).toBe(false);
    expect(mocksEnabled("")).toBe(false);
    expect(mocksEnabled("false")).toBe(false);
    expect(mocksEnabled("true")).toBe(true);

    const started: string[] = [];
    const start = () => {
      started.push("started");
      return Promise.resolve();
    };
    await prepareMocks(undefined, start);
    await prepareMocks("false", start);
    expect(started).toEqual([]);
    await prepareMocks("true", start);
    expect(started).toEqual(["started"]);

    const main = readFileSync(new URL("../main.tsx", import.meta.url), "utf8");
    expect(main).toContain("prepareMocks(import.meta.env.VITE_USE_MOCKS)");
  });

  it("returns an empty fixture for Section 6 endpoints other than guest", async () => {
    expect(hasPersonaFixtures(personaFile)).toBe(true);
    expect(mockPayload(personaFile)).toBeNull();
    expect(mockPayload({ P1: { id: "P1" } })).toBeNull();
    expect(apiEndpoints).toHaveLength(28);

    const endpoints = apiEndpoints.filter(
      (endpoint) =>
        endpoint.path !== "/auth/guest" &&
        endpoint.path !== "/explain/glossary/:term" &&
        endpoint.path !== "/tts",
    );
    expect(endpoints).toHaveLength(25);

    for (const endpoint of endpoints) {
      const result = await apiRequest<null>(`/api/v1${endpoint.example}`, {
        method: endpoint.method.toUpperCase(),
      });
      expect(result.data, `${endpoint.method} ${endpoint.path}`).toBeNull();
      expect(result.meta.request_id.length, endpoint.path).toBeGreaterThan(0);
    }
  });

  it("binds POST /auth/guest to a persona from the fixture file", async () => {
    expect(personas.map((persona) => persona.id)).toEqual([
      "P1",
      "P2",
      "P3",
      "P4",
      "P5",
      "P6",
      "P7",
    ]);

    for (const persona of personas) {
      const result = await apiRequest<{ role: string; persona_id: string }>("/api/v1/auth/guest", {
        method: "POST",
        body: JSON.stringify({ persona_id: persona.id }),
      });
      expect(result.data).toEqual({ role: "guest", persona_id: persona.id });
    }

    await expect(
      apiRequest("/api/v1/auth/guest", {
        method: "POST",
        body: JSON.stringify({ persona_id: "P0" }),
      }),
    ).rejects.toMatchObject({
      name: "ApiRequestError",
      messageKey: "unknownPersona",
    });
    await expect(apiRequest("/api/v1/auth/guest", { method: "POST" })).rejects.toBeInstanceOf(
      ApiRequestError,
    );
  });
});
