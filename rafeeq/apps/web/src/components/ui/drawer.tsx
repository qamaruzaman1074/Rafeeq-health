import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerTitle = DialogPrimitive.Title;
export const DrawerDescription = DialogPrimitive.Description;
export const DrawerClose = DialogPrimitive.Close;

type DrawerContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  closeLabel?: ReactNode;
};

export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent({ className, children, closeLabel, ...props }, ref) {
  const { t } = useTranslation();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed start-0 end-0 top-0 bottom-0 z-40 bg-transparent" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed end-0 top-0 bottom-0 z-50 flex h-full w-full max-w-sm flex-col gap-4 overflow-y-auto border-s border-teal-500 bg-sand-50 p-6 text-ink-900 motion-safe:animate-fade-in",
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" className="shrink-0">
              {closeLabel ?? t("common.close")}
            </Button>
          </DialogPrimitive.Close>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
