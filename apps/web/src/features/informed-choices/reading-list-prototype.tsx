import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCopyList } from "@/i18n/copy-list";

type Resource = {
  id: string;
  title: string;
  href: string;
};

export function ReadingListPrototype() {
  const { t } = useTranslation();
  const resources = useCopyList<Resource>("informedChoices.readingList.resources", "public");
  const [selected, setSelected] = useState<readonly string[]>([]);

  function toggle(id: string): void {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const saved = resources.filter((item) => selected.includes(item.id));

  return (
    <section className="flex flex-col gap-4" aria-labelledby="reading-list-heading">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="reading-list-heading" className="text-2xl font-semibold text-teal-900">
          {t("informedChoices.readingList.heading", { ns: "public" })}
        </h2>
        <Badge variant="notice">{t("informedChoices.readingList.prototype", { ns: "public" })}</Badge>
      </div>
      <p className="max-w-3xl text-base leading-relaxed text-ink-600">
        {t("informedChoices.readingList.lead", { ns: "public" })}
      </p>
      <ul className="flex flex-col gap-3">
        {resources.map((item) => {
          const onList = selected.includes(item.id);
          return (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-teal-900">{item.title}</span>
                <Link to={item.href} className="text-sm text-teal-800 underline-offset-4 hover:underline">
                  {t("informedChoices.readingList.open", { ns: "public" })}
                </Link>
              </div>
              <Button
                type="button"
                variant={onList ? "primary" : "secondary"}
                className="w-fit"
                aria-pressed={onList}
                onClick={() => {
                  toggle(item.id);
                }}
              >
                {onList
                  ? t("informedChoices.readingList.remove", { ns: "public" })
                  : t("informedChoices.readingList.add", { ns: "public" })}
              </Button>
            </li>
          );
        })}
      </ul>
      <SavedListPreview saved={saved} />
    </section>
  );
}

function SavedListPreview({ saved }: { saved: Resource[] }) {
  const { t } = useTranslation();
  if (saved.length === 0) {
    return (
      <p className="text-sm text-ink-600">{t("informedChoices.readingList.empty", { ns: "public" })}</p>
    );
  }
  return (
    <aside className="rounded-lg border border-dashed border-teal-600 bg-teal-50/50 p-4">
      <h3 className="text-sm font-semibold text-teal-900">
        {t("informedChoices.readingList.savedHeading", { ns: "public" })}
      </h3>
      <ul className="mt-2 list-disc ps-5 text-sm text-ink-600">
        {saved.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-ink-600">{t("informedChoices.readingList.persistence", { ns: "public" })}</p>
    </aside>
  );
}
