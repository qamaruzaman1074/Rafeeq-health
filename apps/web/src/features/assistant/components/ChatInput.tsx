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
      className="flex flex-col gap-2 border-t border-border-subtle bg-card p-4 pt-3"
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
        className="min-h-[4.5rem] w-full resize-y rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-ink-900"
        placeholder={t("inputPlaceholder")}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={pending || trimmed.length === 0 || tooLong}>
          {pending ? t("sending") : t("send")}
        </Button>
        <p className="text-xs text-ink-600">
          {value.length}/{ASSISTANT_QUESTION_LIMIT}
        </p>
      </div>
      <p className="text-xs text-ink-600">{t("disclaimer")}</p>
    </form>
  );
}
