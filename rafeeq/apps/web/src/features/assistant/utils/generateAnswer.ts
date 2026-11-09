import {
  getKnowledgeEntryById,
  type GeneratedAnswer,
  type KnowledgeEntry,
  type KnowledgeSourceRef,
} from "@/features/assistant/knowledge";
import {
  searchKnowledge,
  type ScoredKnowledgeEntry,
} from "@/features/assistant/utils/searchKnowledge";

export const NO_RESULT_ANSWER =
  "I couldn't find enough information about this topic in Rafeeq's educational resources. You can explore our learning sections or discuss your question with a qualified healthcare professional.";

const FALLBACK_SOURCES: KnowledgeSourceRef[] = [
  { title: "FAQ", url: "/faq", category: "website-help" },
  { title: "Understanding genetic risk", url: "/understanding-genetic-risk", category: "inherited-risk" },
  { title: "Genetic counselling", url: "/genetic-counselling", category: "genetic-counselling" },
];

function sourcesFromEntries(entries: KnowledgeEntry[]): KnowledgeSourceRef[] {
  const seen = new Set<string>();
  const sources: KnowledgeSourceRef[] = [];
  for (const entry of entries) {
    const key = `${entry.sourceUrl}|${entry.sourceTitle}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    sources.push({
      title: entry.sourceTitle,
      url: entry.sourceUrl,
      category: entry.category,
    });
  }
  return sources;
}

function followUpsForEntries(entries: KnowledgeEntry[], limit = 3): string[] {
  const seen = new Set<string>();
  const questions: string[] = [];

  for (const entry of entries) {
    for (const id of entry.followUpIds ?? []) {
      const related = getKnowledgeEntryById(id);
      if (!related || related.reviewStatus !== "approved") {
        continue;
      }
      const question = related.questionPatterns[0];
      if (!question || seen.has(related.id)) {
        continue;
      }
      seen.add(related.id);
      const formatted = question.charAt(0).toUpperCase() + question.slice(1) + "?";
      questions.push(formatted);
      if (questions.length >= limit) {
        return questions;
      }
    }
  }

  return questions;
}

function combineCompatibleAnswers(matches: ScoredKnowledgeEntry[]): KnowledgeEntry[] {
  const primary = matches[0];
  if (!primary) {
    return [];
  }
  const selected: KnowledgeEntry[] = [primary.entry];
  const primaryCategory = primary.entry.category;
  const primaryScore = primary.score;

  for (const match of matches.slice(1)) {
    if (match.score < primaryScore * 0.55) {
      continue;
    }
    if (match.entry.category !== primaryCategory && match.score < primaryScore * 0.8) {
      continue;
    }
    const duplicateIdea = selected.some(
      (entry) =>
        entry.answer === match.entry.answer ||
        entry.id === match.entry.id ||
        normalizeSnippet(entry.answer) === normalizeSnippet(match.entry.answer),
    );
    if (duplicateIdea) {
      continue;
    }
    selected.push(match.entry);
    if (selected.length >= 2) {
      break;
    }
  }

  return selected;
}

function normalizeSnippet(text: string): string {
  return text.slice(0, 80).toLowerCase();
}

export function generateAnswer(
  question: string,
  options?: { language?: KnowledgeEntry["language"] },
): GeneratedAnswer {
  const result = searchKnowledge(question, { language: options?.language ?? "en", limit: 4 });

  if (result.status === "no_match") {
    return {
      text: NO_RESULT_ANSWER,
      sources: FALLBACK_SOURCES,
      entryIds: [],
      followUpQuestions: [
        "What does carrier status mean?",
        "What is genetic counselling?",
        "How can I control information sharing?",
      ],
      matched: false,
    };
  }

  const entries = combineCompatibleAnswers(result.matches);
  const primaryEntry = entries[0];
  if (!primaryEntry) {
    return {
      text: NO_RESULT_ANSWER,
      sources: FALLBACK_SOURCES,
      entryIds: [],
      followUpQuestions: [],
      matched: false,
    };
  }
  const text =
    entries.length === 1
      ? primaryEntry.answer
      : entries.map((entry) => entry.answer).join("\n\n");

  return {
    text,
    sources: sourcesFromEntries(entries),
    entryIds: entries.map((entry) => entry.id),
    followUpQuestions: followUpsForEntries(entries),
    matched: true,
  };
}
