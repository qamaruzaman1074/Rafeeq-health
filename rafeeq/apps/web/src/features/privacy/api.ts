import { apiRequest } from "@/lib/api";
import {
  auditListSchema,
  consentReceiptSchema,
  mineConsentListSchema,
  type AuditEntry,
  type ConsentPost,
  type ConsentReceipt,
  type MineConsent,
} from "@/features/privacy/types";

export function mineConsentQueryKey(personaId: string | null) {
  return ["consents", "mine", personaId] as const;
}

export function partnerConsentQueryKey(personaId: string | null) {
  return ["consents", personaId] as const;
}

export function receiptQueryKey(personaId: string | null, id: string) {
  return ["consents", "receipt", personaId, id] as const;
}

export function auditQueryKey(personaId: string | null) {
  return ["audit", "mine", personaId] as const;
}

export async function fetchMineConsents(): Promise<MineConsent[] | null> {
  const result = await apiRequest<unknown>("/api/v1/consents?mine=true");
  if (result.data === null) {
    return null;
  }
  return mineConsentListSchema.parse(result.data);
}

export async function postConsent(body: ConsentPost): Promise<MineConsent[]> {
  const result = await apiRequest<unknown>("/api/v1/consents", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (result.data === null) {
    throw new Error("Consent response was empty");
  }
  return mineConsentListSchema.parse(result.data);
}

export async function fetchReceipt(id: string): Promise<ConsentReceipt> {
  const result = await apiRequest<unknown>(`/api/v1/consents/receipt/${encodeURIComponent(id)}`);
  if (result.data === null) {
    throw new Error("Receipt response was empty");
  }
  return consentReceiptSchema.parse(result.data);
}

export async function fetchMyAudit(): Promise<AuditEntry[] | null> {
  const result = await apiRequest<unknown>("/api/v1/audit?mine=true");
  if (result.data === null) {
    return null;
  }
  return auditListSchema.parse(result.data);
}
