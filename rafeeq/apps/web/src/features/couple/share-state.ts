import { z } from "zod";

/** MASTER Section 5 `consents.scope`. */
export const CONSENT_SCOPES = [
  "view_own",
  "share_overlap_with_partner",
  "share_with_clinic",
  "research_aggregate",
] as const;

export const SHARE_OVERLAP_SCOPE = "share_overlap_with_partner" as const;

export const consentRowSchema = z.object({
  partner: z.enum(["a", "b"]),
  scope: z.enum(CONSENT_SCOPES),
  granted: z.boolean(),
});

export type ConsentRow = z.infer<typeof consentRowSchema>;

export const consentListSchema = z.array(consentRowSchema);

export type ShareGate = "empty" | "declined" | "missing" | "allowed";

/**
 * Overlap stays hidden unless both partners have granted
 * `share_overlap_with_partner` (MASTER Section 8).
 * A `granted: false` row is a decline. No rows means the grant is not recorded.
 */
export function shareGate(rows: readonly ConsentRow[] | null): ShareGate {
  if (rows === null) {
    return "empty";
  }
  const overlap = rows.filter((row) => row.scope === SHARE_OVERLAP_SCOPE);
  if (overlap.length === 0) {
    return "missing";
  }
  if (overlap.some((row) => !row.granted)) {
    return "declined";
  }
  const granted = new Set(overlap.map((row) => row.partner));
  if (granted.has("a") && granted.has("b")) {
    return "allowed";
  }
  return "missing";
}
