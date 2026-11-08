import { http, HttpResponse, type HttpHandler } from "msw";
import { shareGate } from "@/features/couple/share-state";
import { findPersona, type Persona } from "@/features/personas";
import { mockPayload, personaFile } from "@/mocks/fixtures";
import { consentsFor, explainFor, overlapFor, ownResultFor } from "@/mocks/kernel-fixture";
import { currentPersonaId, rememberPersona } from "@/mocks/persona-state";

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

function envelope(data: unknown) {
  return HttpResponse.json({
    data,
    meta: { request_id: crypto.randomUUID() },
  });
}

function activePersona(): Persona | null {
  const personaId = currentPersonaId();
  if (personaId === null) {
    return null;
  }
  return findPersona(personaId) ?? null;
}

function hiddenExplain(persona: Persona) {
  const reason =
    shareGate(consentsFor(persona)) === "declined" ? "sharing_declined" : "consent_missing";
  return HttpResponse.json(
    {
      error: {
        code: reason,
        message_key: reason === "sharing_declined" ? "sharingDeclined" : "consentMissing",
        request_id: crypto.randomUUID(),
      },
    },
    { status: 403 },
  );
}

function isPersonaBacked(endpoint: ApiEndpoint): boolean {
  return (
    (endpoint.method === "get" && endpoint.path === "/results/mine") ||
    (endpoint.method === "get" && endpoint.path === "/results/overlap") ||
    (endpoint.method === "get" && endpoint.path === "/consents") ||
    (endpoint.method === "post" && endpoint.path === "/explain/overlap")
  );
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
    rememberPersona(persona.id);
    return guestSession(persona.id);
  }),
  http.get("*/api/v1/results/mine", () => {
    const persona = activePersona();
    return envelope(persona === null ? null : ownResultFor(persona));
  }),
  http.get("*/api/v1/results/overlap", () => {
    const persona = activePersona();
    return envelope(persona === null ? null : overlapFor(persona));
  }),
  http.get("*/api/v1/consents", () => {
    const persona = activePersona();
    return envelope(persona === null ? null : consentsFor(persona));
  }),
  http.post("*/api/v1/explain/overlap", () => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    const card = explainFor(persona);
    if (card === null) {
      return hiddenExplain(persona);
    }
    return envelope({ fact_card: card });
  }),
  ...apiEndpoints
    .filter((endpoint) => endpoint.path !== "/auth/guest" && !isPersonaBacked(endpoint))
    .map((endpoint) => httpByMethod[endpoint.method](`*/api/v1${endpoint.path}`, () => respond())),
];
