import type { ReactNode } from "react";
import type { TFunction } from "i18next";

function Glyph({ picture }: { picture: string }) {
  if (picture === "ring") {
    return <circle cx="24" cy="24" r="10" fill="none" stroke="currentColor" strokeWidth="4" />;
  }
  if (picture === "bars") {
    return (
      <>
        <rect x="8" y="18" width="6" height="16" fill="currentColor" />
        <rect x="21" y="10" width="6" height="24" fill="currentColor" />
        <rect x="34" y="16" width="6" height="18" fill="currentColor" />
      </>
    );
  }
  if (picture === "cluster") {
    return (
      <>
        <circle cx="16" cy="28" r="6" fill="currentColor" />
        <circle cx="32" cy="28" r="6" fill="currentColor" />
        <circle cx="24" cy="16" r="6" fill="currentColor" />
      </>
    );
  }
  return <rect x="14" y="14" width="20" height="20" fill="currentColor" />;
}

export function pictureLabel(picture: string, t: TFunction): string {
  switch (picture) {
    case "ring":
      return t("pictures.ring", { ns: "check" });
    case "bars":
      return t("pictures.bars", { ns: "check" });
    case "cluster":
      return t("pictures.cluster", { ns: "check" });
    default:
      return t("pictures.unknown", { ns: "check" });
  }
}

export function OptionPicture({ picture }: { picture: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-12 w-12 text-teal-700"
      aria-hidden="true"
      data-picture={picture}
    >
      <Glyph picture={picture} />
    </svg>
  );
}
