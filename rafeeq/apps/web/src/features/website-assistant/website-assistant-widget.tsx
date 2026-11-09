import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { postWebsiteAssistant } from "@/features/website-assistant/api";
import { suggestedWebsiteQuestions } from "@/features/website-assistant/suggested";
import type { AssistantTurn } from "@/features/website-assistant/types";
import { cn } from "@/lib/utils";

const QUESTION_LIMIT = 500;

export function WebsiteAssistantWidget() {
  const { t } = useTranslation();
  const listId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [turns, setTurns] = useState<AssistantTurn[]>([]);
  const suggestions = suggestedWebsiteQuestions();

  function clearConversation() {
    setTurns([]);
    setDraft("");
  }

  function send(message: string) {
    const text = message.trim();
    if (text.length === 0 || text.length > QUESTION_LIMIT || pending) {
      return;
    }
    const userId = `u_${Date.now()}`;
    const assistantId = `a_${Date.now()}`;
    setTurns((current) => [
      ...current,
      { id: userId, role: "user", text, status: "ready" },
      { id: assistantId, role: "assistant", text: "", status: "pending" },
    ]);
    setDraft("");
    setPending(true);
    void postWebsiteAssistant(text)
      .then((reply) => {
        setTurns((current) =>
          current.map((turn) =>
            turn.id === assistantId
              ? {
                  ...turn,
                  text: reply.text,
                  status: "ready",
                  sources: reply.sources,
                }
              : turn,
          ),
        );
      })
      .catch(() => {
        setTurns((current) =>
          current.map((turn) =>
            turn.id === assistantId
              ? {
                  ...turn,
                  text: t("error.generic", { ns: "website-assistant" }),
                  status: "failed",
                }
              : turn,
          ),
        );
      })
      .finally(() => {
        setPending(false);
        inputRef.current?.focus();
      });
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-end p-4 sm:p-6">
        <Button
          type="button"
          className="pointer-events-auto shadow-lg"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen(true)}
        >
          {t("launcher", { ns: "website-assistant" })}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          id={listId}
          className="flex max-h-[min(32rem,85vh)] w-[min(100%,24rem)] flex-col gap-3 p-0 sm:max-w-md"
        >
          <div className="border-b border-border-subtle p-4 pb-3">
            <DialogTitle className="text-lg font-semibold">
              {t("title", { ns: "website-assistant" })}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-ink-700">
              {t("welcome", { ns: "website-assistant" })}
            </DialogDescription>
          </div>

          <div
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {turns.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-ink-700">{t("suggestedIntro", { ns: "website-assistant" })}</p>
                <ul className="flex flex-col gap-2">
                  {suggestions.map((question) => (
                    <li key={question}>
                      <button
                        type="button"
                        className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-start text-sm hover:bg-secondary"
                        onClick={() => send(question)}
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {turns.map((turn) => (
              <AssistantTurnBubble key={turn.id} turn={turn} />
            ))}
          </div>

          <form
            className="flex flex-col gap-2 border-t border-border-subtle p-4 pt-3"
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <label className="sr-only" htmlFor="website-assistant-input">
              {t("inputLabel", { ns: "website-assistant" })}
            </label>
            <textarea
              id="website-assistant-input"
              ref={inputRef}
              rows={3}
              maxLength={QUESTION_LIMIT}
              value={draft}
              disabled={pending}
              className="min-h-[4.5rem] w-full resize-y rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
              placeholder={t("inputPlaceholder", { ns: "website-assistant" })}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(draft);
                }
              }}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={pending || draft.trim().length === 0}>
                {pending ? t("sending", { ns: "website-assistant" }) : t("send", { ns: "website-assistant" })}
              </Button>
              <Button type="button" variant="secondary" disabled={pending} onClick={clearConversation}>
                {t("clear", { ns: "website-assistant" })}
              </Button>
            </div>
            <p className="text-xs text-ink-600">{t("disclaimer", { ns: "website-assistant" })}</p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AssistantTurnBubble({ turn }: { turn: AssistantTurn }) {
  const { t } = useTranslation();
  const isUser = turn.role === "user";
  return (
    <div
      className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}
      data-role={turn.role}
    >
      <div
        className={cn(
          "max-w-[95%] rounded-xl px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-ink-900",
        )}
      >
        {turn.status === "pending" ? (
          <span className="inline-flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-ink-500" aria-hidden />
            {t("loading", { ns: "website-assistant" })}
          </span>
        ) : (
          turn.text
        )}
      </div>
      {!isUser && turn.sources && turn.sources.length > 0 ? (
        <ul className="max-w-[95%] text-xs text-ink-600">
          <li className="font-medium">{t("sources", { ns: "website-assistant" })}</li>
          {turn.sources.map((source) => (
            <li key={`${source.title}-${source.excerpt.slice(0, 24)}`}>
              {source.title}
              {source.excerpt ? ` — ${source.excerpt}` : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
