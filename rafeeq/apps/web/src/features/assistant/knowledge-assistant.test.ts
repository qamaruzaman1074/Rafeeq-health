import { describe, expect, it } from "vitest";
import { allKnowledgeEntries, approvedKnowledgeEntries } from "@/features/assistant/knowledge";
import { generateAnswer, NO_RESULT_ANSWER } from "@/features/assistant/utils/generateAnswer";
import { normalizeQuery } from "@/features/assistant/utils/normalizeQuery";
import { searchKnowledge } from "@/features/assistant/utils/searchKnowledge";

describe("normalizeQuery", () => {
  it("lowercases and strips punctuation", () => {
    expect(normalizeQuery("  What does Carrier-Status mean?! ")).toBe(
      "what does carrier status mean",
    );
  });
});

describe("searchKnowledge", () => {
  it("matches approved carrier questions", () => {
    const result = searchKnowledge("What does carrier status mean?");
    expect(result.status).toBe("matched");
    expect(result.matches[0]?.entry.id).toBe("carrier-status-meaning");
  });

  it("excludes draft entries from answers", () => {
    const drafts = allKnowledgeEntries().filter((entry) => entry.reviewStatus === "draft");
    expect(drafts.length).toBeGreaterThan(0);
    const approvedIds = new Set(approvedKnowledgeEntries().map((entry) => entry.id));
    for (const draft of drafts) {
      expect(approvedIds.has(draft.id)).toBe(false);
    }
    const personal = searchKnowledge("interpret my personal genetic result");
    expect(personal.matches.every((match) => match.entry.reviewStatus === "approved")).toBe(true);
  });

  it("returns no_match for unrelated questions", () => {
    const result = searchKnowledge("Who won the football match yesterday?");
    expect(result.status).toBe("no_match");
  });
});

describe("generateAnswer", () => {
  it("returns approved educational text with sources", () => {
    const answer = generateAnswer("What is genetic counselling?");
    expect(answer.matched).toBe(true);
    expect(answer.text.toLowerCase()).toContain("genetic counsellor");
    expect(answer.sources[0]?.url).toMatch(/^\//);
    expect(answer.followUpQuestions.length).toBeGreaterThan(0);
  });

  it("returns the fallback when nothing matches", () => {
    const answer = generateAnswer("What is the weather in Dubai?");
    expect(answer.matched).toBe(false);
    expect(answer.text).toBe(NO_RESULT_ANSWER);
    expect(answer.entryIds).toEqual([]);
  });

  it("answers screening limitations from local knowledge", () => {
    const answer = generateAnswer("What are the limitations of screening?");
    expect(answer.matched).toBe(true);
    expect(answer.entryIds).toContain("screening-limitations");
  });
});
