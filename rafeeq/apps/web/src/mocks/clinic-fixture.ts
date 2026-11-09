import { REFERRAL_STATUSES, clinicShareGranted, type ReferralStatus } from "@/features/care/steps";
import { shareGate } from "@/features/couple/share-state";
import { findPersona, personas, type Persona } from "@/features/personas";
import type { AuditEntry } from "@/features/privacy/types";
import type { Carrier } from "@/features/result/types";
import { readLocaleBlock, type LocaleCode } from "@/features/learn/blocks";
import { explainFor, overlapFor } from "@/mocks/kernel-fixture";
import { mineConsents, partnerConsents } from "@/mocks/privacy-fixture";

/**
 * OPEN_QUESTION: Section 6 names the counsellor routes and the envelope, not
 * the bodies. Queue columns follow website planning Section 7. Tier is taken
 * only when a persona's `tests` string names exactly one of T1, T2, T3, or T4
 * (P1, P4, P6). P3 names both T1 and T2, so it is omitted from the queue.
 * P5 is included so the declined-share brief can be opened. Its tier is null.
 *
 * OPEN_QUESTION: language, literacy mode, due-by, reason codes, comprehension gaps, user questions,
 * and stated preferences are not in the persona file or in `/content`. Those
 * fields are null or empty. No clinical sentence is added.
 *
 * OPEN_QUESTION: `/content/blocks.*.json` has no talking-point or cultural-note
 * body. The brief carries block ids `clinic.talking-points` and
 * `clinic.cultural-notes` and a null `text`.
 *
 * OPEN_QUESTION: no persona grants `share_with_clinic`. Shared genes and
 * formulas are copied from the existing overlap payload only after that scope
 * is granted and overlap consent is allowed. They are not recomputed here.
 *
 * P5 partner B declines sharing. The markers below stand in for that partner's
 * genes and overlap. `content/genes.json` is empty, so they are not catalog
 * symbols. They are never copied into a counsellor payload.
 */
export const TALKING_POINT_BLOCK_ID = "clinic.talking-points";

export const CULTURAL_NOTES_BLOCK_ID = "clinic.cultural-notes";

export const P5_UNSHARED_PARTNER_GENE = "P5_PARTNER_B_UNSHARED";

export const P5_UNSHARED_OVERLAP = "P5_OVERLAP_UNSHARED";

const TIER_BY_TOKEN = {
  T1: "T1_info",
  T2: "T2_counsel_routine",
  T3: "T3_counsel_priority",
  T4: "T4_urgent_human",
} as const;

export type FixtureTier = (typeof TIER_BY_TOKEN)[keyof typeof TIER_BY_TOKEN];

const rawUnshared: Readonly<Record<string, readonly string[]>> = {
  P5: [P5_UNSHARED_PARTNER_GENE, P5_UNSHARED_OVERLAP],
};

const statusById = new Map<string, ReferralStatus>();
const audit: AuditEntry[] = [];
let auditSerial = 0;
const AUDIT_BASE = Date.parse("2026-11-08T14:00:00.000Z");

export function unsharedMarkers(personaId: string): readonly string[] {
  return rawUnshared[personaId] ?? [];
}

export function tierFromTests(tests: string): FixtureTier | null {
  const found: FixtureTier[] = [];
  for (const token of ["T1", "T2", "T3", "T4"] as const) {
    if (new RegExp(`\\b${token}\\b`).test(tests)) {
      found.push(TIER_BY_TOKEN[token]);
    }
  }
  if (found.length !== 1) {
    return null;
  }
  return found[0] ?? null;
}

export function queuedPersonas(): Persona[] {
  return personas.filter((persona) => tierFromTests(persona.tests) !== null || persona.id === "P5");
}

export function resetClinicQueue(): void {
  statusById.clear();
  audit.length = 0;
  auditSerial = 0;
}

function referralId(personaId: string): string {
  return `referral-${personaId}`;
}

function personaFromReferral(id: string): Persona | null {
  if (!id.startsWith("referral-")) {
    return null;
  }
  const persona = findPersona(id.slice("referral-".length));
  if (persona === undefined) {
    return null;
  }
  if (!queuedPersonas().some((item) => item.id === persona.id)) {
    return null;
  }
  return persona;
}

function leakGuard(personaId: string, payload: unknown): void {
  const encoded = JSON.stringify(payload);
  for (const marker of unsharedMarkers(personaId)) {
    if (encoded.includes(marker)) {
      throw new Error("Counsellor payload included a field that was not shared");
    }
  }
}

function isReferralStatus(value: string): value is ReferralStatus {
  return (REFERRAL_STATUSES as readonly string[]).includes(value);
}

type FormulaLine = {
  text: string;
  inputs: { name: string; value: string }[];
};

function sharedContent(persona: Persona): { genes: Carrier[]; formulas: FormulaLine[] } {
  const rows = partnerConsents(persona);
  if (!clinicShareGranted(mineConsents(persona)) || shareGate(rows) !== "allowed") {
    return { genes: [], formulas: [] };
  }
  const overlap = overlapFor(persona, rows);
  if (overlap.hidden) {
    return { genes: [], formulas: [] };
  }
  const card = explainFor(persona, rows);
  return {
    genes: overlap.genes.map((gene) => ({ ...gene })),
    formulas:
      card === null
        ? []
        : [
            {
              text: card.formula,
              inputs: card.inputs.map((input) => ({ name: input.name, value: input.value })),
            },
          ],
  };
}

function block(locale: LocaleCode, blockId: string): { block_id: string; text: string | null } {
  return { block_id: blockId, text: readLocaleBlock(locale, blockId).text };
}

export function queuePayload(): Record<string, unknown>[] {
  return queuedPersonas().map((persona) => {
    const id = referralId(persona.id);
    const row = {
      id,
      tier: tierFromTests(persona.tests),
      reason_codes: [],
      due_by: null,
      language: null,
      literacy_mode: null,
      comprehension_gaps: null,
      clinic_share: clinicShareGranted(mineConsents(persona)),
      overlap_share: shareGate(partnerConsents(persona)),
      status: statusById.get(id) ?? "created",
    };
    leakGuard(persona.id, row);
    return row;
  });
}

export function briefPayload(id: string, locale: LocaleCode): Record<string, unknown> | null {
  const persona = personaFromReferral(id);
  if (persona === null) {
    return null;
  }
  const content = sharedContent(persona);
  const payload = {
    id,
    status: statusById.get(id) ?? "created",
    tier: tierFromTests(persona.tests),
    shared_genes: content.genes,
    formulas: content.formulas,
    user_questions: [],
    teach_back_gaps: [],
    preferences: { language: null, literacy_mode: null },
    cultural_notes: block(locale, CULTURAL_NOTES_BLOCK_ID),
    talking_points: [block(locale, TALKING_POINT_BLOCK_ID)],
  };
  leakGuard(persona.id, payload);
  return payload;
}

export function recordBriefRead(id: string): void {
  auditSerial += 1;
  audit.push({
    id: `counsellor-audit-${auditSerial}`,
    at: new Date(AUDIT_BASE + auditSerial * 60_000).toISOString(),
    actor_role: "counsellor",
    action: "read",
    object_type: "shares",
    object_id: id,
    outcome: "allowed",
  });
}

export function counsellorAuditEntries(): AuditEntry[] {
  return audit.map((entry) => ({ ...entry }));
}

export function applyStatus(
  id: string,
  body: unknown,
):
  | { status: "unknown" }
  | { status: "invalid" }
  | { status: "saved"; id: string; referralStatus: ReferralStatus } {
  if (personaFromReferral(id) === null) {
    return { status: "unknown" };
  }
  if (typeof body !== "object" || body === null || !("status" in body)) {
    return { status: "invalid" };
  }
  const value = body.status;
  if (typeof value !== "string" || !isReferralStatus(value)) {
    return { status: "invalid" };
  }
  statusById.set(id, value);
  return { status: "saved", id, referralStatus: value };
}
