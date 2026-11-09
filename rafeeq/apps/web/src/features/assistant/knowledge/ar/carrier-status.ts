import type { KnowledgeEntry } from "../types";

export const carrierStatusEntriesAr: KnowledgeEntry[] = [
  {
    id: "carrier-status-meaning",
    title: "ماذا تعني حالة حمل الصفة الوراثية",
    category: "carrier-status",
    keywords: ["حامل للصفة", "حالة حمل الصفة الوراثية", "متغير جيني", "متنحي", "اعراض"],
    questionPatterns: [
      "ماذا يعني حالة حمل الصفة الوراثية",
      "ما معنى ان اكون حاملا للصفة الوراثية",
      "ما هو حامل الصفة الوراثية",
      "هل يمكن لحامل الصفة ان يكون بصحة جيدة",
    ],
    answer:
      "يحمل حامل الصفة الوراثية متغيّراً جينياً مرتبطاً بحالة وراثية معيّنة. وفي كثير من الحالات المتنحية لا تكون الحالة لدى الحاملين أنفسهم. وحمل الصفة لا يعني تلقائياً أن لديك الحالة، أو أنك مريض، أو أن أطفالك المستقبليين ستكون لديهم حالة وراثية.",
    sourceTitle: "فهم الخطر الوراثي — حالة حمل الصفة الوراثية",
    sourceUrl: "/understanding-genetic-risk",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["inheritance-patterns", "both-parents-carriers", "risk-vs-diagnosis"],
  },
  {
    id: "carrier-child-outcome",
    title: "حالة حمل الصفة الوراثية والأطفال",
    category: "carrier-status",
    keywords: ["حامل للصفة", "طفل", "اطفال", "حمل", "مستقبلي", "الوالدان"],
    questionPatterns: [
      "هل يعني حمل الصفة ان طفلي سيكون لديه الحالة",
      "هل يمكن لحاملي الصفة انجاب طفل لديه الحالة",
      "هل نتيجة حامل واحد تعني ان الطفل سيكون لديه حالة وراثية",
    ],
    answer:
      "لا. لا يثبت إيجاد صفة حمل وحدها أن طفلاً مستقبلياً ستكون لديه حالة وراثية. يعتمد الاحتمال على النتائج ذات الصلة من الوالدين البيولوجيين كليهما، والجين، والمتغيّرات، ونمط الوراثة. ونتيجة أحد الوالدين وحدها لا تثبّت الخطر على الطفل.",
    sourceTitle: "الأسئلة الشائعة — المعلومات الجينية",
    sourceUrl: "/faq",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["both-parents-carriers", "genetic-counselling-when", "screening-limitations"],
  },
  {
    id: "carriers-symptoms",
    title: "هل تظهر أعراض على حاملي الصفة؟",
    category: "carrier-status",
    keywords: ["حامل للصفة", "اعراض", "صحة", "مريض"],
    questionPatterns: [
      "هل تظهر اعراض على حاملي الصفة",
      "هل حاملو الصفة بصحة جيدة",
      "هل يمرض حاملو الصفة",
    ],
    answer:
      "كثير من حاملي الصفة بصحة جيدة. يحدّد فحص الحاملين متغيّرات يمكن توريثها؛ وهو لا يثبت أنك مريض. وحمل الصفة لا يعني تلقائياً أن الشخص مريض.",
    sourceTitle: "فهم الخطر الوراثي — حالة حمل الصفة الوراثية",
    sourceUrl: "/understanding-genetic-risk",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["carrier-status-meaning", "risk-vs-diagnosis", "genetic-counselling-when"],
  },
];
