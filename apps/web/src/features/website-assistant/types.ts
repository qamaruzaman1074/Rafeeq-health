export type AssistantSource = {
  title: string;
  url: string;
  excerpt: string;
};

export type AssistantReply = {
  text: string;
  sources: AssistantSource[];
  route: "grounded" | "ungrounded" | "fallback" | "declined";
};

export type AssistantTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  status?: "pending" | "ready" | "failed";
  sources?: AssistantSource[];
};
