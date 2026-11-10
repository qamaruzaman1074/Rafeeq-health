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
      className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}
      data-role={message.role}
    >
      <div
        className={cn(
          "max-w-[95%] rounded-xl px-3 py-2 text-sm leading-relaxed",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-ink-900",
          message.status === "failed" && "border border-destructive/40",
        )}
      >
        {message.status === "pending" ? (
          <span className="inline-flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-ink-600" aria-hidden />
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
  );
}
