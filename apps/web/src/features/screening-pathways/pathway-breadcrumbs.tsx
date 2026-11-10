import { useTranslation } from "react-i18next";
import { Link } from "react-router";

type Crumb = {
  href: string;
  labelKey: string;
};

const PUBLIC_HUB = "/screening-pathways";

export function ScreeningPathwayBreadcrumbs({ current }: { current: "hub" | "result" | "care" | "counselling" }) {
  const { t } = useTranslation();
  const crumbs: Crumb[] = [{ href: PUBLIC_HUB, labelKey: "screeningPathways.breadcrumbs.hub" }];
  if (current === "result") {
    crumbs.push({ href: "/app/result", labelKey: "screeningPathways.breadcrumbs.result" });
  } else if (current === "care") {
    crumbs.push({ href: "/app/care", labelKey: "screeningPathways.breadcrumbs.care" });
  } else if (current === "counselling") {
    crumbs.push({ href: "/genetic-counselling", labelKey: "screeningPathways.breadcrumbs.counselling" });
  }

  return (
    <nav aria-label={t("screeningPathways.breadcrumbs.label", { ns: "public" })} className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-ink-600">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {isLast ? (
                <span className="font-medium text-teal-900" aria-current="page">
                  {t(crumb.labelKey, { ns: "public" })}
                </span>
              ) : (
                <Link to={crumb.href} className="text-teal-800 underline-offset-4 hover:underline">
                  {t(crumb.labelKey, { ns: "public" })}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PathwayNextSteps({ from }: { from: "result" | "care" }) {
  const { t } = useTranslation();
  const links =
    from === "result"
      ? (
          [
            { href: PUBLIC_HUB, key: "hub" },
            { href: "/understanding-genetic-risk", key: "risk" },
            { href: "/genetic-counselling", key: "counselling" },
            { href: "/app/care", key: "care" },
          ] as const
        )
      : (
          [
            { href: PUBLIC_HUB, key: "hub" },
            { href: "/app/result", key: "result" },
            { href: "/app/privacy", key: "privacy" },
            { href: "/genetic-counselling", key: "counselling" },
          ] as const
        );

  return (
    <section className="flex flex-col gap-3" aria-labelledby={`pathway-next-${from}`}>
      <h2 id={`pathway-next-${from}`} className="text-xl font-semibold text-teal-900">
        {t("screeningPathways.nextSteps.heading", { ns: "public" })}
      </h2>
      <p className="max-w-2xl text-sm text-ink-600">{t("screeningPathways.nextSteps.lead", { ns: "public" })}</p>
      <ScreeningPathwayBreadcrumbs current={from} />
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="nav-pill inline-flex min-h-11 items-center border border-border-subtle bg-card px-4 text-sm font-medium text-teal-900"
            >
              {t(`screeningPathways.nextSteps.links.${link.key}`, { ns: "public" })}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
