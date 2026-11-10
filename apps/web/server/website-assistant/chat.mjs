import { GoogleGenAI } from "@google/genai";
import { DEFAULT_MODEL } from "./constants.mjs";
import { consumeRateLimit } from "./rate-limit.mjs";
import { SYSTEM_INSTRUCTION } from "./prompt.mjs";
import { normalizeMessage } from "./validate.mjs";

function clientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? "anonymous";
  }
  if (typeof forwarded === "object" && Array.isArray(forwarded)) {
    return forwarded[0] ?? "anonymous";
  }
  return req.socket?.remoteAddress ?? "anonymous";
}

function envelope(data, requestId = "assistant") {
  return { data, meta: { request_id: requestId } };
}

function errorEnvelope(code, messageKey, requestId = "assistant") {
  return {
    error: { code, message_key: messageKey, request_id: requestId },
  };
}

function collectCitations(response) {
  const sources = [];
  const seen = new Set();
  const candidates = response?.candidates ?? [];
  for (const candidate of candidates) {
    const meta = candidate.groundingMetadata;
    const chunks = meta?.groundingChunks ?? [];
    for (const chunk of chunks) {
      const title =
        chunk?.retrievedContext?.title ??
        chunk?.web?.title ??
        chunk?.fileSearchChunk?.fileDisplayName ??
        "Rafeeq knowledge";
      const uri =
        chunk?.retrievedContext?.uri ??
        chunk?.web?.uri ??
        chunk?.fileSearchChunk?.documentName ??
        "";
      const text =
        chunk?.retrievedContext?.text ??
        chunk?.fileSearchChunk?.content ??
        chunk?.web?.snippet ??
        "";
      const key = `${title}|${uri}|${text.slice(0, 64)}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      sources.push({
        title: String(title),
        url: String(uri),
        excerpt: String(text).slice(0, 240),
      });
    }
  }
  return sources;
}

export async function handleWebsiteAssistantChat(req, body) {
  const requestId = `asst_${Date.now().toString(36)}`;
  const rate = consumeRateLimit(clientIp(req));
  if (!rate.ok) {
    return { status: 429, json: errorEnvelope("rate_limited", "rateLimited", requestId) };
  }

  const message = body?.message;
  const validation = normalizeMessage(message);
  if (!validation.ok) {
    return {
      status: validation.code === "off_topic" ? 200 : 400,
      json:
        validation.code === "off_topic"
          ? envelope(
              {
                text: "I can only help with questions about Rafeeq and the information on this website (education, privacy, consent, counselling pathways, and platform limits). Try a suggested question or visit Contact for other topics.",
                sources: [],
                route: "declined",
              },
              requestId,
            )
          : errorEnvelope(validation.code, validation.messageKey, requestId),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const store = process.env.GEMINI_FILE_SEARCH_STORE;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!apiKey || !store) {
    return {
      status: 503,
      json: errorEnvelope("assistant_unconfigured", "assistantUnavailable", requestId),
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: validation.message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [store],
            },
          },
        ],
      },
    });

    const text = response?.text?.trim();
    const sources = collectCitations(response);
    if (!text || text.length === 0) {
      return {
        status: 200,
        json: envelope(
          {
            text: "I do not have enough approved information to answer that yet. Please check the FAQ page or contact the team.",
            sources,
            route: "fallback",
          },
          requestId,
        ),
      };
    }

    return {
      status: 200,
      json: envelope(
        {
          text,
          sources,
          route: sources.length > 0 ? "grounded" : "ungrounded",
        },
        requestId,
      ),
    };
  } catch {
    return {
      status: 502,
      json: errorEnvelope("upstream_failed", "assistantUnavailable", requestId),
    };
  }
}
