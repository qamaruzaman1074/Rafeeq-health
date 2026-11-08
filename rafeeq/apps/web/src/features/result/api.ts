import { apiRequest } from "@/lib/api";
import {
  ownResultSchema,
  overlapResultSchema,
  type OwnResult,
  type OverlapResult,
} from "@/features/result/types";

export async function fetchOwnResult(): Promise<OwnResult | null> {
  const result = await apiRequest<unknown>("/api/v1/results/mine");
  if (result.data === null) {
    return null;
  }
  return ownResultSchema.parse(result.data);
}

export async function fetchOverlap(): Promise<OverlapResult | null> {
  const result = await apiRequest<unknown>("/api/v1/results/overlap");
  if (result.data === null) {
    return null;
  }
  return overlapResultSchema.parse(result.data);
}
