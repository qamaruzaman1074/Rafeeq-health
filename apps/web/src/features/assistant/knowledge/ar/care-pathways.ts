import type { KnowledgeEntry } from "../types";

export const carePathwaysEntriesAr: KnowledgeEntry[] = [
  {
    id: "care-pathways-overview",
    title: "مسارات الرعاية والفحص التعليمية",
    category: "care-pathways",
    keywords: ["مسار", "خطوات تالية", "رعاية", "احالة", "مختص"],
    questionPatterns: [
      "ما هي مسارات الفحص",
      "ما خطواتي التالية بعد الفحص",
      "كيف تعمل مسارات الرعاية في رفيق",
    ],
    answer:
      "توضح صفحة مسارات الفحص في رفيق خطوات تالية تعليمية مثل التعلّم عن إيجاد، ومراجعة المعلومات مع مختص مؤهَّل، والسؤال عن تقييم إضافي، واستكشاف مسارات مختص أو إرشاد. والحالات المعروضة في العروض التجريبية معاينات تعليمية فقط. ويعتمد حجز المواعيد الحيّ ودلائل المقدّمين على تكاملات تنظيمية مستقبلية.",
    sourceTitle: "مسارات الفحص",
    sourceUrl: "/screening-pathways",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["confirmatory-assessment", "genetic-counselling-when", "informed-choices"],
  },
  {
    id: "informed-choices",
    title: "تعليم الخيارات المستنيرة",
    category: "care-pathways",
    keywords: ["خيارات مستنيرة", "قرار", "خيارات", "تعليم"],
    questionPatterns: [
      "ما هي صفحة الخيارات المستنيرة",
      "كيف يدعم رفيق الخيارات المستنيرة",
    ],
    answer:
      "يتضمن رفيق مركزاً تعليمياً للخيارات المستنيرة لمساعدة الناس على استكشاف الأسئلة والخيارات بلغة واضحة. وهو دعم تعليمي، وليس محرك توصيات سريرية. وينبغي مناقشة القرارات المعقّدة مع مختص رعاية صحية مؤهَّل.",
    sourceTitle: "الخيارات المستنيرة",
    sourceUrl: "/informed-choices",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["what-is-counselling", "privacy-overview", "what-is-rafeeq"],
  },
];
