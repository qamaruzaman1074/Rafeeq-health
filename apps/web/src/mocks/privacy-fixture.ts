import { CONSENT_SCOPES, type ConsentRow, type ConsentScope } from "@/features/couple/share-state";
import {
  consentPostSchema,
  type AuditEntry,
  type ConsentReceipt,
  type MineConsent,
} from "@/features/privacy/types";
import type { Persona } from "@/features/personas";
import { consentsFor } from "@/mocks/kernel-fixture";

/**
 * OPEN_QUESTION: Section 6 does not define consent, receipt, or audit bodies.
 * The unscoped consent list stays the partner rows the couple page already uses.
 * `?mine=true` is the signed-in user's Section 5 scopes. Partner "a" stands in
 * for that user because personas have no user id. Receipt `hash` and `prev_hash`
 * stay null because a signing scheme is not specified. Seed audit rows use
 * `read` for an access to results, shares, or consents (Section 8). They are
 * the same for every persona and name no gene and no person.
 */

const CREATED_AT = "2026-11-08T11:00:00.000Z";
const EVENT_BASE = Date.parse("2026-11-08T13:00:00.000Z");

type StoredConsent = {
  id: string;
  scope: ConsentScope;
  granted: boolean;
  version: number;
  created_at: string;
  at: string;
};

type PrivacySession = {
  partnerRows: ConsentRow[];
  mine: StoredConsent[];
  audit: AuditEntry[];
  serial: number;
};

export type ConsentWrite =
  { status: "invalid" } | { status: "permanent" } | { status: "saved"; consents: MineConsent[] };

const sessions = new Map<string, PrivacySession>();

function overlapGrant(persona: Persona): boolean {
  const row = consentsFor(persona).find(
    (item) => item.partner === "a" && item.scope === "share_overlap_with_partner",
  );
  return row?.granted ?? false;
}

function seedMine(persona: Persona): StoredConsent[] {
  const granted: Record<ConsentScope, boolean> = {
    view_own: true,
    share_overlap_with_partner: overlapGrant(persona),
    share_with_clinic: false,
    research_aggregate: false,
  };
  return CONSENT_SCOPES.map((scope) => ({
    id: `consent-${persona.id}-${scope}`,
    scope,
    granted: granted[scope] ?? false,
    version: 1,
    created_at: CREATED_AT,
    at: CREATED_AT,
  }));
}

function seedAudit(personaId: string): AuditEntry[] {
  return [
    {
      id: `${personaId}-audit-results`,
      at: "2026-11-08T12:00:00.000Z",
      actor_role: "guest",
      action: "read",
      object_type: "results",
      object_id: null,
      outcome: "allowed",
    },
    {
      id: `${personaId}-audit-shares`,
      at: "2026-11-08T12:05:00.000Z",
      actor_role: "counsellor",
      action: "read",
      object_type: "shares",
      object_id: null,
      outcome: "allowed",
    },
    {
      id: `${personaId}-audit-consents`,
      at: "2026-11-08T12:10:00.000Z",
      actor_role: "guest",
      action: "read",
      object_type: "consents",
      object_id: null,
      outcome: "allowed",
    },
  ];
}

function createSession(persona: Persona): PrivacySession {
  return {
    partnerRows: consentsFor(persona).map((row) => ({ ...row })),
    mine: seedMine(persona),
    audit: seedAudit(persona.id),
    serial: 0,
  };
}

function nextAt(session: PrivacySession): string {
  session.serial += 1;
  return new Date(EVENT_BASE + session.serial * 60_000).toISOString();
}

function sessionFor(persona: Persona): PrivacySession {
  const existing = sessions.get(persona.id);
  if (existing !== undefined) {
    return existing;
  }
  return beginPrivacySession(persona);
}

function mineList(session: PrivacySession): MineConsent[] {
  return session.mine.map((row) => ({
    id: row.id,
    scope: row.scope,
    granted: row.granted,
    version: row.version,
    created_at: row.created_at,
  }));
}

function toReceipt(row: StoredConsent): ConsentReceipt {
  return {
    id: `receipt-${row.id}`,
    consent_id: row.id,
    scope: row.scope,
    granted: row.granted,
    version: row.version,
    at: row.at,
    prev_hash: null,
    hash: null,
  };
}

function withPartnerA(rows: readonly ConsentRow[], granted: boolean): ConsentRow[] {
  let found = false;
  const next = rows.map((row) => {
    if (row.partner === "a" && row.scope === "share_overlap_with_partner") {
      found = true;
      return { ...row, granted };
    }
    return { ...row };
  });
  if (!found) {
    next.push({ partner: "a", scope: "share_overlap_with_partner", granted });
  }
  return next;
}

export function resetPrivacySessions(): void {
  sessions.clear();
}

export function beginPrivacySession(persona: Persona): PrivacySession {
  const session = createSession(persona);
  sessions.set(persona.id, session);
  return session;
}

export function partnerConsents(persona: Persona): ConsentRow[] {
  return sessionFor(persona).partnerRows.map((row) => ({ ...row }));
}

export function mineConsents(persona: Persona): MineConsent[] {
  return mineList(sessionFor(persona));
}

export function auditEntries(persona: Persona): AuditEntry[] {
  return sessionFor(persona)
    .audit.map((entry) => ({ ...entry }))
    .sort((earlier, later) => earlier.at.localeCompare(later.at));
}

export function receiptFor(persona: Persona, id: string): ConsentReceipt | null {
  const row = sessionFor(persona).mine.find(
    (item) => item.id === id || `receipt-${item.id}` === id,
  );
  if (row === undefined) {
    return null;
  }
  return toReceipt(row);
}

export function postMineConsent(persona: Persona, body: unknown): ConsentWrite {
  const parsed = consentPostSchema.safeParse(body);
  if (!parsed.success) {
    return { status: "invalid" };
  }
  if (parsed.data.scope === "view_own" && parsed.data.granted === false) {
    return { status: "permanent" };
  }
  const session = sessionFor(persona);
  const current = session.mine.find((row) => row.scope === parsed.data.scope);
  if (current === undefined) {
    return { status: "invalid" };
  }
  if (current.granted !== parsed.data.granted) {
    current.granted = parsed.data.granted;
    current.version += 1;
    current.at = nextAt(session);
    if (current.scope === "share_overlap_with_partner") {
      session.partnerRows = withPartnerA(session.partnerRows, current.granted);
    }
    session.audit.push({
      id: `${persona.id}-audit-${current.scope}-${current.version}`,
      at: current.at,
      actor_role: "guest",
      action: parsed.data.granted ? "grant" : "revoke",
      object_type: "consents",
      object_id: current.id,
      outcome: "allowed",
    });
  }
  return { status: "saved", consents: mineList(session) };
}
