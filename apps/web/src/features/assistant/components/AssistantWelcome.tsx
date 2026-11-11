import { useTranslation } from "react-i18next";
import { SuggestedQuestions } from "@/features/assistant/components/SuggestedQuestions";

type AssistantWelcomeProps = {
  pathname: string;
  onSelect: (question: string) => void;
};

export function AssistantWelcome({ pathname, onSelect }: AssistantWelcomeProps) {
  const { t } = useTranslation("website-assistant");

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5 shadow-sm">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-10 -top-12 size-36 rounded-full bg-cyan-100/70 blur-2xl"
        />
        <div className="relative flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-cyan-700 p-1.5 shadow-md shadow-teal-900/20">
            <img
              src="/images/website-assistant/rafeeq-assistant-launcher.svg"
              alt=""
              width={40}
              height={40}
              className="size-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-teal-950">{t("welcomeHeading")}</p>
            <p className="mt-0.5 text-xs text-teal-800/80">{t("welcomeSubheading")}</p>
          </div>
        </div>
        <p className="relative mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-800">
          {t("welcomeMessage")}
        </p>
      </div>
      <p className="flex items-start gap-2.5 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        >
          <path
            d="M12 8v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t("educationNotice")}
      </p>
      <SuggestedQuestions pathname={pathname} onSelect={onSelect} mode="welcome" />
    </div>
  );
}
