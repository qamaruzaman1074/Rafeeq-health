import { useId, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { AssistantDrawer } from "@/features/assistant/components/AssistantDrawer";
import { AssistantHeader } from "@/features/assistant/components/AssistantHeader";
import { AssistantLauncher } from "@/features/assistant/components/AssistantLauncher";
import { AssistantWelcome } from "@/features/assistant/components/AssistantWelcome";
import { ChatInput, ASSISTANT_QUESTION_LIMIT } from "@/features/assistant/components/ChatInput";
import { ChatMessage } from "@/features/assistant/components/ChatMessage";
import type { AssistantMessage } from "@/features/assistant/types";
import { generateAnswer } from "@/features/assistant/utils/generateAnswer";

export function KnowledgeAssistant() {
  const { i18n, t } = useTranslation("website-assistant");
  const language = i18n.resolvedLanguage === "ar" ? "ar" : "en";
  const { pathname } = useLocation();
  const panelId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);

  function clearConversation() {
    setMessages([]);
    setDraft("");
  }

  function send(message: string) {
    const text = message.trim();
    if (text.length === 0 || text.length > ASSISTANT_QUESTION_LIMIT || pending) {
      return;
    }

    const userId = `u_${Date.now()}`;
    const assistantId = `a_${Date.now()}`;
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text, status: "ready" },
      { id: assistantId, role: "assistant", text: "", status: "pending" },
    ]);
    setDraft("");
    setPending(true);

    // Local retrieval only — brief tick keeps the loading indicator perceptible.
    window.setTimeout(() => {
      try {
        const answer = generateAnswer(text, { language });
        setMessages((current) =>
          current.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  text: answer.text,
                  status: "ready",
                  sources: answer.sources,
                  followUps: answer.followUpQuestions,
                  matched: answer.matched,
                }
              : item,
          ),
        );
      } catch {
        setMessages((current) =>
          current.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  text: t("error.generic"),
                  status: "failed",
                }
              : item,
          ),
        );
      } finally {
        setPending(false);
        inputRef.current?.focus();
      }
    }, 120);
  }

  return (
    <>
      <AssistantLauncher open={open} panelId={panelId} onOpen={() => setOpen(true)} />
      <AssistantDrawer open={open} onOpenChange={setOpen} panelId={panelId}>
        <AssistantHeader
          canClear={messages.length > 0 || draft.length > 0}
          onClear={clearConversation}
          onClose={() => setOpen(false)}
        />
        <div
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.length === 0 ? (
            <AssistantWelcome pathname={pathname} onSelect={send} />
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} onFollowUp={send} />
            ))
          )}
        </div>
        <ChatInput
          value={draft}
          pending={pending}
          onChange={setDraft}
          onSubmit={() => send(draft)}
          inputRef={inputRef}
        />
      </AssistantDrawer>
    </>
  );
}
