import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  children?: ReactNode;
};

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(function TooltipContent({ className, side = "bottom", sideOffset = 8, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-xs rounded-md bg-primary p-3 text-sm text-primary-foreground motion-safe:animate-fade-in",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
