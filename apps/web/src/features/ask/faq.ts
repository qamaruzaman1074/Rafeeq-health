/**
 * OPEN_QUESTION: `content/faq.json` is `{}`. MASTER does not define the entry
 * shape. No suggested question is invented here. An empty file yields an empty list.
 */

export type SuggestedQuestion = {
  id: string;
  question: string;
  sourceIds: readonly string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmpty(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return trimmed;
}

function readIds(value: unknown): string[] {
  if (typeof value === "string") {
    const one = nonEmpty(value);
    return one === null ? [] : [one];
  }
  if (!Array.isArray(value)) {
    return [];
  }
  const ids: string[] = [];
  for (const entry of value) {
    const id = nonEmpty(entry);
    if (id !== null) {
      ids.push(id);
    }
  }
  return ids;
}

function fromEntry(fallbackId: string, entry: unknown): SuggestedQuestion | null {
  if (typeof entry === "string") {
    const question = nonEmpty(entry);
    if (question === null) {
      return null;
    }
    return { id: fallbackId, question, sourceIds: [] };
  }
  if (!isRecord(entry)) {
    return null;
  }
  const question = nonEmpty(entry.question) ?? nonEmpty(entry.prompt);
  if (question === null) {
    return null;
  }
  const id = nonEmpty(entry.id) ?? fallbackId;
  const sourceIds = readIds(entry.source_ids ?? entry.sources ?? entry.source_id);
  return { id, question, sourceIds };
}

export function readSuggestedQuestions(file: unknown): SuggestedQuestion[] {
  if (Array.isArray(file)) {
    const found: SuggestedQuestion[] = [];
    for (const [index, entry] of file.entries()) {
      const item = fromEntry(String(index), entry);
      if (item !== null) {
        found.push(item);
      }
    }
    return found;
  }
  if (!isRecord(file)) {
    return [];
  }
  const found: SuggestedQuestion[] = [];
  for (const [key, entry] of Object.entries(file)) {
    const item = fromEntry(key, entry);
    if (item !== null) {
      found.push(item);
    }
  }
  return found;
}
