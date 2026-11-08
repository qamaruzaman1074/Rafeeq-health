import { http, HttpResponse, type HttpHandler } from "msw";
import { clinicShareGranted } from "@/features/care/steps";
import { shareGate, type ConsentRow } from "@/features/couple/share-state";
import { audioUrlForBlock, readLocaleBlock, type LocaleCode } from "@/features/learn/blocks";
import { glossaryBlockId } from "@/features/learn/modules";
import { findPersona, type Persona } from "@/features/personas";
import { answerAsk, parseAskBody } from "@/mocks/ask-fixture";
import { answerFor, itemsForPersona, parseAnswerBody } from "@/mocks/comprehension-fixture";
import { mockPayload, personaFile } from "@/mocks/fixtures";
import { explainFor, overlapFor, ownResultFor } from "@/mocks/kernel-fixture";
import { beginCareSession, createReferral, pathwayPayload } from "@/mocks/care-fixture";
import {
  applyStatus,
  briefPayload,
  counsellorAuditEntries,
  queuePayload,
  recordBriefRead,
} from "@/mocks/clinic-fixture";
import {
  beginCounsellorSession,
  counsellorActive,
  endCounsellorSession,
} from "@/mocks/counsellor-session";
import { currentPersonaId, rememberPersona } from "@/mocks/persona-state";
import {
  auditEntries,
  beginPrivacySession,
  mineConsents,
  partnerConsents,
  postMineConsent,
  receiptFor,
} from "@/mocks/privacy-fixture";

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

function hiddenExplain(rows: readonly ConsentRow[]) {
  const reason = shareGate(rows) === "declined" ? "sharing_declined" : "consent_missing";
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

function isLearnBacked(endpoint: ApiEndpoint): boolean {
  return (
    (endpoint.method === "get" && endpoint.path === "/explain/glossary/:term") ||
    (endpoint.method === "post" && endpoint.path === "/tts")
  );
}

function isComprehensionBacked(endpoint: ApiEndpoint): boolean {
  return (
    (endpoint.method === "get" && endpoint.path === "/comprehension/items") ||
    (endpoint.method === "post" && endpoint.path === "/comprehension/answer")
  );
}

function isAskBacked(endpoint: ApiEndpoint): boolean {
  return endpoint.method === "post" && endpoint.path === "/ask";
}

function isPrivacyBacked(endpoint: ApiEndpoint): boolean {
  return (
    (endpoint.method === "post" && endpoint.path === "/consents") ||
    (endpoint.method === "get" && endpoint.path === "/consents/receipt/:id") ||
    (endpoint.method === "get" && endpoint.path === "/audit")
  );
}

function isCareBacked(endpoint: ApiEndpoint): boolean {
  return (
    (endpoint.method === "get" && endpoint.path === "/pathway") ||
    (endpoint.method === "post" && endpoint.path === "/referrals")
  );
}

function isClinicBacked(endpoint: ApiEndpoint): boolean {
  return (
    (endpoint.method === "post" && endpoint.path === "/auth/login") ||
    (endpoint.method === "get" && endpoint.path === "/counsellor/queue") ||
    (endpoint.method === "get" && endpoint.path === "/counsellor/referrals/:id/brief") ||
    (endpoint.method === "patch" && endpoint.path === "/counsellor/referrals/:id")
  );
}

function localeFrom(value: string | null): LocaleCode {
  return value === "ar" ? "ar" : "en";
}

function missingBlock() {
  return HttpResponse.json(
    {
      error: {
        code: "missing_block",
        message_key: "missingBlock",
        request_id: crypto.randomUUID(),
      },
    },
    { status: 400 },
  );
}

async function readTtsBody(
  request: Request,
): Promise<{ blockId: string; locale: LocaleCode } | null> {
  try {
    const body: unknown = await request.json();
    if (body === null || typeof body !== "object" || !("block_id" in body)) {
      return null;
    }
    const blockId = body.block_id;
    if (typeof blockId !== "string" || blockId.trim().length === 0) {
      return null;
    }
    const localeValue = "locale" in body && typeof body.locale === "string" ? body.locale : null;
    return { blockId, locale: localeFrom(localeValue) };
  } catch {
    return null;
  }
}

function guestSession(personaId: string) {
  return HttpResponse.json({
    data: { role: "guest", persona_id: personaId },
    meta: { request_id: crypto.randomUUID() },
  });
}

function answerError(code: string, messageKey: string) {
  return HttpResponse.json(
    {
      error: {
        code,
        message_key: messageKey,
        request_id: crypto.randomUUID(),
      },
    },
    { status: 400 },
  );
}

function consentError(status: number, code: string, messageKey: string) {
  return HttpResponse.json(
    {
      error: {
        code,
        message_key: messageKey,
        request_id: crypto.randomUUID(),
      },
    },
    { status },
  );
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
    endCounsellorSession();
    beginPrivacySession(persona);
    beginCareSession(persona.id);
    rememberPersona(persona.id);
    return guestSession(persona.id);
  }),
  http.get("*/api/v1/results/mine", () => {
    const persona = activePersona();
    return envelope(persona === null ? null : ownResultFor(persona));
  }),
  http.get("*/api/v1/results/overlap", () => {
    const persona = activePersona();
    return envelope(persona === null ? null : overlapFor(persona, partnerConsents(persona)));
  }),
  http.get("*/api/v1/consents", ({ request }) => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    const mine = new URL(request.url).searchParams.get("mine") === "true";
    return envelope(mine ? mineConsents(persona) : partnerConsents(persona));
  }),
  http.post("*/api/v1/consents", async ({ request }) => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      body = null;
    }
    const written = postMineConsent(persona, body);
    if (written.status === "invalid") {
      return consentError(400, "missing_consent", "missingConsent");
    }
    if (written.status === "permanent") {
      return consentError(400, "view_own_permanent", "viewOwnPermanent");
    }
    return envelope(written.consents);
  }),
  http.get("*/api/v1/consents/receipt/:id", ({ params }) => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    const id = typeof params.id === "string" ? params.id : "";
    const receipt = receiptFor(persona, id);
    if (receipt === null) {
      return consentError(404, "unknown_receipt", "unknownReceipt");
    }
    return envelope(receipt);
  }),
  http.get("*/api/v1/audit", ({ request }) => {
    const mine = new URL(request.url).searchParams.get("mine") === "true";
    if (mine) {
      const persona = activePersona();
      if (persona === null) {
        return envelope(null);
      }
      return envelope(auditEntries(persona));
    }
    if (counsellorActive()) {
      return envelope(counsellorAuditEntries());
    }
    return envelope(null);
  }),
  http.post("*/api/v1/auth/login", async ({ request }) => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      body = null;
    }
    if (body !== null && typeof body === "object" && "role" in body && body.role === "counsellor") {
      beginCounsellorSession();
      return envelope({ role: "counsellor" });
    }
    return envelope(null);
  }),
  http.get("*/api/v1/counsellor/queue", () => {
    if (!counsellorActive()) {
      return envelope(null);
    }
    return envelope(queuePayload());
  }),
  http.get("*/api/v1/counsellor/referrals/:id/brief", ({ request, params }) => {
    if (!counsellorActive()) {
      return envelope(null);
    }
    const id = typeof params.id === "string" ? params.id : "";
    const locale = localeFrom(new URL(request.url).searchParams.get("locale"));
    const brief = briefPayload(id, locale);
    if (brief === null) {
      return consentError(404, "unknown_referral", "unknownReferral");
    }
    recordBriefRead(id);
    return envelope(brief);
  }),
  http.patch("*/api/v1/counsellor/referrals/:id", async ({ params, request }) => {
    if (!counsellorActive()) {
      return envelope(null);
    }
    const id = typeof params.id === "string" ? params.id : "";
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      body = null;
    }
    const updated = applyStatus(id, body);
    if (updated.status === "unknown") {
      return consentError(404, "unknown_referral", "unknownReferral");
    }
    if (updated.status === "invalid") {
      return consentError(400, "invalid_status", "invalidStatus");
    }
    return envelope({ id: updated.id, status: updated.referralStatus });
  }),
  http.post("*/api/v1/explain/overlap", () => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    const rows = partnerConsents(persona);
    const card = explainFor(persona, rows);
    if (card === null) {
      return hiddenExplain(rows);
    }
    return envelope({ fact_card: card });
  }),
  http.get("*/api/v1/explain/glossary/:term", ({ request, params }) => {
    const term = typeof params.term === "string" ? params.term : "";
    const locale = localeFrom(new URL(request.url).searchParams.get("locale"));
    const blockId = glossaryBlockId(term);
    const block = readLocaleBlock(locale, blockId);
    return envelope({
      term,
      block_id: blockId,
      locale,
      text: block.text,
    });
  }),
  http.post("*/api/v1/tts", async ({ request }) => {
    const body = await readTtsBody(request);
    if (body === null) {
      return missingBlock();
    }
    const block = readLocaleBlock(body.locale, body.blockId);
    return envelope({
      block_id: body.blockId,
      locale: body.locale,
      url: audioUrlForBlock(body.blockId, block.audioUrl),
      text: block.text,
    });
  }),
  http.get("*/api/v1/comprehension/items", ({ request }) => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    const locale = localeFrom(new URL(request.url).searchParams.get("locale"));
    return envelope(itemsForPersona(persona, locale));
  }),
  http.post("*/api/v1/comprehension/answer", async ({ request }) => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return answerError("missing_answer", "missingAnswer");
    }
    const parsed = parseAnswerBody(raw);
    if (parsed === null) {
      return answerError("missing_answer", "missingAnswer");
    }
    const answered = answerFor(parsed);
    if (answered === "item") {
      return answerError("unknown_item", "unknownItem");
    }
    if (answered === "option") {
      return answerError("unknown_option", "unknownOption");
    }
    return envelope(answered);
  }),
  http.post("*/api/v1/ask", async ({ request }) => {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return answerError("missing_question", "missingQuestion");
    }
    const parsed = parseAskBody(raw);
    if (parsed === "too_long") {
      return answerError("question_too_long", "questionTooLong");
    }
    if (parsed === "missing") {
      return answerError("missing_question", "missingQuestion");
    }
    return envelope(answerAsk(parsed));
  }),
  http.get("*/api/v1/pathway", () => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    return envelope(pathwayPayload(persona));
  }),
  http.post("*/api/v1/referrals", () => {
    const persona = activePersona();
    if (persona === null) {
      return envelope(null);
    }
    if (!clinicShareGranted(mineConsents(persona))) {
      return consentError(403, "clinic_share_required", "clinicShareRequired");
    }
    return envelope(createReferral(persona));
  }),
  ...apiEndpoints
    .filter(
      (endpoint) =>
        endpoint.path !== "/auth/guest" &&
        !isPersonaBacked(endpoint) &&
        !isLearnBacked(endpoint) &&
        !isComprehensionBacked(endpoint) &&
        !isAskBacked(endpoint) &&
        !isPrivacyBacked(endpoint) &&
        !isCareBacked(endpoint) &&
        !isClinicBacked(endpoint),
    )
    .map((endpoint) => httpByMethod[endpoint.method](`*/api/v1${endpoint.path}`, () => respond())),
];
