import type { Persona } from "@/features/personas";
import { PATHWAY_STEP_IDS, type PathwayStepId, type ReferralStatus } from "@/features/care/steps";

/**
 * OPEN_QUESTION: Section 6 names GET `/pathway` and POST `/referrals` and the
 * envelope, not the body. `tier` and `due_by` are attached so the couple client
 * can drop them. They are counsellor-only (GET `/counsellor/queue`) and are not
 * a couple-facing label.
 *
 * OPEN_QUESTION: no booking route exists. This fixture does not store a slot.
 */
type StoredReferral = {
  id: string;
  status: Extract<ReferralStatus, "created">;
};

type CareSession = {
  referral: StoredReferral | null;
};

const sessions = new Map<string, CareSession>();

const counsellorOnly = {
  tier: "T2_counsel_routine",
  due_by: "2026-11-20T00:00:00.000Z",
} as const;

function sessionFor(personaId: string): CareSession {
  const existing = sessions.get(personaId);
  if (existing !== undefined) {
    return existing;
  }
  const created: CareSession = { referral: null };
  sessions.set(personaId, created);
  return created;
}

export function resetCareSessions(): void {
  sessions.clear();
}

export function beginCareSession(personaId: string): void {
  sessions.set(personaId, { referral: null });
}

export function pathwayPayload(persona: Persona): Record<string, unknown> {
  const session = sessionFor(persona.id);
  const requested = session.referral !== null;
  const current: PathwayStepId = requested ? "counselling" : "result_received";
  return {
    current_step: current,
    steps: PATHWAY_STEP_IDS.map((id) => ({
      id,
      reached: id === "result_received" || (requested && id === "counselling"),
    })),
    status: session.referral?.status ?? null,
    ...counsellorOnly,
  };
}

export function createReferral(persona: Persona): Record<string, unknown> {
  const session = sessionFor(persona.id);
  if (session.referral === null) {
    session.referral = {
      id: `referral-${persona.id}`,
      status: "created",
    };
  }
  return {
    id: session.referral.id,
    status: session.referral.status,
    ...counsellorOnly,
  };
}
