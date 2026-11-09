import type { KnowledgeEntry } from "../types";

export const privacyEntriesAr: KnowledgeEntry[] = [
  {
    id: "informed-consent",
    title: "ماذا تعني الموافقة المستنيرة",
    category: "privacy",
    keywords: ["موافقة مستنيرة", "موافقة", "اذن", "مشاركة", "فهم"],
    questionPatterns: [
      "ماذا تعني الموافقة المستنيرة",
      "ما هي الموافقة المستنيرة",
      "ماذا ينبغي ان اعرف قبل المشاركة",
    ],
    answer:
      "قد تكشف المعلومات الجينية تفاصيل ذات صلة بالأقارب البيولوجيين وكذلك بالشخص الذي أُجري له الاختبار. لذلك ينبغي النظر في المشاركة بعناية. وينبغي أن يفهم المستخدمون أي معلومات تُشارك، ومع من، ولأي غرض قبل استخدام ميزة مشاركة. وتعني الموافقة المستنيرة اتخاذ ذلك الاختيار بمعلومات واضحة—وليس منح وصول شامل افتراضياً.",
    sourceTitle: "سياسة الخصوصية — الموافقة والمشاركة",
    sourceUrl: "/privacy-policy",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["control-sharing", "partner-privacy", "revoke-sharing"],
  },
  {
    id: "control-sharing",
    title: "التحكم بمشاركة المعلومات",
    category: "privacy",
    keywords: ["تحكم", "مشاركة", "اذن المشاركة", "خصوصية", "عائلة"],
    questionPatterns: [
      "كيف اتحكم بمشاركة المعلومات",
      "من يمكنه رؤية نتائجي",
      "هل يمكن لعائلتي الوصول الى معلوماتي",
    ],
    answer:
      "النتائج الشخصية خاصة افتراضياً. وتتطلب المشاركة إذنك الصريح. ولا يحصل أفراد العائلة على وصول تلقائي. ويعتمد الوصول على أدوار المستخدمين والأذون والميزات المستخدمة. وكون الشخص شريكاً أو فرد عائلة أو مختص رعاية صحية لا يمنح بذاته وصولاً إلى نتائج شخص آخر.",
    sourceTitle: "الأسئلة الشائعة — خصوصية الشريك والعائلة",
    sourceUrl: "/faq",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["partner-privacy", "revoke-sharing", "informed-consent"],
  },
  {
    id: "partner-privacy",
    title: "وصول الشريك إلى النتائج",
    category: "privacy",
    keywords: ["شريك", "زوجان", "رؤية النتائج", "تلقائي"],
    questionPatterns: [
      "هل يرى شريكي نتائج الفحص تلقائيا",
      "هل يرى شريكي نتائجي",
      "من يمكنه رؤية نتيجة التداخل لدي",
    ],
    answer:
      "لا. النتائج الشخصية خاصة افتراضياً. وتتطلب المشاركة إذنك الصريح. وفي شاشات خصوصية الزوجَين تُنمذَج نطاقات مشاركة منفصلة (مثلاً التداخل مع شريك، أو المشاركة مع عيادة).",
    sourceTitle: "الأسئلة الشائعة — خصوصية الشريك والعائلة",
    sourceUrl: "/faq",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["revoke-sharing", "informed-consent", "control-sharing"],
  },
  {
    id: "revoke-sharing",
    title: "إلغاء إذن المشاركة",
    category: "privacy",
    keywords: ["الغاء الاذن", "سحب الموافقة", "ايقاف المشاركة"],
    questionPatterns: [
      "هل يمكنني الغاء اذن المشاركة",
      "هل يمكنني ايقاف مشاركة نتائجي",
      "كيف اسحب الموافقة",
    ],
    answer:
      "نعم. يمكنك إلغاء الوصول المستقبلي إلى معلومات اخترت سابقاً مشاركتها. ولا يمكن للإلغاء محو معلومات سبق أن شُوهدت أو احتُفظ بها بشكل مستقل لدى الشخص الآخر.",
    sourceTitle: "الأسئلة الشائعة — خصوصية الشريك والعائلة",
    sourceUrl: "/faq",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["control-sharing", "informed-consent", "partner-privacy"],
  },
];
