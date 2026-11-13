import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RESOURCE_LINKS = [
  {
    titleKey: "risk.heroTitle",
    descriptionKey: "risk.heroIntro",
    href: "/understanding-genetic-risk",
    image: "/images/outcomes/inherited-risk/hero-genetics.webp",
  },
  {
    titleKey: "informedChoices.hero.title",
    descriptionKey: "informedChoices.hero.intro",
    href: "/informed-choices",
    image: "/images/outcomes/informed-choices/reviewing-education.webp",
  },
  {
    titleKey: "screeningPathways.hero.title",
    descriptionKey: "screeningPathways.hero.intro",
    href: "/screening-pathways",
    image: "/images/outcomes/screening-pathways/laboratory.webp",
  },
  {
    titleKey: "faq.title",
    descriptionKey: "faq.intro",
    href: "/faq",
    image: "/images/problem-solution/ai-healthcare-assistant.jpg",
  },
  {
    titleKey: "counsellingPage.heroTitle",
    descriptionKey: "counsellingPage.heroIntro",
    href: "/genetic-counselling",
    image: "/images/outcomes/genetic-counselling/counselling-consultation.jpg",
  },
  {
    titleKey: "page.title",
    descriptionKey: "page.intro",
    href: "/app/learn",
    image: "/images/outcomes/comprehension-access/learning-journey.svg",
  },
] as const;

export function ResourcesView() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const resources = useMemo(
    () =>
      RESOURCE_LINKS.filter((resource) => {
        const title = t(resource.titleKey, {
          ns: resource.href === "/app/learn" ? "learn" : "public",
        });
        const description = t(resource.descriptionKey, {
          ns: resource.href === "/app/learn" ? "learn" : "public",
        });
        const needle = search.trim().toLocaleLowerCase();
        return (
          needle.length === 0 || `${title} ${description}`.toLocaleLowerCase().includes(needle)
        );
      }),
    [search, t],
  );

  return (
    <AppPageLayout width="wide">
      <PageHeader
        title={t("resources.title", { ns: "couple" })}
        description={t("resources.intro", { ns: "couple" })}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="resource-search" className="text-sm font-semibold text-teal-900">
          {t("resources.searchLabel", { ns: "couple" })}
        </label>
        <input
          id="resource-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("resources.searchPlaceholder", { ns: "couple" })}
          className="min-h-12 w-full max-w-xl rounded-lg border border-border-subtle bg-background px-4 text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        />
      </div>
      {resources.length > 0 ? (
        <RevealStagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => {
            const namespace = resource.href === "/app/learn" ? "learn" : "public";
            return (
              <Card key={resource.href} className="motion-card-lift h-full overflow-hidden">
                <img
                  src={resource.image}
                  alt=""
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <CardHeader className="gap-3">
                  <CardTitle>{t(resource.titleKey, { ns: namespace })}</CardTitle>
                  <CardDescription>{t(resource.descriptionKey, { ns: namespace })}</CardDescription>
                  <Button asChild variant="secondary" className="w-fit">
                    <Link to={resource.href}>{t("resources.open", { ns: "couple" })}</Link>
                  </Button>
                </CardHeader>
              </Card>
            );
          })}
        </RevealStagger>
      ) : (
        <p
          role="status"
          className="rounded-xl border border-border-subtle bg-card p-5 text-ink-600"
        >
          {t("resources.noResults", { ns: "couple" })}
        </p>
      )}
    </AppPageLayout>
  );
}
