import { useTranslation } from "react-i18next";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { useCopyList } from "@/i18n/copy-list";

type JourneyStep = { step: string; title: string; body: string };

export function CounsellingJourneyTimeline() {
  const { t } = useTranslation();
  const steps = useCopyList<JourneyStep>("counsellingPage.journey.steps", "public");

  return (
    <RevealStagger className="relative flex flex-col gap-4">
      {steps.map((item, index) => (
        <article
          key={item.title}
          className="relative flex gap-4 border-s-2 border-teal-200 ps-5 transition-[border-color] duration-300 motion-safe:hover:border-teal-500"
        >
          <span
            className="absolute -start-[0.85rem] top-4 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-teal-700 bg-teal-50 text-xs font-bold text-teal-900 shadow-sm"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="flex flex-1 flex-col gap-1 rounded-xl border border-border-subtle bg-card p-4 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{item.step}</p>
            <h3 className="text-lg font-semibold text-teal-900">{item.title}</h3>
            <p className="text-base leading-relaxed text-ink-600">{item.body}</p>
          </div>
        </article>
      ))}
      <span className="sr-only">{t("counsellingPage.journey.heading", { ns: "public" })}</span>
    </RevealStagger>
  );
}
