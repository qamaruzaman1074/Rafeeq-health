import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { NoticePanel } from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { useCopyList } from "@/i18n/copy-list";

type Condition = {
  id: string;
  name: string;
  summary: string;
  pattern: string;
  carrier: string;
  screening: string;
  advice: string;
};

const detailKeys = ["pattern", "carrier", "screening", "advice"] as const;

export function Component() {
  const { t } = useTranslation();
  const conditions = useCopyList<Condition>("conditions.items", "public");

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14">
        <PageHeader
          eyebrow={t("conditions.eyebrow", { ns: "public" })}
          title={t("conditions.heroTitle", { ns: "public" })}
          description={t("conditions.heroIntro", { ns: "public" })}
        />
        <nav aria-label={t("conditions.title", { ns: "public" })}>
          <ul className="flex flex-wrap gap-2">
            {conditions.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="nav-pill inline-flex min-h-11 items-center border border-border-subtle bg-card"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section wide className="surface-muted">
        <RevealStagger className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
          {conditions.map((item) => (
            <article
              key={item.id}
              id={item.id}
              aria-labelledby={`${item.id}-name`}
              className="flex scroll-mt-28 flex-col gap-5 rounded-xl border border-border-subtle bg-card p-6 shadow-xs sm:p-8"
            >
              <div className="flex flex-col gap-2">
                <h2 id={`${item.id}-name`} className="text-2xl font-semibold text-teal-900">
                  {item.name}
                </h2>
                <p className="text-base leading-relaxed text-ink-900">{item.summary}</p>
              </div>
              <dl className="grid grid-cols-1 gap-4 border-t border-border-subtle pt-5 sm:grid-cols-2">
                {detailKeys.map((key) => (
                  <div key={key} className="flex flex-col gap-1">
                    <dt className="text-sm font-semibold text-teal-900">
                      {t(`conditions.labels.${key}`, { ns: "public" })}
                    </dt>
                    <dd className="text-base leading-relaxed text-ink-600">{item[key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </RevealStagger>
      </Section>

      <Section wide className="!pb-16">
        <NoticePanel>
          <p>{t("conditions.disclaimer", { ns: "public" })}</p>
        </NoticePanel>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/understanding-genetic-risk">{t("nav.risk", { ns: "public" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/genetic-counselling">{t("nav.counselling", { ns: "public" })}</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}
