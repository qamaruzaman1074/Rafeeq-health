import { createServer } from "node:http";
import { handleWebsiteAssistantChat } from "./chat.mjs";

const port = Number(process.env.ASSISTANT_DEV_PORT ?? 8787);

createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/assistant/chat") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: { code: "not_found" } }));
    return;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString("utf8") || "{}";
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    body = {};
  }

  const outcome = await handleWebsiteAssistantChat(req, body);
  res.writeHead(outcome.status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(outcome.json));
}).listen(port, () => {
  console.log(`Rafeeq website assistant API listening on http://127.0.0.1:${port}`);
});
