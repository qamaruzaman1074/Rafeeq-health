import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { handlePreflight } from "../middleware/cors.js";
import { rejectWrongMethod } from "../middleware/validate.js";
import { logInfo } from "../utils/logger.js";
import { healthJson } from "../utils/http-response.js";
import { corsHeaders } from "../middleware/cors.js";

async function healthHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const origin = request.headers.get("origin");
  const method = request.method;

  if (handlePreflight(origin, method)) {
    return {
      status: 204,
      headers: corsHeaders(origin),
    };
  }

  const methodError = rejectWrongMethod(method, ["GET"], origin);
  if (methodError !== null) {
    return methodError;
  }

  logInfo(context, "health_check", { appEnv: process.env.APP_ENV ?? "unknown" });
  return healthJson(origin);
}

export function registerHealthFunction(): void {
  app.http("health", {
    methods: ["GET", "OPTIONS"],
    authLevel: "anonymous",
    route: "health",
    handler: healthHandler,
  });
}
