import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ className, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-6 w-6 shrink-0 text-teal-700", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconAwareness(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </IconBase>
  );
}

export function IconComplexResults(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
      <path d="M9 12h6M9 16h4" />
    </IconBase>
  );
}

export function IconCounsellingAccess(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 15a4 4 0 0 1-4 4H8l-4 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" />
    </IconBase>
  );
}

export function IconPrivacyTrust(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </IconBase>
  );
}

export function IconFamily(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M4 20v-1a5 5 0 0 1 5-5h0M15 20v-1a4 4 0 0 1 4-4h0" />
      <circle cx="9" cy="16" r="2.5" />
    </IconBase>
  );
}

export function IconScreening(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M10 12l2 2 4-4" />
    </IconBase>
  );
}

export function IconDna(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 4c2 3 2 13 0 16M15 4c-2 3-2 13 0 16" />
      <path d="M7 8h10M7 16h10" />
    </IconBase>
  );
}

export function IconAssistant(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="8" width="16" height="10" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconShield(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </IconBase>
  );
}

export function IconMessages(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M17 6H7a2 2 0 0 0-2 2v9l3-3h9a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
    </IconBase>
  );
}

export function IconRespect(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21c-4-2-7-5-7-9V6l7-3 7 3v6c0 4-3 7-7 9z" />
    </IconBase>
  );
}

export function IconClarity(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </IconBase>
  );
}

export function IconGuidance(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 4v16M18 4v16M6 12h12" />
      <path d="M9 8h6M9 16h6" />
    </IconBase>
  );
}
