import { http, HttpResponse, type HttpHandler } from "msw";
import { findPersona } from "@/features/personas";
import { mockPayload, personaFile } from "@/mocks/fixtures";

type HttpMethod = "get" | "post" | "patch" | "delete";

export type ApiEndpoint = {
  method: HttpMethod;
  path: string;
  example: string;
};

const httpByMethod = {
  get: http.get,
  post: http.post,
  patch: http.patch,
  delete: http.delete,
} as const;

// OPEN_QUESTION: Section 6 fixes the envelope, not response bodies. Handlers
// other than POST /auth/guest keep data null. No handler invents a JWT.
export const apiEndpoints: readonly ApiEndpoint[] = [
  { method: "post", path: "/auth/guest", example: "/auth/guest" },
  { method: "post", path: "/auth/login", example: "/auth/login" },
  { method: "post", path: "/auth/register", example: "/auth/register" },
  { method: "get", path: "/me", example: "/me" },
  { method: "patch", path: "/me/preferences", example: "/me/preferences" },
  { method: "get", path: "/results/mine", example: "/results/mine" },
  { method: "get", path: "/results/overlap", example: "/results/overlap" },
  { method: "post", path: "/explain/overlap", example: "/explain/overlap" },
  {
    method: "get",
    path: "/explain/glossary/:term",
    example: "/explain/glossary/term",
  },
  { method: "post", path: "/ask", example: "/ask" },
  { method: "get", path: "/comprehension/items", example: "/comprehension/items" },
  { method: "post", path: "/comprehension/answer", example: "/comprehension/answer" },
  { method: "get", path: "/consents", example: "/consents" },
  { method: "post", path: "/consents", example: "/consents" },
  { method: "post", path: "/shares", example: "/shares" },
  { method: "delete", path: "/shares/:id", example: "/shares/example" },
  {
    method: "get",
    path: "/consents/receipt/:id",
    example: "/consents/receipt/example",
  },
  { method: "get", path: "/pathway", example: "/pathway" },
  { method: "post", path: "/referrals", example: "/referrals" },
  { method: "get", path: "/counsellor/queue", example: "/counsellor/queue" },
  {
    method: "get",
    path: "/counsellor/referrals/:id/brief",
    example: "/counsellor/referrals/example/brief",
  },
  {
    method: "patch",
    path: "/counsellor/referrals/:id",
    example: "/counsellor/referrals/example",
  },
  { method: "get", path: "/insights/kpis", example: "/insights/kpis" },
  { method: "get", path: "/insights/equity", example: "/insights/equity" },
  { method: "get", path: "/audit", example: "/audit" },
  { method: "post", path: "/tts", example: "/tts" },
  { method: "get", path: "/health", example: "/health" },
  { method: "get", path: "/version", example: "/version" },
];

function respond() {
  return HttpResponse.json({
    data: mockPayload(personaFile),
    meta: { request_id: crypto.randomUUID() },
  });
}

function guestSession(personaId: string) {
  return HttpResponse.json({
    data: { role: "guest", persona_id: personaId },
    meta: { request_id: crypto.randomUUID() },
  });
}

function unknownPersona() {
  return HttpResponse.json(
    {
      error: {
        code: "unknown_persona",
        message_key: "unknownPersona",
        request_id: crypto.randomUUID(),
      },
    },
    { status: 400 },
  );
}

async function readPersonaId(request: Request): Promise<string> {
  try {
    const body: unknown = await request.json();
    if (body !== null && typeof body === "object" && "persona_id" in body) {
      const value = body.persona_id;
      if (typeof value === "string") {
        return value;
      }
    }
  } catch {
    return "";
  }
  return "";
}

export const handlers: HttpHandler[] = [
  http.post("*/api/v1/auth/guest", async ({ request }) => {
    const personaId = await readPersonaId(request);
    const persona = findPersona(personaId);
    if (persona === undefined) {
      return unknownPersona();
    }
    return guestSession(persona.id);
  }),
  ...apiEndpoints
    .filter((endpoint) => endpoint.path !== "/auth/guest")
    .map((endpoint) => httpByMethod[endpoint.method](`*/api/v1${endpoint.path}`, () => respond())),
];
