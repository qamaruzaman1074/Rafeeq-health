import type { KnowledgeSourceRef } from "@/features/assistant/knowledge";

export type AssistantRole = "user" | "assistant";

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  text: string;
  status: "ready" | "pending" | "failed";
  sources?: KnowledgeSourceRef[];
  followUps?: string[];
  matched?: boolean;
};
