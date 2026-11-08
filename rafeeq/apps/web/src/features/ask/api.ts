import { askPayloadSchema, type AskPayload, type AskRequest } from "@/features/ask/types";
import { apiRequest } from "@/lib/api";

export async function postAsk(body: AskRequest): Promise<AskPayload> {
  const result = await apiRequest<unknown>("/api/v1/ask", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return askPayloadSchema.parse(result.data);
}
