import { useTranslation } from "react-i18next";
import { FollowUpQuestions } from "@/features/assistant/components/FollowUpQuestions";
import { SourceReferences } from "@/features/assistant/components/SourceReferences";
import type { AssistantMessage } from "@/features/assistant/types";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: AssistantMessage;
  onFollowUp: (question: string) => void;
};

export function ChatMessage({ message, onFollowUp }: ChatMessageProps) {
  const { t } = useTranslation("website-assistant");
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}
      data-role={message.role}
    >
      {!isUser ? (
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-700 p-1 shadow-sm">
          <img
            src="/images/website-assistant/rafeeq-assistant-launcher.svg"
            alt=""
            width={28}
            height={28}
            className="size-full object-contain"
          />
        </div>
      ) : null}
      <div
        className={cn(
          "flex min-w-0 max-w-[88%] flex-col gap-1",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
            isUser
              ? "rounded-ee-md bg-gradient-to-br from-teal-700 to-cyan-800 text-white"
              : "rounded-es-md border border-border-subtle bg-card text-ink-900",
            message.status === "failed" && "border border-destructive/40",
          )}
        >
          {message.status === "pending" ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-teal-600" aria-hidden />
              {t("loading")}
            </span>
          ) : (
            <p className="whitespace-pre-line">{message.text}</p>
          )}
        </div>
        {!isUser && message.status === "ready" ? (
          <>
            {message.sources ? <SourceReferences sources={message.sources} /> : null}
            {message.followUps ? (
              <FollowUpQuestions questions={message.followUps} onSelect={onFollowUp} />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
