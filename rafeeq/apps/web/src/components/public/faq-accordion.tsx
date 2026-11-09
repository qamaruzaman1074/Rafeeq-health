import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

type FaqAccordionProps = {
  categories: FaqCategory[];
  className?: string;
};

export function FaqAccordion({ categories, className }: FaqAccordionProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) {
      return categories;
    }
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(needle) ||
            item.answer.toLowerCase().includes(needle),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, query]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-teal-900">
          {t("faq.searchLabel", { ns: "public" })}
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder={t("faq.searchPlaceholder", { ns: "public" })}
          className="min-h-11 w-full rounded-lg border border-border bg-card ps-3 pe-3 text-base text-foreground shadow-xs transition-shadow duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:shadow-surface-md"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="text-base text-ink-600" role="status">
          {t("faq.noResults", { ns: "public" })}
        </p>
      ) : null}

      {filtered.map((category) => (
        <section
          key={category.id}
          aria-labelledby={`faq-${category.id}`}
          className="flex flex-col gap-3"
        >
          <h2 id={`faq-${category.id}`} className="text-section text-teal-900">
            {category.title}
          </h2>
          <ul className="flex flex-col gap-2">
            {category.items.map((item) => (
              <li key={item.id}>
                <details className="group motion-card-lift surface-elevated rounded-lg ps-4 pe-4 py-1">
                  <summary className="min-h-11 cursor-pointer list-none py-3 text-base font-medium text-teal-900 transition-colors duration-200 marker:content-none hover:text-teal-700 motion-safe:active:scale-[0.995] [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {item.question}
                      <span
                        aria-hidden="true"
                        className="text-teal-700 transition-transform group-open:rotate-180"
                      >
                        ▾
                      </span>
                    </span>
                  </summary>
                  <div className="border-t border-border-subtle pb-4 pt-3 text-base leading-relaxed text-ink-600">
                    {item.answer}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function usePublicFaqCategories(): FaqCategory[] {
  const { t } = useTranslation();
  const categoryIds = ["general", "genetics", "privacy", "counselling"] as const;

  return categoryIds.map((categoryId) => {
    const raw = t(`faq.categories.${categoryId}.items`, { ns: "public", returnObjects: true });
    const items = Array.isArray(raw)
      ? (raw as Array<{ id: string; q: string; a: string }>).map((entry) => ({
          id: entry.id,
          question: entry.q,
          answer: entry.a,
        }))
      : [];
    return {
      id: categoryId,
      title: t(`faq.categories.${categoryId}.title`, { ns: "public" }),
      items,
    };
  });
}
