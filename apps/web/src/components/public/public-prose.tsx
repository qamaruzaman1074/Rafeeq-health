import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PublicProse({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full max-w-3xl flex-col gap-5 text-base leading-relaxed text-ink-600 sm:text-lg sm:leading-relaxed [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-section [&_h2]:text-teal-900 [&_li]:rounded-md [&_li]:ps-1 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:ps-6 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:ps-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
