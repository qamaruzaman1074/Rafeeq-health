import type { KnowledgeEntry } from "../types";

export const geneticCounsellingEntriesAr: KnowledgeEntry[] = [
  {
    id: "what-is-counselling",
    title: "ما هو الإرشاد الوراثي",
    category: "genetic-counselling",
    keywords: ["الارشاد الوراثي", "استشارة وراثية", "اخصائي الارشاد الوراثي"],
    questionPatterns: [
      "ما هو الارشاد الوراثي",
      "ما هي الاستشارة الوراثية",
      "ماذا يفعل اخصائي الارشاد الوراثي",
    ],
    answer:
      "يمكن للمعلومات الجينية أن تثير أسئلة شخصية ومعقّدة. يمكن لأخصائي إرشاد وراثي مؤهَّل المساعدة على شرح النتائج، ومناقشة أنماط الوراثة، واستكشاف التاريخ العائلي، والنظر في الخيارات المتاحة. يشجّع رفيق الإرشاد المهني المناسب بدلاً من الحلول محله. ولا ينشئ رفيق علاقة طبيب–مريض.",
    sourceTitle: "الإرشاد الوراثي",
    sourceUrl: "/genetic-counselling",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["genetic-counselling-when", "prepare-counselling", "rafeeq-not-treatment"],
  },
  {
    id: "genetic-counselling-when",
    title: "متى تطلب إرشاداً مهنياً",
    category: "genetic-counselling",
    keywords: ["ارشاد مهني", "التحدث الى", "اخصائي الارشاد", "نتائج معقدة"],
    questionPatterns: [
      "متى ينبغي طلب ارشاد مهني",
      "متى اتحدث الى مختص وراثة",
      "متى يمكن ان يساعد الارشاد الوراثي",
    ],
    answer:
      "قد يكون الإرشاد المهني مهماً عندما تكون النتائج معقّدة أو غير حاسمة أو ذات أثر كبير محتمل أو تتطلب تفسيراً سريرياً. يمكن لأخصائي إرشاد وراثي أو مختص سريري وضع النتائج في سياقها لك ولعائلتك.",
    sourceTitle: "الأسئلة الشائعة — الإرشاد والخطوات التالية",
    sourceUrl: "/faq",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["prepare-counselling", "confirmatory-assessment", "what-is-counselling"],
  },
  {
    id: "prepare-counselling",
    title: "التحضير لموعد إرشاد",
    category: "genetic-counselling",
    keywords: ["تحضير", "موعد", "اسئلة", "تاريخ عائلي"],
    questionPatterns: [
      "كيف احضر لموعد ارشاد",
      "كيف اتحضر للارشاد الوراثي",
      "ماذا احضر الى الارشاد",
    ],
    answer:
      "غالباً يتحضّر الناس بكتابة أسئلة مسبقاً، وجمع تقارير الفحص المتاحة، وتدوين التاريخ العائلي الذي يبدو ذا صلة، وإحضار شخص داعم إن ساعد ذلك. في رفيق يمكنك استكشاف صفحات تعليمية عن حالة حمل الصفة والوراثة ومسارات الفحص والخصوصية قبل الموعد. وينبغي مناقشة القرارات الطبية الشخصية مع أخصائي الإرشاد أو المختص السريري.",
    sourceTitle: "الإرشاد الوراثي",
    sourceUrl: "/genetic-counselling",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["what-is-counselling", "informed-consent", "care-pathways-overview"],
  },
  {
    id: "rafeeq-not-treatment",
    title: "ما لا يقدّمه رفيق",
    category: "genetic-counselling",
    keywords: ["زواج", "علاج", "توصية", "انجاب"],
    questionPatterns: [
      "هل يوصي رفيق بالزواج او ينهى عنه",
      "هل يقدم رفيق علاجا انجابيا",
      "هل يحل رفيق محل الارشاد",
    ],
    answer:
      "رفيق لا يوصي بالزواج ولا ينهى عنه. وهو يدعم الفهم والاستقلال الشخصي واتخاذ القرار المستنير. ويمكنه تقديم معلومات تعليمية عن المسارات والخيارات، لكنه لا يقدّم علاجاً ولا يحل محل الرعاية المهنية.",
    sourceTitle: "الأسئلة الشائعة — الإرشاد والخطوات التالية",
    sourceUrl: "/faq",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["what-is-counselling", "genetic-counselling-when", "what-is-rafeeq"],
  },
];
