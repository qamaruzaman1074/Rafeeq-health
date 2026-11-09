import { apiRequest } from "@/lib/api";
import type { AssistantReply } from "@/features/website-assistant/types";

type ChatResponse = {
  text: string;
  sources: AssistantReply["sources"];
  route: AssistantReply["route"];
};

export async function postWebsiteAssistant(message: string): Promise<AssistantReply> {
  const result = await apiRequest<ChatResponse>("/api/assistant/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return result.data;
}
