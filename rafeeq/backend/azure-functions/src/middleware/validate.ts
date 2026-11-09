import type { HttpResponseInit } from "@azure/functions";
import { errorJson } from "../utils/http-response.js";

export function rejectWrongMethod(
  actual: string,
  allowed: string[],
  origin: string | null,
): HttpResponseInit | null {
  if (allowed.includes(actual.toUpperCase())) {
    return null;
  }
  return errorJson(405, "method_not_allowed", `Use ${allowed.join(", ")}`, origin);
}
