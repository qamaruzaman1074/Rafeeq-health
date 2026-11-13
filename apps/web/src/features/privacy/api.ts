import { apiRequest } from "@/lib/api";
import { isSupabaseAuthenticated } from "@/app/session";
import {
  auditListSchema,
  consentReceiptSchema,
  mineConsentListSchema,
  type AuditEntry,
  type ConsentPost,
  type ConsentReceipt,
  type MineConsent,
} from "@/features/privacy/types";

export function mineConsentQueryKey(sessionIdentity: string | null) {
  return ["consents", "mine", sessionIdentity] as const;
}

export function partnerConsentQueryKey(sessionIdentity: string | null) {
  return ["consents", sessionIdentity] as const;
}

export function receiptQueryKey(sessionIdentity: string | null, id: string) {
  return ["consents", "receipt", sessionIdentity, id] as const;
}

export function auditQueryKey(sessionIdentity: string | null) {
  return ["audit", "mine", sessionIdentity] as const;
}

export async function fetchMineConsents(): Promise<MineConsent[] | null> {
  if (isSupabaseAuthenticated()) {
    const { fetchSupabaseMineConsents } = await import("@/features/privacy/supabase-consent");
    return fetchSupabaseMineConsents();
  }
  const result = await apiRequest<unknown>("/api/v1/consents?mine=true");
  if (result.data === null) {
    return null;
  }
  return mineConsentListSchema.parse(result.data);
}

export async function postConsent(body: ConsentPost): Promise<MineConsent[]> {
  if (isSupabaseAuthenticated()) {
    const { postSupabaseConsent } = await import("@/features/privacy/supabase-consent");
    return postSupabaseConsent(body);
  }
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
  if (isSupabaseAuthenticated()) {
    const { fetchSupabaseReceipt } = await import("@/features/privacy/supabase-consent");
    return fetchSupabaseReceipt(id);
  }
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
