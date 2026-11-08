import type { TFunction } from "i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const contactClass =
  "inline-flex min-h-11 items-center text-teal-700 underline decoration-teal-700 underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500";

export function humanContact(t: TFunction): { contactHref: string; contactLabel: string } {
  return {
    contactHref: "/app/care",
    contactLabel: t("talk.button", { ns: "ask" }),
  };
}

export function ErrorState({
  title,
  retryLabel,
  onRetry,
  contactHref,
  contactLabel,
}: {
  title: string;
  retryLabel: string;
  onRetry: () => void;
  contactHref?: string;
  contactLabel?: string;
}) {
  return (
    <div
      role="alert"
      data-state="error"
      className="flex flex-col items-start gap-3 rounded-lg border border-danger-600 bg-sand-50 p-4"
    >
      <p>{title}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
        {contactHref !== undefined && contactLabel !== undefined ? (
          <Link to={contactHref} className={contactClass}>
            {contactLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
