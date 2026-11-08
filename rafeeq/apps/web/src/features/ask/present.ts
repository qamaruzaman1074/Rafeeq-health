import type { AskPayload } from "@/features/ask/types";

export type AskPresentation =
  | { kind: "handoff"; reason: string | null }
  | { kind: "answer"; sourceIds: readonly string[]; text: string | null }
  | { kind: "blocked" };

function sourceIds(ids: readonly string[]): string[] {
  const found: string[] = [];
  for (const id of ids) {
    const trimmed = id.trim();
    if (trimmed.length > 0) {
      found.push(trimmed);
    }
  }
  return found;
}

/**
 * A content answer is shown only when the payload includes a source id.
 * A human route is a handoff and does not carry answer text into the view.
 * Anything else is blocked, including a payload that has text and no source id.
 */
export function presentAsk(payload: AskPayload): AskPresentation {
  if (payload.route === "human") {
    return { kind: "handoff", reason: payload.reason };
  }
  const ids = sourceIds(payload.source_ids);
  if (ids.length === 0) {
    return { kind: "blocked" };
  }
  return { kind: "answer", sourceIds: ids, text: payload.text };
}
