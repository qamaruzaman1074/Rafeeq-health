import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(function Switch({ className, ...props }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        "relative inline-flex h-11 w-16 shrink-0 items-center overflow-hidden rounded-full bg-ink-600 ps-1 pe-1 data-[state=checked]:bg-teal-700 disabled:bg-sand-100 disabled:data-[state=checked]:bg-sand-100",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-7 w-7 rounded-full bg-sand-50 motion-safe:transition-[margin-inline-start] motion-safe:duration-150 data-[state=unchecked]:ms-0 data-[state=checked]:ms-7 data-[disabled]:bg-ink-600",
        )}
      />
    </SwitchPrimitive.Root>
  );
});
