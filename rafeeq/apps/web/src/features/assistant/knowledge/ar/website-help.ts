import type { KnowledgeEntry } from "../types";

export const websiteHelpEntriesAr: KnowledgeEntry[] = [
  {
    id: "what-is-rafeeq",
    title: "ما هو رفيق",
    category: "website-help",
    keywords: ["منصة رفيق", "تعليم", "دعم القرار"],
    questionPatterns: [
      "ما هو رفيق",
      "ماذا يفعل رفيق",
      "من يمكنه استخدام رفيق",
    ],
    answer:
      "رفيق منصة تعليم ودعم قرار تساعد الناس على فهم خطر المرض الوراثي، واستكشاف معلومات الفحص، وإيجاد مسارات إلى الإرشاد الوراثي. ويمكن للأفراد والزوجَين الذين يريدون فهم الحالات الوراثية ومفاهيم الفحص والخطوات التالية الممكنة استخدام رفيق. رفيق ليس مختبر اختبار جيني.",
    sourceTitle: "الأسئلة الشائعة — عام",
    sourceUrl: "/faq",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["how-to-use-rafeeq", "rafeeq-not-treatment", "what-is-counselling"],
  },
  {
    id: "how-to-use-rafeeq",
    title: "كيف تستخدم رفيق",
    category: "website-help",
    keywords: ["كيف استخدم", "تنقل", "تجريبي", "وحدات", "ابدأ"],
    questionPatterns: [
      "كيف استخدم رفيق",
      "كيف استعمال رفيق",
      "من اين ابدأ",
    ],
    answer:
      "ابدأ بـ كيف يعمل رفيق للنظرة العامة، ثم استكشف فهم الخطر الوراثي، ومسارات الفحص، والإرشاد الوراثي، والخيارات المستنيرة، وسياسة الخصوصية، والأسئلة الشائعة. وتُظهر مناطق العرض التجريبي بعد تسجيل الدخول مثل تعلّم وتحقّق واسأل ورعاية والخصوصية تدفقات تعليمية ببيانات مثال. يجيب هذا المساعد من تعليم الموقع المعتمد فقط—وهو لا يفسّر نتائجك الجينية الشخصية.",
    sourceTitle: "كيف يعمل رفيق",
    sourceUrl: "/how-it-works",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["what-is-rafeeq", "privacy-overview", "care-pathways-overview"],
  },
  {
    id: "privacy-overview",
    title: "الخصوصية في رفيق",
    category: "website-help",
    keywords: ["سياسة الخصوصية", "بيانات", "امن"],
    questionPatterns: [
      "كيف يتعامل رفيق مع الخصوصية",
      "اين سياسة الخصوصية",
      "هل معلوماتي الجينية خاصة",
    ],
    answer:
      "يدرك رفيق أن المعلومات الصحية الجينية والعائلية شخصية. وتشرح سياسة الخصوصية الاستخدام المقصود، والموافقة والمشاركة، والوصول، وموضوعات ذات صلة. وفي العروض التجريبية تبقى بيانات الجلسة في متصفحك مع ملفات مثال. ولا تُدخل معلومات حسّاسة لشخص آخر دون إذن مناسب.",
    sourceTitle: "سياسة الخصوصية",
    sourceUrl: "/privacy-policy",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["informed-consent", "control-sharing", "partner-privacy"],
  },
  {
    id: "assistant-scope-draft",
    title: "تفسير النتيجة الشخصية (مسودة مستبعدة)",
    category: "website-help",
    keywords: ["نتيجتي", "تفسير النمط الجيني", "تقرير شخصي"],
    questionPatterns: ["فسر نتيجتي الجينية الشخصية"],
    answer: "عنصر نائب مسودة — تفسير التقرير الشخصي خارج نطاق المساعد العام.",
    sourceTitle: "اسأل (بعد تسجيل الدخول)",
    sourceUrl: "/app/ask",
    language: "ar",
    reviewStatus: "draft",
    translationStatus: "pending_review",
  },
];
