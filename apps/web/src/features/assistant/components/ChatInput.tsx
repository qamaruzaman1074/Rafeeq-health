import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export const ASSISTANT_QUESTION_LIMIT = 500;

type ChatInputProps = {
  value: string;
  pending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: Ref<HTMLTextAreaElement>;
};

export function ChatInput({ value, pending, onChange, onSubmit, inputRef }: ChatInputProps) {
  const { t } = useTranslation("website-assistant");
  const trimmed = value.trim();
  const tooLong = value.length > ASSISTANT_QUESTION_LIMIT;

  return (
    <form
      className="flex shrink-0 flex-col gap-2.5 border-t border-border-subtle bg-card/95 p-4 pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] backdrop-blur sm:px-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="sr-only" htmlFor="rafeeq-assistant-input">
        {t("inputLabel")}
      </label>
      <textarea
        id="rafeeq-assistant-input"
        ref={inputRef}
        rows={3}
        maxLength={ASSISTANT_QUESTION_LIMIT}
        value={value}
        disabled={pending}
        data-assistant-autofocus
        className="min-h-[5rem] w-full resize-y rounded-2xl border border-border-subtle bg-background px-4 py-3 text-sm text-ink-900 shadow-inner shadow-slate-950/[0.02] transition-[border-color,box-shadow] placeholder:text-ink-600/70 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
        placeholder={t("inputPlaceholder")}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-600">
          {value.length}/{ASSISTANT_QUESTION_LIMIT}
        </p>
        <Button
          type="submit"
          className="min-h-10 rounded-xl px-4 shadow-sm"
          disabled={pending || trimmed.length === 0 || tooLong}
        >
          {pending ? t("sending") : t("send")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="ms-2 size-4"
            aria-hidden="true"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
      <p className="text-[0.7rem] leading-relaxed text-ink-600">{t("disclaimer")}</p>
    </form>
  );
}
