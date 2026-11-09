export type SuggestionGroup = {
  id: string;
  labelKey: string;
  questions: string[];
  /** Optional route prefixes that prefer this group for contextual chips. */
  routePrefixes?: string[];
};

export const SUGGESTION_GROUPS: SuggestionGroup[] = [
  {
    id: "inherited-risk",
    labelKey: "suggestions.groups.inheritedRisk",
    routePrefixes: ["/understanding-genetic-risk", "/inherited-conditions"],
    questions: [
      "What does carrier status mean?",
      "How are inherited conditions passed down?",
      "What does it mean when both parents are carriers?",
      "What is the difference between genetic risk and diagnosis?",
    ],
  },
  {
    id: "screening",
    labelKey: "suggestions.groups.screening",
    routePrefixes: ["/screening-pathways", "/how-it-works"],
    questions: [
      "What is genetic screening?",
      "What can a screening result tell me?",
      "What are the limitations of screening?",
    ],
  },
  {
    id: "counselling",
    labelKey: "suggestions.groups.counselling",
    routePrefixes: ["/genetic-counselling", "/app/care"],
    questions: [
      "What is genetic counselling?",
      "When should someone seek professional guidance?",
      "How can I prepare for a counselling appointment?",
    ],
  },
  {
    id: "privacy",
    labelKey: "suggestions.groups.privacy",
    routePrefixes: ["/privacy-policy", "/app/privacy", "/trust"],
    questions: [
      "What does informed consent mean?",
      "How can I control information sharing?",
    ],
  },
];

export function contextualSuggestionQuestions(pathname: string): string[] {
  const preferred = SUGGESTION_GROUPS.find((group) =>
    group.routePrefixes?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );
  if (preferred) {
    return preferred.questions;
  }
  return SUGGESTION_GROUPS.flatMap((group) => group.questions).slice(0, 6);
}

export function allSuggestionGroups(): SuggestionGroup[] {
  return SUGGESTION_GROUPS;
}
