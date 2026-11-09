import { loadEnv } from "../config/env.js";

function isAllowedOrigin(origin: string, allowed: string[]): boolean {
  if (allowed.length === 0) {
    return false;
  }
  return allowed.some((entry) => entry === "*" || entry === origin);
}

export function corsHeaders(requestOrigin: string | null): Record<string, string> {
  const { allowedOrigins } = loadEnv();
  if (requestOrigin === null || requestOrigin.length === 0) {
    return {};
  }
  if (!isAllowedOrigin(requestOrigin, allowedOrigins)) {
    return {};
  }
  return {
    "Access-Control-Allow-Origin": requestOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export function handlePreflight(requestOrigin: string | null, method: string): boolean {
  return method.toUpperCase() === "OPTIONS";
}
