import { useTranslation } from "react-i18next";

const VISUALS = [
  { src: "/images/outcomes/privacy/person-control.svg", key: "person" },
  { src: "/images/outcomes/privacy/consent-document.svg", key: "document" },
  { src: "/images/outcomes/privacy/secure-sharing.svg", key: "sharing" },
] as const;

export function ConsentVisuals() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4" aria-labelledby="consent-visuals-heading">
      <h2 id="consent-visuals-heading" className="text-xl font-semibold text-teal-900">
        {t("education.visuals.heading", { ns: "privacy" })}
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {VISUALS.map((item) => (
          <li key={item.key} className="rounded-xl border border-border-subtle bg-card p-4">
            <img
              src={item.src}
              alt={t(`education.visuals.alt.${item.key}`, { ns: "privacy" })}
              className="mx-auto h-32 w-full max-w-[200px] object-contain"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-2 text-center text-sm text-ink-600">
              {t(`education.visuals.caption.${item.key}`, { ns: "privacy" })}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
