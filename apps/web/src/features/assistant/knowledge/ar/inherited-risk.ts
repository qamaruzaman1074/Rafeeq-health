import type { KnowledgeEntry } from "../types";

export const inheritedRiskEntriesAr: KnowledgeEntry[] = [
  {
    id: "inheritance-patterns",
    title: "كيف تُورَّث الحالات الوراثية",
    category: "inherited-risk",
    keywords: ["وراثة", "موروث", "نمط الوراثة", "جسدي متنحي", "سائد", "مرتبطة بالكروموسوم X"],
    questionPatterns: [
      "كيف تورث الحالات الوراثية",
      "كيف يمكن وراثة الحالات الجينية",
      "ما هي انماط الوراثة",
    ],
    answer:
      "تتبع الحالات الوراثية أنماط وراثة مختلفة، ويعتمد الخطر على الحالة المحددة والنتائج الجينية. تشمل الأنماط التعليمية الشائعة الوراثة الجسمية المتنحية (يُصاب الطفل عموماً فقط عندما يرث متغيّراً ذا صلة في الجين نفسه من كل والد بيولوجي)، والوراثة الجسمية السائدة (قد تكفي نسخة واحدة من متغيّر ذي صلة لإحداث حالة)، والمرتبطة بالكروموسوم X (الجين ذو الصلة على الكروموسوم X، لذلك قد يختلف الاحتمال والأثر بين الأطفال الذكور والإناث). هذه الأنماط أمثلة تعليمية. وتختلف الحالات الحقيقية؛ ويلزم تفسير مهني لأي نتيجة شخصية.",
    sourceTitle: "فهم الخطر الوراثي — الوراثة",
    sourceUrl: "/understanding-genetic-risk",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["autosomal-recessive-example", "both-parents-carriers", "risk-vs-diagnosis"],
  },
  {
    id: "autosomal-recessive-example",
    title: "الوراثة الجسمية المتنحية (مثال تعليمي)",
    category: "inherited-risk",
    keywords: ["وراثة جسمية متنحية", "25%", "50%", "يحملان", "الجين نفسه"],
    questionPatterns: [
      "ما هي الوراثة الجسمية المتنحية",
      "ماذا تعني الوراثة الجسمية المتنحية",
      "ماذا يحدث عندما يحمل الوالدان الجين نفسه",
    ],
    answer:
      "عندما يحمل الوالدان البيولوجيان كلاهما متغيّراً مسبّباً للمرض ذا صلة في الجين نفسه المرتبط بحالة جسمية متنحية، يكون لكل حمل احتمال توضيحي 25% لوراثة متغيّرين ذوي صلة، و50% لوراثة واحد، و25% لوراثة لا واحد منهما. هذا مثال تعليمي فقط. وهو يفترض نمطاً جسمياً متنحياً معيّناً ونتائج والدية محددة. ويعتمد الاحتمال الفعلي على الحالة والمتغيّرات وطرائق الاختبار والتفسير السريري من مختص مؤهَّل.",
    sourceTitle: "فهم الخطر الوراثي — مثال",
    sourceUrl: "/understanding-genetic-risk",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["both-parents-carriers", "risk-vs-diagnosis", "genetic-counselling-when"],
  },
  {
    id: "both-parents-carriers",
    title: "عندما يكون الوالدان حاملَين للصفة",
    category: "inherited-risk",
    keywords: ["كلا الوالدين", "الزوجان", "حاملان للصفة", "تداخل", "الوالدان البيولوجيان"],
    questionPatterns: [
      "ماذا يعني عندما يكون الوالدان حاملان للصفة",
      "عندما يحمل الوالدان البيولوجيان متغيرات ذات صلة",
      "ماذا لو كنا نحن الاثنين حاملين للصفة",
    ],
    answer:
      "تصف نتيجة فحص فردية ذلك الشخص. ولمناقشة الآثار المحتملة على الأطفال، ينظر المختصون المؤهَّلون في نتائج الوالدين البيولوجيين ذات الصلة، والجين والمتغيّرات المحددة، ونمط الوراثة، والسياق السريري. يمكن لرفيق مساعدتك على تعلّم المفاهيم؛ وهو لا يحل محل التفسير المهني لنتائجك.",
    sourceTitle: "فهم الخطر الوراثي — خطر الزوجَين",
    sourceUrl: "/understanding-genetic-risk",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["autosomal-recessive-example", "genetic-counselling-when", "screening-limitations"],
  },
  {
    id: "risk-vs-diagnosis",
    title: "الخطر الوراثي مقابل التشخيص",
    category: "inherited-risk",
    keywords: ["خطر وراثي", "تشخيص", "فرق", "فحص", "تقييم سريري"],
    questionPatterns: [
      "ما الفرق بين الخطر الوراثي والتشخيص",
      "هل الفحص تشخيص",
      "هل فحص الحاملين تشخيص",
      "هل يستطيع رفيق تشخيص حالات جينية",
    ],
    answer:
      "الخطر المحسوب أو المقدَّر ليس التشخيص نفسه. قد يشير الخطر الوراثي إلى زيادة إمكانية حالة وراثية؛ وهو لا يثبت بالضرورة أن شخصاً أو طفلاً مستقبلياً لديه تلك الحالة. ويتطلب التشخيص تقييماً سريرياً مناسباً وتفسيراً لأدلة ذات صلة من مختصي رعاية صحية مؤهَّلين. يقدّم رفيق شروحاً تعليمية ودعم قرار. وهو لا يشخّص حالات جينية.",
    sourceTitle: "فهم الخطر الوراثي — الخطر مقابل التشخيص",
    sourceUrl: "/understanding-genetic-risk",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["screening-limitations", "confirmatory-assessment", "genetic-counselling-when"],
  },
  {
    id: "family-relationships",
    title: "العلاقات العائلية والخطر الوراثي",
    category: "inherited-risk",
    keywords: ["عائلة", "اقارب", "زواج الاقارب", "اسلاف"],
    questionPatterns: [
      "هل يعني زواج الاقارب ان الطفل سيكون لديه حالة وراثية",
      "هل تزيد العلاقات العائلية الخطر الوراثي",
    ],
    answer:
      "قد يكون لدى الأقارب البيولوجيين احتمال أعلى لمشاركة متغيّرات وراثية معيّنة لأن لهم أسلافاً مشتركين. غير أن العلاقة العائلية وحدها لا تثبت أن طفلاً سيرث حالة معيّنة. والعلاقة البيولوجية بين الشريكين لا تثبت أن طفلاً ستكون لديه حالة وراثية معيّنة. يمكن للفحص المناسب والتفسير المهني المساعدة على توضيح الأخطار ذات الصلة.",
    sourceTitle: "الأسئلة الشائعة — المعلومات الجينية",
    sourceUrl: "/faq",
    language: "ar",
    reviewStatus: "approved",
    translationStatus: "pending_review",
    followUpIds: ["inheritance-patterns", "genetic-counselling-when", "what-is-screening"],
  },
];
