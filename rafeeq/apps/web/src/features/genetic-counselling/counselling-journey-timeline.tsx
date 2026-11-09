import { useCopyList } from "@/i18n/copy-list";

type JourneyStep = { step: string; title: string; body: string };

export function CounsellingJourneyTimeline() {
  const steps = useCopyList<JourneyStep>("counsellingPage.journey.steps", "public");

  return (
    <ol className="relative flex flex-col gap-0 border-s-2 border-teal-200 ps-6">
      {steps.map((item, index) => (
        <li key={item.title} className="relative pb-8 last:pb-0">
          <span
            className="absolute -start-[1.625rem] flex size-8 items-center justify-center rounded-full border-2 border-teal-700 bg-teal-50 text-xs font-bold text-teal-900"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{item.step}</p>
            <h3 className="text-lg font-semibold text-teal-900">{item.title}</h3>
            <p className="text-base leading-relaxed text-ink-600">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
