import { CONSENT_SCOPES, type ConsentScope } from "@/features/couple/share-state";

/** Planning Section 7 columns. research_aggregate has no column here. */
export const MATRIX_PARTIES = ["me", "partner", "clinic"] as const;

export type MatrixParty = (typeof MATRIX_PARTIES)[number];

/**
 * OPEN_QUESTION: `/content` does not define a finer share-item list.
 * Rows stay the Section 5 consent scopes.
 */
export const MATRIX_ROWS: readonly ConsentScope[] = CONSENT_SCOPES;

export const REVOCABLE_SCOPES = ["share_overlap_with_partner", "share_with_clinic"] as const;

export type RevocableScope = (typeof REVOCABLE_SCOPES)[number];

export type MatrixCell =
  | { kind: "locked" }
  | { kind: "toggle"; scope: RevocableScope }
  | { kind: "empty" }
  | { kind: "open_question" };

export function isRevocableScope(scope: ConsentScope): scope is RevocableScope {
  return scope === "share_overlap_with_partner" || scope === "share_with_clinic";
}

/**
 * "me" is view_own and is not revocable.
 * Partner is share_overlap_with_partner. Clinic is share_with_clinic.
 * research_aggregate has no party column, so every cell is an open question.
 */
export function matrixCell(scope: ConsentScope, party: MatrixParty): MatrixCell {
  if (scope === "research_aggregate") {
    return { kind: "open_question" };
  }
  if (scope === "view_own" && party === "me") {
    return { kind: "locked" };
  }
  if (scope === "share_overlap_with_partner" && party === "partner") {
    return { kind: "toggle", scope };
  }
  if (scope === "share_with_clinic" && party === "clinic") {
    return { kind: "toggle", scope };
  }
  return { kind: "empty" };
}

/**
 * Flip the matrix first. Restore the previous value if the request fails.
 */
export async function commitConsentChange(input: {
  previous: boolean;
  next: boolean;
  apply: (granted: boolean) => void;
  request: () => Promise<void>;
}): Promise<void> {
  input.apply(input.next);
  try {
    await input.request();
  } catch (error) {
    input.apply(input.previous);
    throw error;
  }
}
