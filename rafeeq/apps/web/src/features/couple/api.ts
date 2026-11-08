import { explainOverlapSchema, type ExplainOverlap } from "@/features/couple/fact-card-dto";
import { consentListSchema, type ConsentRow } from "@/features/couple/share-state";
import { apiRequest } from "@/lib/api";

export async function fetchConsents(): Promise<ConsentRow[] | null> {
  const result = await apiRequest<unknown>("/api/v1/consents");
  if (result.data === null) {
    return null;
  }
  return consentListSchema.parse(result.data);
}

export async function explainOverlap(): Promise<ExplainOverlap | null> {
  const result = await apiRequest<unknown>("/api/v1/explain/overlap", { method: "POST" });
  if (result.data === null) {
    return null;
  }
  return explainOverlapSchema.parse(result.data);
}
