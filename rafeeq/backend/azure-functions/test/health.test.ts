import { describe, expect, it } from "vitest";
import { healthJson } from "../src/utils/http-response.js";
import type { HealthResponse } from "../src/types/api.js";

describe("GET /api/health payload", () => {
  it("matches the scaffold contract", () => {
    const response = healthJson(null);
    const body = response.jsonBody as HealthResponse;
    expect(body).toEqual({
      success: true,
      message: "Rafeeq backend is running",
      service: "azure-functions",
    });
    expect(response.status).toBe(200);
  });
});
