import { useTranslation } from "react-i18next";
import { NoticePanel } from "@/components/public/marketing-blocks";
import { useCopyList } from "@/i18n/copy-list";

export function CounsellingBoundaries() {
  const { t } = useTranslation();
  const layers = useCopyList<string>("counsellingPage.boundaries.items", "public");

  return (
    <section className="flex flex-col gap-4" aria-labelledby="counselling-boundaries-heading">
      <h2 id="counselling-boundaries-heading" className="text-2xl font-semibold text-teal-900">
        {t("counsellingPage.boundaries.heading", { ns: "public" })}
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {layers.map((item) => (
          <li
            key={item.slice(0, 28)}
            className="rounded-lg border border-border-subtle bg-card p-4 text-base leading-relaxed text-ink-600"
          >
            {item}
          </li>
        ))}
      </ul>
      <NoticePanel>
        <p className="font-medium">{t("counsellingPage.boundaries.disclaimer", { ns: "public" })}</p>
      </NoticePanel>
    </section>
  );
}
