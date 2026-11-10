import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const LINKS = [
  { key: "learn", href: "/app/learn" },
  { key: "privacy", href: "/app/privacy" },
  { key: "care", href: "/app/care" },
  { key: "public", href: "/genetic-counselling" },
] as const;

export function ProfessionalSupportPathway() {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("handoff.pathway.label", { ns: "ask" })} className="w-full">
      <ol className="flex flex-col gap-2 rounded-lg border border-teal-600 bg-background p-4">
        {LINKS.map((item, index) => (
          <li key={item.key} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span className="text-xs font-semibold text-teal-800">
              {t("handoff.pathway.step", { ns: "ask", n: index + 1 })}
            </span>
            <span className="flex-1 text-sm text-ink-600">
              {t(`handoff.pathway.${item.key}`, { ns: "ask" })}
            </span>
            <Button asChild variant="secondary" className="w-fit">
              <Link to={item.href}>{t(`handoff.pathway.action.${item.key}`, { ns: "ask" })}</Link>
            </Button>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-ink-600">{t("handoff.pathway.noHandoff", { ns: "ask" })}</p>
    </nav>
  );
}
