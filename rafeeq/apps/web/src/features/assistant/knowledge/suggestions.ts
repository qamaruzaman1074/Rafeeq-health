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

const SUGGESTION_GROUPS_AR: SuggestionGroup[] = [
  {
    id: "inherited-risk",
    labelKey: "suggestions.groups.inheritedRisk",
    routePrefixes: ["/understanding-genetic-risk", "/inherited-conditions"],
    questions: [
      "ماذا يعني حالة حمل الصفة الوراثية؟",
      "كيف تورث الحالات الوراثية؟",
      "ماذا يعني عندما يكون الوالدان حاملان للصفة؟",
      "ما الفرق بين الخطر الوراثي والتشخيص؟",
    ],
  },
  {
    id: "screening",
    labelKey: "suggestions.groups.screening",
    routePrefixes: ["/screening-pathways", "/how-it-works"],
    questions: [
      "ما هو الفحص الجيني؟",
      "ماذا يمكن ان تخبرني نتيجة الفحص؟",
      "ما حدود الفحص؟",
    ],
  },
  {
    id: "counselling",
    labelKey: "suggestions.groups.counselling",
    routePrefixes: ["/genetic-counselling", "/app/care"],
    questions: [
      "ما هو الارشاد الوراثي؟",
      "متى ينبغي طلب ارشاد مهني؟",
      "كيف احضر لموعد ارشاد؟",
    ],
  },
  {
    id: "privacy",
    labelKey: "suggestions.groups.privacy",
    routePrefixes: ["/privacy-policy", "/app/privacy", "/trust"],
    questions: [
      "ماذا تعني الموافقة المستنيرة؟",
      "كيف اتحكم بمشاركة المعلومات؟",
    ],
  },
];

export function suggestionGroupsForLanguage(language: "en" | "ar"): SuggestionGroup[] {
  return language === "ar" ? SUGGESTION_GROUPS_AR : SUGGESTION_GROUPS;
}

export function allSuggestionGroups(language: "en" | "ar" = "en"): SuggestionGroup[] {
  return suggestionGroupsForLanguage(language);
}

export function contextualSuggestionQuestions(pathname: string, language: "en" | "ar" = "en"): string[] {
  const groups = suggestionGroupsForLanguage(language);
  const preferred = groups.find((group) =>
    group.routePrefixes?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );
  if (preferred) {
    return preferred.questions;
  }
  return groups.flatMap((group) => group.questions).slice(0, 6);
}
