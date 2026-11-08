import { z } from "zod";

/**
 * OPEN_QUESTION: `packages/contracts/types.ts` is still an empty openapi-typescript
 * placeholder, so this module validates the documented response envelopes locally.
 * `data` stays generic until generated contract types exist. This file does not
 * declare API endpoints.
 */

const responseMetaSchema = z.object({
  request_id: z.string(),
});

const successEnvelopeSchema = z.object({
  data: z.unknown(),
  meta: responseMetaSchema,
});

const errorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message_key: z.string(),
    request_id: z.string(),
  }),
});

export type ResponseMeta = z.infer<typeof responseMetaSchema>;

export interface ApiSuccess<T> {
  data: T;
  meta: ResponseMeta;
}

export type ApiErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;

export class ApiRequestError extends Error {
  readonly code: string;
  readonly messageKey: string;
  readonly requestId: string;
  readonly status: number;

  constructor(status: number, body: ApiErrorEnvelope) {
    super(body.error.code);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = body.error.code;
    this.messageKey = body.error.message_key;
    this.requestId = body.error.request_id;
  }
}

function readApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_BASE_URL;
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\/+$/, "");
}

function buildApiUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error("API path must start with '/'");
  }
  return `${readApiBaseUrl()}${path}`;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<ApiSuccess<T>> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error("API response was not JSON");
  }

  if (!response.ok) {
    const parsed = errorEnvelopeSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error("Error response did not match the API error envelope");
    }
    throw new ApiRequestError(response.status, parsed.data);
  }

  const parsed = successEnvelopeSchema.safeParse(body);
  if (!parsed.success) {
    throw new Error("Success response did not match the API envelope");
  }

  return {
    // Caller-supplied until packages/contracts types are generated.
    data: parsed.data.data as T,
    meta: parsed.data.meta,
  };
}
