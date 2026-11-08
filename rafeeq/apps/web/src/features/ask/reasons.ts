/**
 * MASTER Section 7.3 categories. The labels live in the ask catalog.
 * `content/routes.json` is empty, so this list is the named set, not a new schema.
 */
export const HARD_REASONS = [
  "distress",
  "termination",
  "religious",
  "other_person",
  "blame",
  "diagnosis",
  "decision",
  "medication",
  "legal",
  "minor",
] as const;

export type HardReason = (typeof HARD_REASONS)[number];

export function isHardReason(value: string): value is HardReason {
  return (HARD_REASONS as readonly string[]).includes(value);
}
