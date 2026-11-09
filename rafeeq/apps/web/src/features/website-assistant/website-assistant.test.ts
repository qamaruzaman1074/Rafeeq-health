import { describe, expect, it } from "vitest";
import { normalizeMessage } from "../../../server/website-assistant/validate.mjs";
import { mockWebsiteAssistant } from "@/mocks/website-assistant-fixture";

describe("website assistant validation", () => {
  it("rejects empty messages", () => {
    expect(normalizeMessage("   ").ok).toBe(false);
  });

  it("rejects long messages", () => {
    expect(normalizeMessage("a".repeat(501)).ok).toBe(false);
  });

  it("declines unrelated topics", () => {
    expect(normalizeMessage("What is the weather in Dubai?").ok).toBe(false);
  });

  it("accepts Rafeeq questions", () => {
    expect(normalizeMessage("How does Rafeeq handle consent?").ok).toBe(true);
  });

  it("rejects personal genetic identifiers", () => {
    expect(normalizeMessage("Interpret my genotype c.1234A>G").ok).toBe(false);
  });
});

describe("website assistant mock", () => {
  it("answers carrier questions from FAQ blocks", () => {
    const reply = mockWebsiteAssistant("What does carrier screening mean for Rafeeq?");
    expect(reply.route).toBe("grounded");
    expect(reply.text.length).toBeGreaterThan(10);
  });

  it("declines off-topic prompts", () => {
    const reply = mockWebsiteAssistant("Who won the football match?");
    expect(reply.route).toBe("declined");
  });
});
