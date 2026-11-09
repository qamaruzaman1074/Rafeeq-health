import { type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

type AssistantDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panelId: string;
  children: ReactNode;
};

export function AssistantDrawer({ open, onOpenChange, panelId, children }: AssistantDrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-40 bg-ink-900/35",
            "motion-safe:animate-fade-in motion-reduce:animate-none",
          )}
        />
        <DialogPrimitive.Content
          id={panelId}
          className={cn(
            "fixed inset-y-0 end-0 z-50 flex h-full w-full flex-col bg-background text-ink-900 shadow-lg",
            "border-s border-border-subtle sm:max-w-md md:max-w-lg",
            "motion-safe:animate-fade-in motion-reduce:animate-none",
            "focus:outline-none",
          )}
          onOpenAutoFocus={(event) => {
            const target = (event.currentTarget as HTMLElement).querySelector<HTMLElement>(
              "[data-assistant-autofocus]",
            );
            if (target) {
              event.preventDefault();
              target.focus();
            }
          }}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
