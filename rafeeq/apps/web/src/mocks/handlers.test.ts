import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { apiRequest } from "@/lib/api";
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

  it("returns an empty fixture for every Section 6 endpoint", async () => {
    expect(hasPersonaFixtures(personaFile)).toBe(false);
    expect(mockPayload(personaFile)).toBeNull();
    expect(mockPayload({ P1: { id: "P1" } })).toBeNull();
    expect(apiEndpoints).toHaveLength(28);

    for (const endpoint of apiEndpoints) {
      const result = await apiRequest<null>(`/api/v1${endpoint.example}`, {
        method: endpoint.method.toUpperCase(),
      });
      expect(result.data, `${endpoint.method} ${endpoint.path}`).toBeNull();
      expect(result.meta.request_id.length, endpoint.path).toBeGreaterThan(0);
    }
  });
});
