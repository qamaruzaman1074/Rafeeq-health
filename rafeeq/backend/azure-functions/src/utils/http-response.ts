import type { HttpResponseInit } from "@azure/functions";
import type { ApiErrorBody, HealthResponse } from "../types/api.js";
import { corsHeaders } from "../middleware/cors.js";

export function jsonResponse(
  status: number,
  body: unknown,
  origin: string | null,
): HttpResponseInit {
  return {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
    jsonBody: body,
  };
}

export function healthJson(origin: string | null): HttpResponseInit {
  const body: HealthResponse = {
    success: true,
    message: "Rafeeq backend is running",
    service: "azure-functions",
  };
  return jsonResponse(200, body, origin);
}

export function errorJson(
  status: number,
  code: string,
  message: string,
  origin: string | null,
): HttpResponseInit {
  const body: ApiErrorBody = {
    success: false,
    error: { code, message },
  };
  return jsonResponse(status, body, origin);
}
