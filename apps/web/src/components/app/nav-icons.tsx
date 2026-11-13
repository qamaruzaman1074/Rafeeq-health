import type { ReactNode } from "react";

export type CoupleNavIconId =
  | "overview"
  | "results"
  | "learn"
  | "check"
  | "privacy"
  | "care"
  | "together"
  | "ask"
  | "settings"
  | "report"
  | "partner"
  | "resources"
  | "notifications"
  | "more";

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function CoupleNavIcon({ id }: { id: CoupleNavIconId }) {
  switch (id) {
    case "overview":
      return (
        <IconFrame>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
        </IconFrame>
      );
    case "results":
      return (
        <IconFrame>
          <rect x="6" y="3.5" width="12" height="17" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h3" />
        </IconFrame>
      );
    case "learn":
      return (
        <IconFrame>
          <path d="M4 6.5c2.2-1 4.4-1.5 8-1.5s5.8.5 8 1.5V18c-2.2-1-4.4-1.5-8-1.5s-5.8.5-8 1.5z" />
          <path d="M12 5v11.5" />
        </IconFrame>
      );
    case "check":
      return (
        <IconFrame>
          <circle cx="12" cy="12" r="8" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </IconFrame>
      );
    case "privacy":
      return (
        <IconFrame>
          <path d="M12 3 5 6.5v5c0 4.2 2.7 7.2 7 8.5 4.3-1.3 7-4.3 7-8.5v-5z" />
        </IconFrame>
      );
    case "care":
      return (
        <IconFrame>
          <path d="M4 12h3l2-4 3 8 2-4h6" />
        </IconFrame>
      );
    case "together":
      return (
        <IconFrame>
          <circle cx="9" cy="10" r="3" />
          <circle cx="16" cy="10" r="3" />
          <path d="M4.5 19c.8-2.4 2.8-4 5.5-4s4.7 1.6 5.5 4M16 15c1.7 0 3.2.7 4 2" />
        </IconFrame>
      );
    case "ask":
      return (
        <IconFrame>
          <path d="M5 18.5 6.2 15A7 7 0 1 1 12 19a7.2 7.2 0 0 1-3-.6z" />
        </IconFrame>
      );
    case "settings":
      return (
        <IconFrame>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M17.6 6.4l-1.4 1.4M7.8 16.2 6.4 17.6" />
        </IconFrame>
      );
    case "report":
      return (
        <IconFrame>
          <path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z" />
          <path d="M14 3.5V8h4M10 12h5M10 15.5h5" />
        </IconFrame>
      );
    case "partner":
      return (
        <IconFrame>
          <circle cx="8" cy="9" r="2.75" />
          <circle cx="16" cy="9" r="2.75" />
          <path d="M3.5 19c.6-2.5 2.3-4 4.5-4s3.9 1.5 4.5 4M11.5 19c.6-2.5 2.3-4 4.5-4s3.9 1.5 4.5 4" />
        </IconFrame>
      );
    case "resources":
      return (
        <IconFrame>
          <path d="M5 4.5h14v15H5z" />
          <path d="M8 8h8M8 11.5h8M8 15h5" />
        </IconFrame>
      );
    case "notifications":
      return (
        <IconFrame>
          <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </IconFrame>
      );
    case "more":
      return (
        <IconFrame>
          <circle cx="6" cy="12" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="18" cy="12" r="1.25" fill="currentColor" stroke="none" />
        </IconFrame>
      );
    default: {
      const unreachable: never = id;
      return unreachable;
    }
  }
}
