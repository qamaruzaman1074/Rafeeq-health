import { useTranslation } from "react-i18next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { landmarkName } from "@/lib/landmark-name";

function BookGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-teal-700" aria-hidden="true">
      <path
        d="M10 12h12c2 0 4 2 6 2h10v22H28c-2 0-4-2-6-2H10V12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M22 14v20" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function PersonGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-teal-700" aria-hidden="true">
      <circle cx="24" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M12 36c2-8 8-12 12-12s10 4 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function TalkGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-teal-700" aria-hidden="true">
      <rect
        x="8"
        y="10"
        width="32"
        height="22"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M16 32v6l8-6" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

const ITEMS = [
  { id: "education", Glyph: BookGlyph, english: "General education" },
  { id: "personal", Glyph: PersonGlyph, english: "Personal medical advice" },
  { id: "counsellor", Glyph: TalkGlyph, english: "A qualified counsellor" },
] as const;

export function EducationGuide() {
  const { t } = useTranslation();

  return (
    <section
      className="flex flex-col gap-4"
      data-learn-section="guide"
      aria-labelledby="learn-guide-heading"
    >
      <h2 id="learn-guide-heading" className="text-xl font-semibold text-teal-900">
        {t("guide.heading", { ns: "learn" })}
      </h2>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <Card className="h-full hover:shadow-surface">
              <CardHeader>
                <item.Glyph />
                <CardTitle>
                  {landmarkName(t(`guide.${item.id}.title`, { ns: "learn" }), item.english)}
                </CardTitle>
                <CardDescription>{t(`guide.${item.id}.body`, { ns: "learn" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
