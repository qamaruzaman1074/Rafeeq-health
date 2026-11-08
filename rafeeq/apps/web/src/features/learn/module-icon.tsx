import type { ReactNode } from "react";
import type { LearnModuleId } from "@/features/learn/modules";

function Glyph({ moduleId }: { moduleId: LearnModuleId }) {
  switch (moduleId) {
    case "carrier":
      return <circle cx="16" cy="16" r="8" fill="currentColor" />;
    case "couple-result":
      return (
        <>
          <circle cx="11" cy="16" r="6" fill="currentColor" />
          <circle cx="21" cy="16" r="6" fill="currentColor" />
        </>
      );
    case "risk-vs-diagnosis":
      return <rect x="8" y="8" width="16" height="16" rx="2" fill="currentColor" />;
    case "uncertainty":
      return <polygon points="16,6 26,24 6,24" fill="currentColor" />;
    case "relatedness":
      return (
        <>
          <circle cx="8" cy="18" r="4" fill="currentColor" />
          <circle cx="16" cy="10" r="4" fill="currentColor" />
          <circle cx="24" cy="18" r="4" fill="currentColor" />
        </>
      );
    case "options":
      return (
        <>
          <rect x="4" y="13" width="6" height="6" fill="currentColor" />
          <rect x="13" y="13" width="6" height="6" fill="currentColor" />
          <rect x="22" y="13" width="6" height="6" fill="currentColor" />
        </>
      );
    case "next":
      return <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="3" />;
    default: {
      const unreachable: never = moduleId;
      return unreachable;
    }
  }
}

export function ModuleIcon({ moduleId }: { moduleId: LearnModuleId }): ReactNode {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-10 w-10 shrink-0 text-teal-700"
      aria-hidden="true"
      data-module-icon={moduleId}
    >
      <Glyph moduleId={moduleId} />
    </svg>
  );
}
