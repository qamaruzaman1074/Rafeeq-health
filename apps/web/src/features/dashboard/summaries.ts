import { LEARN_MODULES } from "@/features/learn/modules";
import { shareGate, type ConsentRow } from "@/features/couple/share-state";
import type { CouplePathway } from "@/features/care/types";
import type { MineConsent } from "@/features/privacy/types";
import type { OwnResult } from "@/features/result/types";

export type ResultStatus = "empty" | "none" | "listed";

export type PartnerShareStatus = "empty" | "declined" | "missing" | "allowed";

export function resultStatus(data: OwnResult | null | undefined): ResultStatus {
  if (data === undefined || data === null) {
    return "empty";
  }
  return data.carriers.length === 0 ? "none" : "listed";
}

export function listedConditionName(data: OwnResult | null | undefined): string | null {
  if (data === undefined || data === null) {
    return null;
  }
  const named = data.carriers.find((carrier) => carrier.condition_name !== null);
  return named?.condition_name ?? null;
}

export function availableLearnTopicCount(): number {
  return LEARN_MODULES.length;
}

export function partnerShareStatus(
  rows: readonly ConsentRow[] | null | undefined,
): PartnerShareStatus {
  if (rows === undefined || rows === null) {
    return "empty";
  }
  return shareGate(rows);
}

export function mineGrant(
  rows: readonly MineConsent[] | null | undefined,
  scope: MineConsent["scope"],
): boolean | null {
  if (rows === undefined || rows === null) {
    return null;
  }
  const row = rows.find((item) => item.scope === scope);
  return row === undefined ? null : row.granted;
}

export function counsellingStatus(pathway: CouplePathway | null | undefined): {
  current: CouplePathway["current_step"] | null;
  referral: CouplePathway["status"];
} {
  if (pathway === undefined || pathway === null) {
    return { current: null, referral: null };
  }
  return { current: pathway.current_step, referral: pathway.status };
}
