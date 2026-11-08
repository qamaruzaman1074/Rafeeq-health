import { referralAck, type ReferralAck } from "@/features/care/types";
import type { ReferralStatus } from "@/features/care/steps";
import { caseBrief, queueList, type CaseBrief, type QueueRow } from "@/features/clinic/types";
import type { AuditEntry } from "@/features/privacy/types";
import { auditListSchema } from "@/features/privacy/types";
import { apiRequest } from "@/lib/api";

export function queueQueryKey() {
  return ["counsellor-queue"] as const;
}

export function briefQueryKey(id: string, locale: string) {
  return ["counsellor-brief", id, locale] as const;
}

export function caseAuditQueryKey(id: string, updatedAt: number) {
  return ["counsellor-audit", id, updatedAt] as const;
}

export async function fetchQueue(): Promise<QueueRow[] | null> {
  const result = await apiRequest<unknown>("/api/v1/counsellor/queue");
  if (result.data === null) {
    return null;
  }
  return queueList(result.data);
}

export async function fetchBrief(id: string, locale: "en" | "ar"): Promise<CaseBrief | null> {
  const result = await apiRequest<unknown>(
    `/api/v1/counsellor/referrals/${encodeURIComponent(id)}/brief?locale=${locale}`,
  );
  if (result.data === null) {
    return null;
  }
  return caseBrief(result.data);
}

export async function patchReferral(id: string, status: ReferralStatus): Promise<ReferralAck> {
  const result = await apiRequest<unknown>(
    `/api/v1/counsellor/referrals/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
  if (result.data === null) {
    throw new Error("Referral response was empty");
  }
  return referralAck(result.data);
}

export async function fetchCaseAudit(id: string): Promise<AuditEntry[] | null> {
  const result = await apiRequest<unknown>("/api/v1/audit");
  if (result.data === null) {
    return null;
  }
  return auditListSchema.parse(result.data).filter((entry) => entry.object_id === id);
}
