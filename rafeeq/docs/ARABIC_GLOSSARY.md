# Arabic terminology glossary (draft)

Status: **draft — pending review by a qualified Arabic-speaking genetics / medical reviewer.**

All Arabic UI copy in `apps/web/src/i18n/locales/ar/` and the Arabic assistant knowledge in
`apps/web/src/features/assistant/knowledge/ar/` follows this glossary. Register: Modern Standard
Arabic (العربية الفصحى), neutral across Gulf and Levant readers, plain-language where the English is
plain-language.

## Core terms

| English | Arabic | Notes |
|---|---|---|
| Rafeeq / RAFEEQ | رفيق | Brand name in Arabic UI. The logo is not translated. |
| Genetic screening | الفحص الجيني | "Screening" is فحص; reserve اختبار for "test/testing". |
| Carrier screening | فحص الحاملين للصفة الوراثية | Short form: فحص الحاملين. |
| Genetic test / testing | الاختبار الجيني | |
| Carrier | حامل للصفة الوراثية | Avoid bare حامل (also means "pregnant"). |
| Carrier status | حالة حمل الصفة الوراثية | |
| Inherited condition(s) | حالة / حالات وراثية | Avoid مرض وراثي unless the English says "disease". |
| Inherited disease | مرض وراثي | |
| Genetic counselling | الإرشاد الوراثي | |
| Genetic counsellor | أخصائي الإرشاد الوراثي | Plural: أخصائيو الإرشاد الوراثي. |
| Informed consent | الموافقة المستنيرة | |
| Consent | الموافقة | |
| Inheritance pattern | نمط الوراثة | |
| Recessive inheritance | الوراثة المتنحية | |
| Autosomal recessive | وراثة جسمية متنحية | |
| Autosomal dominant | وراثة جسمية سائدة | |
| X-linked | مرتبطة بالكروموسوم X | Keep the Latin letter X. |
| Genetic risk | الخطر الوراثي | For "chance" use احتمال. |
| Chance (per pregnancy) | احتمال (لكل حمل) | |
| Risk vs diagnosis | الخطر مقابل التشخيص | |
| Diagnosis | التشخيص | |
| Confirmatory testing | الاختبار التأكيدي | |
| Confirmatory assessment | التقييم التأكيدي | |
| Residual risk | الخطر المتبقي | |
| Variant | متغيّر جيني | Plural: متغيّرات جينية. |
| Pathogenic variant | متغيّر مُمرِض | "Likely pathogenic": متغيّر يُرجَّح أنه مُمرِض. |
| Variant of uncertain significance (VUS) | متغيّر غير مؤكَّد الأهمية (VUS) | Keep "VUS". |
| Gene | جين | Plural: جينات. Gene symbols (HBB, CFTR) stay in Latin. |
| Privacy | الخصوصية | |
| Sharing permission | إذن المشاركة | |
| Revoke | إلغاء / سحب (الإذن) | |
| Healthcare professional | مختص رعاية صحية | "Qualified": مؤهَّل. |
| Clinician | طبيب / مختص سريري | |
| Partner | الشريك | Couple: الزوجان / الشريكان (context). |
| Biological parents | الوالدان البيولوجيان | |
| Consanguineous marriage | زواج الأقارب | |
| Family history | التاريخ العائلي | |
| Referral | الإحالة | |
| Pathway | مسار | |
| Demo | تجريبي / العرض التجريبي | |
| Fictional | خيالي / افتراضي | Use افتراضي for profiles and data. |
| Educational information only | معلومات تعليمية فقط | |
| Teach-back | الشرح بالمقابل (إعادة الشرح) | |

## Conditions

| English | Arabic |
|---|---|
| Sickle cell disease | مرض الخلايا المنجلية (فقر الدم المنجلي) |
| Sickle cell trait | سمة الخلايا المنجلية |
| Beta-thalassemia | الثلاسيميا بيتا |
| Alpha-thalassemia | الثلاسيميا ألفا |
| Cystic fibrosis | التليّف الكيسي |
| Spinal muscular atrophy | ضمور العضلات الشوكي |

## Language rules

- Keep numbers, percentages, and ratios exactly as in English (e.g. `25%`, `1 in 4` → `1 من 4`).
- Keep interpolation tokens such as `{{name}}` and `{{count}}` unchanged.
- Never add or remove clinical claims, qualifications, uncertainty statements, or disclaimers.
- Non-judgemental wording only. Do not use Arabic equivalents of banned English terms:
  معيب، غير طبيعي، طافر، جينات سيئة، زوجان خطران، غير متوافقين، خطير، يجب عليك، لا ينبغي أن تتزوج.
- Directional arrows in Arabic copy point right-to-left (`←`).
- Emails, URLs, gene symbols, and the letters `X`/`VUS` stay in Latin script.

## Review

Until a qualified reviewer signs off, every Arabic clinical string is a **draft**. The UI shows
`common.locale.arReviewNotice` in Arabic mode to say so.
