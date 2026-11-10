import type { KnowledgeEntry } from "../types";

export const screeningEntriesAr: KnowledgeEntry[] = [
  {
    id: "what-is-screening",
    title: "ما هو الفحص الجيني",
    category: "screening",
    keywords: ["فحص جيني", "لوحة", "اختبار", "فحص الحاملين"],
    questionPatterns: [
      "ما هو الفحص الجيني",
      "ما هو فحص الحاملين للصفة الوراثية",
      "ماذا يعني الفحص",
    ],
    answer:
      "يبحث الفحص الجيني عن نتائج جينية مختارة قد تكون ذات صلة بحالات وراثية. يساعد رفيق الناس على فهم مفاهيم الفحص والمسارات التعليمية. رفيق ليس مختبر اختبار جيني ولا يجري اختباراً جينياً مخبرياً. يمكن للفحص أن يحدّد نتائج قد تحتاج إلى تقييم إضافي، لكنه لا يستطيع دائماً إثبات ما إذا كان شخص أو طفل مستقبلي لديه حالة.",
    sourceTitle: "مسارات الفحص",
    sourceUrl: "/screening-pathways",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["screening-can-tell", "screening-limitations", "risk-vs-diagnosis"],
  },
  {
    id: "screening-can-tell",
    title: "ماذا يمكن أن تخبرك نتيجة الفحص",
    category: "screening",
    keywords: ["نتيجة فحص", "نتائج", "تقرير", "لوحة فحص"],
    questionPatterns: [
      "ماذا يمكن ان تخبرني نتيجة الفحص",
      "ماذا تعني نتيجة الفحص",
      "ماذا يحدث عادة بعد نتيجة فحص",
    ],
    answer:
      "تصف نتيجة الفحص ما وُجد في الاختبار الذي أُجري. قد تحدّد حالة حمل الصفة أو متغيّرات مختارة أخرى، أو تُبلَغ سلبية للمتغيّرات التي بحثت عنها اللوحة. وتعكس النتائج الاختبار الذي أُجري، وليس كل تغيّر جيني ممكن. وبعد نتيجة، غالباً يتعلّم الناس عن الإيجاد، ويراجعون المعلومات مع مختص مؤهَّل، ويسألون عن تقييم إضافي عند المناسبة.",
    sourceTitle: "مسارات الفحص",
    sourceUrl: "/screening-pathways",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["screening-limitations", "confirmatory-assessment", "genetic-counselling-when"],
  },
  {
    id: "screening-limitations",
    title: "حدود الفحص",
    category: "screening",
    keywords: ["حدود الفحص", "خطر متبقي", "سلبي", "VUS", "غير مؤكد", "لوحة"],
    questionPatterns: [
      "ما حدود الفحص",
      "ماذا لو كانت نتيجتي غير مؤكدة",
      "هل يعني الفحص السلبي عدم وجود خطر",
    ],
    answer:
      "لا تغطي لوحات الفحص كل جين أو متغيّر. وتختلف الطرائق فيما تكشفه. وقد لا تكشف نتيجة فحص سلبية كل متغيّر ممكن، لذلك قد يبقى بعض الخطر حسب الاختبار والحالة والتاريخ العائلي. وأحياناً يُبلَغ متغيّر غير مؤكَّد الأهمية (VUS) ومعناه السريري غير واضح بعد؛ وVUS ليس إيجاداً معروفاً مسبّباً للمرض. وحجم الخطر المتبقي يخص الحالة وينبغي أن يشرحه مختص مؤهَّل—ولا يُعمَّم هنا.",
    sourceTitle: "فهم الخطر الوراثي — عدم اليقين",
    sourceUrl: "/understanding-genetic-risk",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["confirmatory-assessment", "genetic-counselling-when", "risk-vs-diagnosis"],
  },
  {
    id: "confirmatory-assessment",
    title: "معلومات التقييم التأكيدي",
    category: "screening",
    keywords: ["تقييم تاكيدي", "اختبار تاكيدي", "مختص", "متابعة"],
    questionPatterns: [
      "ما هو التقييم التاكيدي",
      "لماذا قد يلزم اختبار تاكيدي",
      "ماذا يحدث بعد الفحص",
    ],
    answer:
      "تستفيد بعض النتائج من اختبار تأكيدي أو مراجعة مختص أو إرشاد وراثي قبل استخلاص أي استنتاجات عن الصحة أو التخطيط الإنجابي. يمكن لرفيق أن يشير إلى مسارات تعليمية ومعلومات إرشاد. وهو لا يطلب اختبارات ولا يحل محل التقييم السريري.",
    sourceTitle: "مسارات الفحص",
    sourceUrl: "/screening-pathways",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["genetic-counselling-when", "prepare-counselling", "care-pathways-overview"],
  },
];
