import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { KnowledgeSourceRef } from "@/features/assistant/knowledge";

type SourceReferencesProps = {
  sources: KnowledgeSourceRef[];
};

export function SourceReferences({ sources }: SourceReferencesProps) {
  const { t } = useTranslation("website-assistant");

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 rounded-lg border border-border-subtle bg-card p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
        {t("exploreResources")}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {sources.map((source) => (
          <li key={`${source.url}-${source.title}`}>
            <Link
              to={source.url}
              className="text-sm font-medium text-teal-800 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              {source.title}
            </Link>
            {source.category ? (
              <p className="text-xs text-ink-600">{source.category.replace(/-/g, " ")}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
