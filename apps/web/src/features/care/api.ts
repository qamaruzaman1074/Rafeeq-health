import { apiRequest } from "@/lib/api";
import {
  couplePathway,
  referralAck,
  type CouplePathway,
  type ReferralAck,
} from "@/features/care/types";

export function pathwayQueryKey(personaId: string | null) {
  return ["pathway", personaId] as const;
}

export async function fetchPathway(): Promise<CouplePathway | null> {
  const result = await apiRequest<unknown>("/api/v1/pathway");
  if (result.data === null) {
    return null;
  }
  return couplePathway(result.data);
}

export async function postReferral(): Promise<ReferralAck> {
  const result = await apiRequest<unknown>("/api/v1/referrals", {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (result.data === null) {
    throw new Error("Referral response was empty");
  }
  return referralAck(result.data);
}
