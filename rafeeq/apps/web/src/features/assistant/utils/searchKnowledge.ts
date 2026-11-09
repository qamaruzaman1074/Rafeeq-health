import { approvedKnowledgeEntries, type KnowledgeEntry } from "@/features/assistant/knowledge";
import { normalizeQuery, tokenizeQuery } from "@/features/assistant/utils/normalizeQuery";

const PATTERN_SCORE = 100;
const KEYWORD_SCORE = 18;
const CATEGORY_SCORE = 8;
const TITLE_TOKEN_SCORE = 4;
const MIN_SCORE = 36;
const STOP_TOKENS = new Set([
  "what",
  "does",
  "mean",
  "the",
  "a",
  "an",
  "is",
  "are",
  "how",
  "can",
  "i",
  "my",
  "me",
  "to",
  "for",
  "of",
  "and",
  "or",
  "in",
  "on",
  "do",
  "when",
  "who",
  "why",
  "about",
]);

export type ScoredKnowledgeEntry = {
  entry: KnowledgeEntry;
  score: number;
};

export type KnowledgeSearchResult =
  | { status: "matched"; matches: ScoredKnowledgeEntry[] }
  | { status: "no_match"; matches: [] };

export function searchKnowledge(
  question: string,
  options?: { language?: KnowledgeEntry["language"]; limit?: number },
): KnowledgeSearchResult {
  const normalized = normalizeQuery(question);
  const tokens = tokenizeQuery(normalized);
  if (normalized.length === 0 || tokens.length === 0) {
    return { status: "no_match", matches: [] };
  }

  const language = options?.language ?? "en";
  const limit = options?.limit ?? 3;
  const scored: ScoredKnowledgeEntry[] = [];

  for (const entry of approvedKnowledgeEntries(language)) {
    let score = 0;

    for (const pattern of entry.questionPatterns) {
      const normalizedPattern = normalizeQuery(pattern);
      if (normalized === normalizedPattern) {
        score += PATTERN_SCORE;
      } else if (
        normalized.includes(normalizedPattern) ||
        normalizedPattern.includes(normalized)
      ) {
        score += Math.floor(PATTERN_SCORE * 0.75);
      } else {
        const patternTokens = tokenizeQuery(normalizedPattern);
        const overlap = patternTokens.filter((token) => tokens.includes(token)).length;
        if (overlap >= Math.min(3, patternTokens.length) && overlap / patternTokens.length >= 0.6) {
          score += Math.floor(PATTERN_SCORE * 0.45);
        }
      }
    }

    for (const keyword of entry.keywords) {
      const normalizedKeyword = normalizeQuery(keyword);
      if (normalized.includes(normalizedKeyword) || tokens.includes(normalizedKeyword)) {
        score += KEYWORD_SCORE;
      } else {
        const parts = tokenizeQuery(normalizedKeyword);
        if (parts.length > 1 && parts.every((part) => tokens.includes(part))) {
          score += KEYWORD_SCORE;
        }
      }
    }

    const category = normalizeQuery(entry.category.replace(/-/g, " "));
    if (tokens.includes(category) || normalized.includes(category)) {
      score += CATEGORY_SCORE;
    }

    for (const titleToken of tokenizeQuery(normalizeQuery(entry.title))) {
      if (STOP_TOKENS.has(titleToken)) {
        continue;
      }
      if (tokens.includes(titleToken)) {
        score += TITLE_TOKEN_SCORE;
      }
    }

    const hasStrongSignal = score >= PATTERN_SCORE * 0.45 || entry.keywords.some((keyword) => {
      const normalizedKeyword = normalizeQuery(keyword);
      return (
        normalized.includes(normalizedKeyword) ||
        tokens.includes(normalizedKeyword) ||
        (tokenizeQuery(normalizedKeyword).length > 1 &&
          tokenizeQuery(normalizedKeyword).every((part) => tokens.includes(part)))
      );
    });

    if (score >= MIN_SCORE && hasStrongSignal) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));
  const matches = scored.slice(0, limit);

  if (matches.length === 0) {
    return { status: "no_match", matches: [] };
  }

  return { status: "matched", matches };
}
