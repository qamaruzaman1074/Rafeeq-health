export type KnowledgeLanguage = "en" | "ar";

export type KnowledgeReviewStatus = "approved" | "draft";

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  questionPatterns: string[];
  answer: string;
  sourceTitle: string;
  sourceUrl: string;
  language: KnowledgeLanguage;
  reviewStatus: KnowledgeReviewStatus;
  followUpIds?: string[];
}

export interface KnowledgeSourceRef {
  title: string;
  url: string;
  category?: string;
}

export interface GeneratedAnswer {
  text: string;
  sources: KnowledgeSourceRef[];
  entryIds: string[];
  followUpQuestions: string[];
  matched: boolean;
}
