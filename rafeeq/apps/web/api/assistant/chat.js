import { handleWebsiteAssistantChat } from "../../server/website-assistant/chat.mjs";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: { code: "method_not_allowed", message_key: "invalidMessage" } });
    return;
  }
  const outcome = await handleWebsiteAssistantChat(req, req.body ?? {});
  res.status(outcome.status).json(outcome.json);
}
