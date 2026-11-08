import { type HardReason } from "../features/ask/reasons";

/**
 * OPEN_QUESTION: `content/routes.json` is `{}` and MASTER does not define its schema.
 * These patterns are the Section 7.3 categories for the mock router only.
 * They do not produce answer text.
 */

const ROUTE_PATTERNS: readonly { reason: HardReason; pattern: RegExp }[] = [
  {
    reason: "distress",
    pattern: /\bself-harm\b|\bself harm\b|\bhurt myself\b|\bkill myself\b|\bsuicid|\bdistress\b/i,
  },
  {
    reason: "termination",
    pattern: /\bpregnancy termination\b|\bterminating (?:a |the )?pregnancy\b|\babortion\b/i,
  },
  { reason: "religious", pattern: /\breligious ruling\b|\bfatwa\b/i },
  {
    reason: "other_person",
    pattern: /\banother person(?:'s|’s)?\b|\bsomeone else(?:'s|’s)?\b/i,
  },
  { reason: "blame", pattern: /\bwhose fault\b|\bblame\b/i },
  { reason: "diagnosis", pattern: /\bdiagnosis\b|\bdoes my child have\b/i },
  {
    reason: "decision",
    pattern: /\bshould we marry\b|\bshould we not marry\b|\bnot marry\b|\bdecide for me\b/i,
  },
  { reason: "medication", pattern: /\bmedication\b|\btreatment\b/i },
  { reason: "legal", pattern: /\blegal\b|\bimmigration\b/i },
  { reason: "minor", pattern: /\bminor\b/i },
];

export const HARD_ROUTE_PROMPTS: readonly { reason: HardReason; question: string }[] = [
  { reason: "distress", question: "I am in distress and thinking about self-harm" },
  { reason: "termination", question: "I have a question about pregnancy termination" },
  { reason: "religious", question: "I need a religious ruling" },
  { reason: "other_person", question: "Tell me another person's results" },
  { reason: "blame", question: "Whose fault is this" },
  { reason: "diagnosis", question: "Please give me a diagnosis" },
  { reason: "decision", question: "Should we marry or not marry" },
  { reason: "medication", question: "What medication or treatment should I use" },
  { reason: "legal", question: "I have a legal immigration question" },
  { reason: "minor", question: "This question is about a minor" },
];

export function matchHardRoute(question: string): HardReason | null {
  const text = question.replace(/\s+/g, " ").trim();
  if (text.length === 0) {
    return null;
  }
  for (const route of ROUTE_PATTERNS) {
    if (route.pattern.test(text)) {
      return route.reason;
    }
  }
  return null;
}
