import { useTranslation } from "react-i18next";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { useCopyList } from "@/i18n/copy-list";

type JourneyStep = { step: string; title: string; body: string };

export function CounsellingJourneyTimeline() {
  const { t } = useTranslation();
  const steps = useCopyList<JourneyStep>("counsellingPage.journey.steps", "public");

  return (
    <RevealStagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {steps.map((item, index) => (
        <article
          key={item.title}
          className="group relative flex min-w-0 flex-col gap-3 rounded-2xl border border-teal-100/80 bg-gradient-to-br from-white to-teal-50/60 p-4 shadow-sm transition-[transform,box-shadow,border-color] duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-teal-300 motion-safe:hover:shadow-lg motion-safe:hover:shadow-teal-900/10 sm:p-5"
        >
          <div className="flex items-center gap-2">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 text-[0.65rem] font-bold text-white shadow-md shadow-teal-900/15 transition-transform duration-300 motion-safe:group-hover:scale-110"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-teal-700">
              {item.step}
            </p>
          </div>
          <h3 className="text-base font-semibold leading-snug text-teal-950 sm:text-lg">
            {item.title}
          </h3>
          <p className="text-sm leading-relaxed text-ink-600">{item.body}</p>
        </article>
      ))}
      <span className="sr-only">{t("counsellingPage.journey.heading", { ns: "public" })}</span>
    </RevealStagger>
  );
}
