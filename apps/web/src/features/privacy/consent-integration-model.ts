/** Future backend consent record shape (not persisted in this build). */
export type ConsentPermissionState = "off" | "on" | "pending";

export type ConsentMatrixRow = {
  id: string;
  category: string;
  recipient: string;
  purpose: string;
  explanation: string;
};

export type ConsentIntegrationPayload = {
  version: string;
  userId: string | null;
  rows: ConsentMatrixRow[];
  permissions: Record<string, ConsentPermissionState>;
  auditRef: string | null;
};

export const CONSENT_PROTOTYPE_ROW_IDS = [
  "education",
  "screening",
  "family",
  "counselling",
] as const;

export type ConsentPrototypeRowId = (typeof CONSENT_PROTOTYPE_ROW_IDS)[number];
